const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (firstName?.length < 4 || firstName?.length > 25) {
    throw new Error("Name must be between 3-25 characters!");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid Email!");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password!");
  }
};

module.exports = {
  validateSignUpData,
};
