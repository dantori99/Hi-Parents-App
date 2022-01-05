const path = require("path");
const crypto = require("crypto");
const validator = require("validator");
const { promisify } = require("util");
const cloudinary = require("cloudinary").v2;

exports.updateNannyValidator = async (req, res, next) => {
  try {
    const errors = [];

    //validator phone_number
    if (
      validator.isEmpty(req.body.phone_number, { ignore_whitespace: false })
    ) {
      errors.push("Please fill your phone number!");
    }

    //validator gender
    if (validator.isEmpty(req.body.gender, { ignore_whitespace: false })) {
      errors.push("Please fill your gender!");
    }

    if (
      !validator.isLength(req.body.phone_number, {
        min: 12,
      })
    ) {
      errors.push("Min 12 digits!");
    }

    // Check for the image of user profile nanny was upload or not

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
      await move(`./public/images/nannies/${file.name}`);

      const nannyPhoto = await cloudinary.uploader.upload(
        `./public/images/nannies/${file.name}`
      );

      req.body.photo = nannyPhoto;
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
