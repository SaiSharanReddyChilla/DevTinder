const validator = require("validator");

const validateSignUpPayload = (req) => {
  const { email, password, firstName, lastName } = req.body;

  if (!firstName) {
    throw new Error("Invalid first name!");
  } else if (firstName?.length < 3 || firstName?.length > 50) {
    throw new Error("First name cannot exceed 50 characters!");
  } else if (!lastName) {
    throw new Error("Invalid last name!");
  } else if (firstName?.length > 50) {
    throw new Error("Last name cannot exceed 50 characters!");
  } else if (!email) {
    throw new Error("Invalid email!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Incorrect email!");
  } else if (!password) {
    throw new Error("Invalid password!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak password!");
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
    if (!isAllowed) {
      isAllowed = {
        isAllowed,
        message: "Invalid update request!",
      };
    } else {
      const { age, about, skills, photoUrl } = req.body;
      if (age && (age < 18 || age > 60)) {
        isAllowed = {
          isAllowed: false,
          message: "Invalid update request: age must be between 18 to 60!",
        };
      } else if (about && about?.length > 100) {
        isAllowed = {
          isAllowed: false,
          message:
            "Invalid update request: about cannot exceed 100 characters!",
        };
      } else if (skills && Array.isArray(skills) && skills?.length > 10) {
        isAllowed = {
          isAllowed: false,
          message: "Invalid update request: skills cannot exceed 10!",
        };
      } else if (photoUrl && !validator.isURL(photoUrl)) {
        isAllowed = {
          isAllowed: false,
          message: "Invalid update request: photo url is not valid!",
        };
      } else {
        isAllowed = {
          isAllowed: true,
          message: "",
        };
      }
    }
    return isAllowed;
  } catch (err) {
    console.log("Validation failed!", err?.message);
  }
};

const validateProfilePassword = async (req) => {
  try {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return {
        valid: false,
        message: "Password cannot be empty!",
      };
    }

    const { user } = req;

    const isPasswordValid = await user.validatePassword(req);

    if (!isPasswordValid) {
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
  } catch (err) {
    console.log("Validation failed!", err?.message);
  }
};

module.exports = {
  validateSignUpPayload,
  validateProfileUpdatePayload,
  validateProfilePassword,
};
