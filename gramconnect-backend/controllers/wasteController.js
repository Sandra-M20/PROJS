const WasteRequest = require("../models/WasteRequest");

exports.createWasteRequest = async (req, res) => {
  try {
    const { citizenName, address, wasteType, lat, lng } = req.body;
    const photo = req.file ? req.file.path : null;

    const newRequest = new WasteRequest({
      citizenName,
      address,
      wasteType,
      photo,
      location: { lat, lng },
    });

    await newRequest.save();
    res.json({ message: "Waste pickup request submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating waste request", error });
  }
};

exports.getWasteRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching waste requests" });
  }
};

exports.updateWasteStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    await WasteRequest.findByIdAndUpdate(req.params.id, { status, assignedTo });
    res.json({ message: "Waste status updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};
