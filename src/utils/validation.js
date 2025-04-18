const validator = require("validator");
const bcrypt = require("bcrypt");

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

const validateProfileUpdatePayload = (req) => {
  try {
    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "email",
      "age",
      "gender",
      "about",
      "skills",
      "photoUrl",
    ];
    let isAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_FIELDS.includes(key)
    );
    const { about, skills } = req.body;
    if (!isAllowed) {
      isAllowed = {
        allowed: isAllowed,
        message: "Invalid Update Request!",
      };
    } else if (about && about?.length >= 200) {
      isAllowed = {
        allowed: false,
        message: "About cannot exceed 200 characters!",
      };
    } else if (skills && Array.isArray(skills) && skills?.length > 10) {
      isAllowed = {
        allowed: false,
        message: "skills cannot exceed 10!",
      };
    } else {
      isAllowed = {
        allowed: true,
        message: "",
      };
    }
    return isAllowed;
  } catch (err) {
    throw new Error("Validation Failed!!!");
  }
};

const validateProfilePassword = async (req) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return {
      valid: false,
      message: "Password cannot be empty!",
    };
  }
  const { user } = req;
  const isPwdValid = await bcrypt.compare(password, user?.password);
  if (!isPwdValid) {
    return {
      valid: false,
      message: "Incorrect password!",
    };
  } else {
    if (!validator.isStrongPassword(newPassword)) {
      return {
        valid: false,
        message: "New password is not strong!",
      };
    } else {
      return {
        valid: true,
        message: "",
      };
    }
  }
};

module.exports = {
  validateSignUpPayload,
  validateProfileUpdatePayload,
  validateProfilePassword,
};
