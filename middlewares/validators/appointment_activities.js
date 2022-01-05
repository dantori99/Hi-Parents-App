const path = require("path");
const crypto = require("crypto");
const validator = require("validator");
const { promisify } = require("util");
const cloudinary = require("cloudinary").v2;

exports.activitiesValidators = async (req, res, next) => {
  try {
    const errors = [];

    //validator activity detail
    if (
      validator.isEmpty(req.body.activity_detail, { ignore_whitespace: false })
    ) {
      errors.push("Please fill your children activity!");
    }

    //validator time
    if (validator.isEmpty(req.body.time, { ignore_whitespace: false })) {
      errors.push("Please fill the time!");
    }

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
      await move(`./public/images/activities/${file.name}`);

      const activityPhoto = await cloudinary.uploader.upload(
        `./public/images/activities/${file.name}`
      );

      req.body.photo = activityPhoto;
      // assign req.body.photo with file.name
      // req.body.photo = `https://hi-parent-be.herokuapp.com/images/events/${file.name}`;
    } else {
      return res.json(["photo must be filled"]);
    }

    next();
  } catch (error) {
    console.log(error);
    // next(error);
  }
};
