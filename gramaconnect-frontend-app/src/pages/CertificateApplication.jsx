// src/pages/CertificateApplication.jsx
import React, { useState } from "react";
import "./CertificateApplication.css";

const CertificateApplication = () => {
  const [certificateType, setCertificateType] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!certificateType || !applicantName) {
      alert("Please fill all required fields.");
      return;
    }

    // For now just simulate submission
    console.log("Form Submitted:", {
      certificateType,
      applicantName,
      file,
    });

    setSubmitted(true);
  };

  return (
    <div className="certificate-container">
      <h2>Apply for Certificates</h2>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="certificate-form">
          <label>Applicant Name *</label>
          <input
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label>Certificate Type *</label>
          <select
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value)}
            required
          >
            <option value="">-- Select Certificate --</option>
            <option value="birth">Birth Certificate</option>
            <option value="income">Income Certificate</option>
            <option value="ownership">Ownership Certificate</option>
          </select>

          <label>Upload Required Document</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.jpg,.png"
          />

          <button type="submit">Submit Application</button>
        </form>
      ) : (
        <div className="confirmation">
          <h3>✅ Application Submitted Successfully!</h3>
          <p>Certificate Type: {certificateType}</p>
          <p>Applicant: {applicantName}</p>
          <p>Status: Pending Verification</p>
        </div>
      )}
    </div>
  );
};

export default CertificateApplication;
