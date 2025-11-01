const validator = require("validator");

function validateSignUpData(req) {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) throw new Error("Invalid name");
  else if (!validator.isEmail(emailId)) throw new Error("Invalid email");
  else if (!validator.isStrongPassword(password))
    throw new Error("Password is not strong");
}

function validateEditProfileData(req) {
  const allowedFieldsForEdit = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "about",
  ];

  const isFieldsAllowedToUpdates = Object.keys(req.body).every((field) =>
    allowedFieldsForEdit.includes(field)
  );

  return isFieldsAllowedToUpdates;
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
