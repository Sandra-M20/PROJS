
module.exports = {
  isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone); // Indian mobile number pattern
  },

  isStrongPassword(password) {
    return password.length >= 6; // simple rule; can expand later
  },

  validateComplaintInput(data) {
    if (!data.title || !data.description) {
      return "Complaint title and description are required.";
    }
    return null; // valid
  },
};
