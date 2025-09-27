// routes/jobRoutes.js
const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { auth, only } = require("../middleware/auth");
const { uploadLogo, uploadResume } = require("../utils/uploader");

const router = express.Router();

/**
 * POST /api/jobs
 * Employer creates job (with optional logo upload)
 */
router.post("/", auth, only(["employer", "officer"]), uploadLogo.single("logo"), async (req, res) => {
  try {
    const { title, description, category, type, ward, address, lat, lng, skills = [], pay, company } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Missing fields" });
    const job = await Job.create({
      title,
      description,
      category,
      type,
      ward,
      address,
      lat,
      lng,
      pay,
      company,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s=>s.trim()) : []),
      employer: req.user._id,
      logoUrl: req.file ? `/uploads/logos/${req.file.filename}` : undefined,
    });
    res.json(job);
  } catch (e) {
    res.status(500).json({ message: "Create job failed" });
  }
});

/**
 * GET /api/jobs
 * Filters: q, category, type, ward, openOnly
 */
router.get("/", async (req, res) => {
  try {
    const { q, category, type, ward, openOnly = "true" } = req.query;
    const filter = {};
    if (q) filter.$or = [{ title: new RegExp(q, "i") }, { description: new RegExp(q, "i") }, { company: new RegExp(q, "i") }];
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (ward) filter.ward = ward;
    if (openOnly === "true") filter.isOpen = true;

    const items = await Job.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Fetch jobs failed" });
  }
});

/**
 * GET /api/jobs/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name phone ward");
    res.json(job);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
  }
});

/**
 * POST /api/jobs/:id/apply
 * Seeker applies with resume upload
 */
router.post("/:id/apply", auth, only(["seeker"]), uploadResume.single("resume"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isOpen) return res.status(400).json({ message: "Job closed or not found" });

    const exists = await Application.findOne({ job: job._id, seeker: req.user._id });
    if (exists) return res.status(400).json({ message: "Already applied" });

    const { coverLetter } = req.body;
    const app = await Application.create({
      job: job._id,
      seeker: req.user._id,
      coverLetter,
      resumeUrl: req.file ? `/uploads/resumes/${req.file.filename}` : undefined,
    });

    res.json({ message: "Applied", data: app });
  } catch (e) {
    res.status(500).json({ message: "Apply failed" });
  }
});

/**
 * GET /api/jobs/my/applications – seeker’s applications
 */
router.get("/my/applications", auth, only(["seeker"]), async (req, res) => {
  const items = await Application.find({ seeker: req.user._id }).populate("job");
  res.json(items);
});

/**
 * GET /api/jobs/employer/manage – employer dashboard
 */
router.get("/employer/manage", auth, only(["employer", "officer"]), async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
  const apps = await Application.find({ job: { $in: jobs.map(j => j._id) } })
    .populate("job")
    .populate("seeker", "name phone skills ward");
  res.json({ jobs, apps });
});

/**
 * PATCH /api/jobs/applications/:id – update app status
 */
router.patch("/applications/:id", auth, only(["employer", "officer"]), async (req, res) => {
  const { status } = req.body;
  const ok = ["Applied", "Shortlisted", "Selected", "Rejected"];
  if (!ok.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const app = await Application.findById(req.params.id).populate("job");
  if (!app) return res.status(404).json({ message: "Not found" });

  if (req.user.role === "employer" && String(app.job.employer) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not your job" });
  }

  app.status = status;
  await app.save();
  res.json(app);
});

/**
 * GET /api/jobs/suggest?skills=a,b,c – matching
 */
router.get("/suggest", async (req, res) => {
  const skills = (req.query.skills || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!skills.length) return res.json([]);
  const items = await Job.find({ skills: { $in: skills }, isOpen: true }).limit(20);
  res.json(items);
});

module.exports = router;
