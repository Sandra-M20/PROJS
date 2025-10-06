
module.exports = {
  generateRandomId(prefix = "ID") {
    return `${prefix}-${Math.floor(Math.random() * 1000000)}`;
  },

  formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN");
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
