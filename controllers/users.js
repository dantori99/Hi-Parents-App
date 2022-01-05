const { users, parents, nannies, sequelize } = require("../models");
const {
  decrypt,
  encrypt,
  createToken,
  verifyToken,
} = require("../utils/index");
const isEmpty = (str) => !str.trim().length;
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hiparent.id@gmail.com",
    pass: "Hiparent123",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
class Users {
  async verifyEmail(req, res, next) {
    try {
      const { data } = req.query;
      const decryptedEmail = decodeURIComponent(data);

      const resData = await users.findOne({
        where: { isVerified: decryptedEmail },
      });
      if (resData == null)
        return res.json({ statusCode: 404, message: "endpoint not found" });

      await users.update(
        { isVerified: "true" },
        { where: { isVerified: decryptedEmail } }
      );
      res.send("Email berhasil di Aktivasi");
    } catch (error) {
      console.log(error);
    }
  }
  async registration(req, res, next) {
    try {
      // find user

      const data = await users.findOne({
        where: {
          email: req.body.email,
        },
        attributes: {
          exclude: ["updatedAt", "deletedAt", "password", "token"],
        },
      });
      if (data == null) {
        let { name, email, role, password } = req.body;
        const errors = [];
        if (isEmpty(name))
          errors.push(
            "Name is required, Invalid email, Password must be at least 10 characters, Name must be at least 5 characters"
          );
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
          errors.push(
            "Name is required, Invalid email, Password must be at least 10 characters, Name must be at least 5 characters"
          );
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\,])(?=.{10,20})/.test(
            password
          )
        )
          errors.push(
            "Name is required, Invalid email, Password must be at least 10 characters, Name must be at least 5 characters"
          );
        if (role == null)
          errors.push(
            "Name is required, Invalid email, Password must be at least 10 characters, Name must be at least 5 characters"
          );
        if (errors.length > 0) {
          return res.status(400).json({ statusCode: 400, errors: errors });
        }
        password = encrypt(password);
        const encryptedEmail = encrypt(email);
        const newData = await users.create({
          name,
          email,
          role,
          password,
          isVerified: encryptedEmail,
        });
        let mailOptions = {
          from: "hiparent.id@gmail.com",
          to: newData.email,
          subject: "Registration Success!",
          html: `<html>
          <p><a href="https://hi-parent-be.herokuapp.com/users/verify?data=${encodeURIComponent(
            encryptedEmail
          )}">Click here</a> to verify</p></html>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ` + info.response);
          }
        });
        const pad = (num, size) => {
          num = num.toString();
          while (num.length < size) num = "0" + num;
          return num;
        };
        if (newData.role.toLowerCase() === "nanny") {
          const resNanny = await nannies.create(req.body, {
            attributes: {
              name: newData.name,
              email: newData.email,
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          });
          await nannies.update(
            { nanny_id: pad(resNanny.id, 3) },
            {
              where: {
                email: newData.email,
              },
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            }
          );
          const resData = await nannies.findOne({
            where: {
              email: newData.email,
            },
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          });

          res.status(201).json({
            statusCode: 201,
            message: "Congrats! You have successfully created an account.",
            data: resData,
          });
        } else if (newData.role.toLowerCase() === "parent") {
          const resParent = await parents.create(req.body, {
            attributes: {
              name: newData.name,
              email: newData.email,
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          });
          await parents.update(
            { client_id: pad(resParent.id, 3) },
            {
              where: {
                email: newData.email,
              },
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            }
          );
          const resData = await parents.findOne({
            where: {
              email: newData.email,
            },
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          });
          res.status(201).json({
            statusCode: 201,
            message: "Congrats! You have successfully created an account.",
            data: resData,
          });
        }
      } else {
        res.status(400).json({
          statusCode: 400,
          message: "Email is already exist!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ statusCode: 500, message: "ERROR Creating User" });
    }
  }
  async updatePassword(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({ where: { token } });

      const data = await users.findOne({
        where: { id: currentUser.id },
      });
      let { oldPassword, newPassword } = req.body;
      let userPass = data.password;
      userPass = decrypt(oldPassword, data.password);

      if (!userPass) {
        return res.status(400).json({
          statusCode: 403,
          message: "Wrong password!",
        });
      }

      if (decrypt(newPassword, data.password)) {
        return res.status(400).json({
          statusCode: 403,
          message: "Please create a new password!",
        });
      }

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\,])(?=.{10,20})/.test(
          newPassword
        )
      )
        return res.status(400).json({
          statusCode: 403,
          message: "Password must be at least 10 characters!",
        });

      await users.update(
        { password: encrypt(newPassword) },
        { where: { id: currentUser.id } }
      );
      const result = await users.findOne({ where: { id: currentUser.id } });

      res.status(200).json({ message: "succes", data: result });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "error updating user password" });
    }
  }
  async loginGoogle(req, res, next) {
    try {
      const data = await users.findOne({ where: { email: req.body.email } });
      if (!data)
        return res.json({
          statusCode: 500,
          message: "This account has not registered yet! ",
        });

      const { name, email, role } = data.dataValues;

      const tmpToken = {
        name,
        email,
        role,
      };

      const token = createToken(tmpToken);
      await sequelize.query(
        `UPDATE users SET token='${token}' WHERE id=${data.id}`
      );

      res.status(200).json({
        statusCode: 200,
        message: "Congrats! You have successfully sign in!",
        token,
        role: tmpToken.role,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async login(req, res, next) {
    const data = await users.findOne({
      where: { email: req.body.email },
    });

    if (data == null) {
      return res.status(500).json({
        statusCode: 500,
        message: "Invalid email or password!",
      });
    }

    if (data.isVerified != "true")
      return res.json({
        statusCode: 500,
        message: "This account has not verified yet!",
      });

    let errormsg = [];
    if (data == null) {
      errormsg.push("Invalid email or password");
    }

    if (errormsg.length > 0) {
      return res.status(500).json({ errormsg });
    }

    let validPass = decrypt(req.body.password, data.password);
    if (!validPass) {
      errormsg.push("Invalid email or password");
    }

    if (errormsg.length > 0) {
      return res.status(500).json({ errormsg });
    }

    const { name, email, role } = data.dataValues;

    const tmpToken = {
      name,
      email,
      role,
    };

    const token = createToken(tmpToken);
    await sequelize.query(
      `UPDATE users SET token='${token}' WHERE id=${data.id}`
    );

    res.status(200).json({
      statusCode: 200,
      message: "Congrats! You have successfully sign in!",
      token,
      role: tmpToken.role,
    });
  }
}

module.exports = new Users();
