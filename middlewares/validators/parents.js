const path = require("path");
const crypto = require("crypto");
const validator = require("validator");
const { promisify } = require("util");
const cloudinary = require("cloudinary").v2;

exports.parentValidators = async (req, res, next) => {
  try {
    const errors = [];

    //validator phone_number is Empty
    if (
      validator.isEmpty(req.body.phone_number, { ignore_whitespace: false })
    ) {
      errors.push("Please fill your phone number!");
    }
    //validator phone_number
    function validateNumber(number) {
      const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      return re.test(number);
    }
    if (!validateNumber(req.body.phone_number)) {
      errors.push("Please fill your number correct");
    }

    //validator address is Empty
    if (validator.isEmpty(req.body.address, { ignore_whitespace: false })) {
      errors.push("please fill your address");
    }

    //validator job is Empty
    if (validator.isEmpty(req.body.job, { ignore_whitespace: false })) {
      errors.push("please fill your job");
    }

    //validator place birth is Empty
    if (validator.isEmpty(req.body.place_birth, { ignore_whitespace: false })) {
      errors.push("please fill your job");
    }

    //validator date birth is Empty
    if (validator.isEmpty(req.body.date_birth, { ignore_whitespace: false })) {
      errors.push("Please fill your children Date Birth! (DD/MM/YYYY)");
    }

    //validator format date birth
    if (
      !validator.isDate(req.body.date_birth, {
        format: "DD/MM/YYYY",
        strictMode: true,
      })
    ) {
      errors.push("please use correct format (DD/MM/YYYY)");
    }

    //validator gender
    if (validator.isEmpty(req.body.gender, { ignore_whitespace: false })) {
      errors.push("Please fill your gender!");
    }

    if (
      !validator.isLength(req.body.phone_number, {
        min: 11,
      })
    ) {
      errors.push("Please fill number min 11 digits!");
    }

    // Check for the image of user profile parent was upload or not

    //validator photo
    if (req.files != null) {
      const file = req.files.photo;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
      }

      // Check file size (max 1MB)
      if (file.size > 3000000) {
        errors.push("Image must be less than 3MB");
      }

      // If error
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // Make file.mv to promise
      const move = promisify(file.mv);

      // Upload image to /public/images
      await move(`./public/images/parents/${file.name}`);

      const parentPhoto = await cloudinary.uploader.upload(
        `./public/images/parents/${file.name}`
      );

      req.body.photo = parentPhoto;

      // assign req.body.photo with file.name
      // req.body.photo = `https://hi-parent-be.herokuapp.com/images/events/${file.name}`;
    } else {
      return res.json(["photo must be filled"]);
    }

    next();
  } catch (error) {
    next(error);
  }
};
