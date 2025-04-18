const validator = require("validator");

const validateSignUpPayload = (req) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName) {
      throw new Error("Invalid First Name");
    } else if (!lastName) {
      throw new Error("Invalid Last Name");
    } else if (!email || !validator.isEmail(email)) {
      throw new Error("Invalid Email");
    } else if (!password) {
      throw new Error("Invalid Password");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password Is Not Strong");
    }
  } catch (err) {
    throw new Error("Validation Failed!!!");
  }
};

module.exports = {
  validateSignUpPayload,
};
