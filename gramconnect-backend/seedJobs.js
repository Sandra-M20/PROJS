// seedJobs.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("./models/Job");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Job.deleteMany();
    await Job.insertMany([
      {
        title: "Community Health Worker",
        description: "Assist in public health campaigns.",
        category: "Health",
        type: "Part-time",
        ward: "10",
        address: "Kudumbashree Office, Ward 10",
        pay: 8000,
        company: "Kudumbashree Unit",
        isOpen: true,
      },
      {
        title: "Data Entry Assistant",
        description: "Manage digital records of Panchayat.",
        category: "Admin",
        type: "Full-time",
        ward: "4",
        address: "Panchayat Office",
        pay: 12000,
        company: "Palakkad Panchayat",
        isOpen: true,
      },
    ]);
    console.log("✅ Jobs seeded");
    process.exit(0);
  })
  .catch((err) => console.error(err));
