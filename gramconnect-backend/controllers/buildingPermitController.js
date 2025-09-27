const BuildingPermit = require("../models/BuildingPermit");
const { simplePlanVerifier } = require("../services/aiCheckService");
const { sendEmail, sendSMS } = require("../utils/notify"); // will add in step 5

// Citizen applies
exports.applyPermit = async (req, res) => {
  try {
    const { owner, plotLocation, applicantEmail, applicantPhone, lat, lng } = req.body;
    const filePath = req.file ? req.file.path : "";

    const ai = simplePlanVerifier(filePath, plotLocation);

    const newPermit = new BuildingPermit({
      owner,
      plotLocation,
      applicantEmail,
      applicantPhone,
      geo: { lat: lat ? +lat : undefined, lng: lng ? +lng : undefined },
      planFile: filePath,
      aiCheck: ai,
      status: "Pending",
      timeline: [{ status: "Pending", by: "system", note: "Application submitted" }]
    });

    await newPermit.save();

    // Optional email to citizen confirming receipt
    if (applicantEmail) {
      sendEmail(applicantEmail, "Permit Received", "We received your application. Status: Pending.");
    }

    res.status(201).json({ message: "Permit Application Submitted!", permit: newPermit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// List all (for officer dashboard)
exports.getPermits = async (req, res) => {
  try {
    const permits = await BuildingPermit.find().sort({ appliedDate: -1 });
    res.json(permits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Citizen view (filter by email if no login yet)
exports.getMyPermits = async (req, res) => {
  try {
    const { email } = req.query;
    const permits = await BuildingPermit.find({ applicantEmail: email }).sort({ appliedDate: -1 });
    res.json(permits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Officer updates status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const officerEmail = req.user?.email || "officer"; // from JWT (step 4)

    const permit = await BuildingPermit.findById(id);
    if (!permit) return res.status(404).json({ error: "Not found" });

    permit.status = status;
    permit.timeline.push({ status, by: officerEmail, note });
    await permit.save();

    // notify citizen
    if (permit.applicantEmail) {
      sendEmail(
        permit.applicantEmail,
        `Permit ${status}`,
        `Your permit is ${status}. ${note ? "Note: " + note : ""}`
      );
    }
    if (permit.applicantPhone) {
      sendSMS(permit.applicantPhone, `Your permit status: ${status}`);
    }

    res.json({ message: "Status updated", permit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
