const {
  nannies,
  children,
  appointments,
  users,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

const pagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = ((page - 1) * limit) | 0;

  return { limit, offset };
};

const paging = (data, items, page, limit) => {
  // const { count: items, rows: nannies } = data.dataNannies;
  console.log(">>>>>>DATA", data.length);
  //  items = items;
  const onPage = page ? +page : 1;
  const pages = Math.ceil(items / limit);
  const nannies = data;

  return { items, nannies, pages, onPage };
};

class Nannies {
  async nannyList(req, res, next) {
    try {
      const { page, size, orders = "id", sort = "DESC" } = req.query;
      const { limit, offset } = pagination(page, size);

      const dataNanny = await nannies.findAndCountAll({
        limit,
        offset,

        order: [[orders || "name" || "nanny_id", sort || "ASC"]],
      });
      // console.log(dataNanny, ">>>>DATANANNY");
      const nannyRows = dataNanny.rows;

      // return console.log(nannyRows[0].dataValues);
      const dataAppointment = await appointments.findAndCountAll();
      const appointmentRows = dataAppointment.rows;
      // return console.log(appointmentRows, ">>>>APPOINTMENTROWS<<<<");

      // let result = [];

      //create default value number of child and add field numberOfChild and status
      for (let i = 0; i < nannyRows.length; i++) {
        nannyRows[i].dataValues["numberOfChild"] = 0;
        nannyRows[i].dataValues["status"] = "Inactive";
      }

      for (let i = 0; i < appointmentRows.length; i++) {
        // console.log(i)
        const nanny_id = appointmentRows[i].nanny_id; //get nanny_id appointment

        // console.log(">>>>>>>>NANNYID", nanny_id);
        const found = nannyRows.findIndex((x) => x.nanny_id === nanny_id); //get index value between nanny_id nannies and appointment
        if (found >= 0) {
          nannyRows[found].dataValues["numberOfChild"] =
            nannyRows[found].dataValues["numberOfChild"] + 1;
          nannyRows[found].dataValues["status"] = "Active";
        }
        // console.log(nannyRows[found], ">>>>RESULTNANNYROWS<<<<<<");
      }

      // console.log(">>>>>>FOUND", found);
      // return console.log(">>>>NANNYROWS<<<<", nannyRows.length);

      res.status(200).json(paging(nannyRows, dataNanny.count, page, limit));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async nannyListSearch(req, res, next) {
    try {
      const { page, size, orders = "id", sort = "DESC" } = req.query;
      const { limit, offset } = pagination(page, size);

      const search = req.body.search;

      const dataNanny = await nannies.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },

        limit,
        offset,

        order: [[orders || "name" || "nanny_id", sort || "ASC"]],
      });

      const nannyRows = dataNanny.rows;

      const dataAppointment = await appointments.findAndCountAll();
      const appointmentRows = dataAppointment.rows;

      for (let i = 0; i < nannyRows.length; i++) {
        nannyRows[i].dataValues["numberOfChild"] = 0;
        nannyRows[i].dataValues["status"] = "Inactive";
      }

      for (let i = 0; i < appointmentRows.length; i++) {
        const nanny_id = appointmentRows[i].nanny_id;

        const found = nannyRows.findIndex((x) => x.nanny_id === nanny_id);
        if (found >= 0) {
          nannyRows[found].dataValues["numberOfChild"] =
            nannyRows[found].dataValues["numberOfChild"] + 1;
          nannyRows[found].dataValues["status"] = "Active";
        }
      }

      res.status(200).json(paging(nannyRows, dataNanny.count, page, limit));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async nannyListByStatusActive(req, res, next) {
    try {
      const { sort = "ASC" } = req.query;
      const nanny = await nannies.findAll({
        order: [["name", sort || "DESC"]],
      });
      const appointment = await appointments.findAll({});

      //default numberofchild and status

      for (let i = 0; i < nanny.length; i++) {
        nanny[i].dataValues["numberOfChild"] = 0;
        nanny[i].dataValues["status"] = "Inactive";
      }

      for (let i = 0; i < appointment.length; i++) {
        const nanny_id = appointment[i].nanny_id;
        const found = nanny.findIndex((x) => x.nanny_id === nanny_id);

        if (found >= 0) {
          nanny[found].dataValues["numberOfChild"] =
            nanny[found].dataValues["numberOfChild"] + 1;
          nanny[found].dataValues["status"] = "Active";
        }
      }

      let status = [];

      for (let i = 0; i < nanny.length; i++) {
        let statusNanny = nanny[i].dataValues;
        if (statusNanny.status === "Active") {
          status.push(statusNanny);
        }
      }

      res.status(200).json({ statusCode: 200, activeNanny: status });
    } catch (error) {
      next(error);
    }
  }

  async nannyListByStatusInactive(req, res, next) {
    try {
      const { sort = "ASC" } = req.query;
      const nanny = await nannies.findAll({
        order: [["name", sort || "DESC"]],
      });
      const appointment = await appointments.findAll({});

      //default numberofchild and status

      for (let i = 0; i < nanny.length; i++) {
        nanny[i].dataValues["numberOfChild"] = 0;
        nanny[i].dataValues["status"] = "Inactive";
      }

      for (let i = 0; i < appointment.length; i++) {
        const nanny_id = appointment[i].nanny_id;
        const found = nanny.findIndex((x) => x.nanny_id === nanny_id);

        if (found >= 0) {
          nanny[found].dataValues["numberOfChild"] =
            nanny[found].dataValues["numberOfChild"] + 1;
          nanny[found].dataValues["status"] = "Active";
        }
      }

      let status = [];

      for (let i = 0; i < nanny.length; i++) {
        let statusNanny = nanny[i].dataValues;
        if (statusNanny.status === "Inactive") {
          status.push(statusNanny);
        }
      }

      res.status(200).json({ statusCode: 200, inactiveNanny: status });
    } catch (error) {}
  }

  async updateProfileNanny(req, res, next) {
    try {
      //get token from headers bearer
      const token = req.headers.authorization.replace("Bearer ", "");

      //match token with users
      const currentUser = await users.findOne({
        where: { token },
      });

      //to make sure nanny and user are the same person
      const currentNanny = await nannies.findOne({
        where: { email: currentUser.email },
      });

      let { name, phone_number, gender } = req.body;
      const photo = req.body.photo.url;

      const data = await nannies.findOne({
        where: { email: currentUser.email },
      });

      //update data
      if (!name) {
        await nannies.update(
          {
            name: data.name,
            phone_number,
            gender,
            photo,
          },
          { where: { id: currentNanny.id } }
        );
      } else {
        await nannies.update(
          {
            name,
            phone_number,
            gender,
            photo,
          },
          { where: { id: currentNanny.id } }
        );
      }

      //get data updated
      const resData = await nannies.findOne({
        where: { email: currentUser.email },
      });

      res.status(201).json({
        statusCode: 201,
        message: "Success Update Your Profile!",
        data: resData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileNanny(req, res, next) {
    try {
      //get token from headers bearer
      const token = req.headers.authorization.replace("Bearer ", "");

      //match token with users
      const currentUser = await users.findOne({
        where: { token },
      });
      // return console.log(currentUser.email);

      let data = await nannies.findOne({
        where: { email: currentUser.email },
      });

      res.status(200).json({
        statusCode: 200,
        message: "This is your profile, Nanny!",
        userProfile: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async childrenNanny(req, res, next) {
    try {
      const data = await nannies.findOne({
        where: { nanny_id: req.params.nanny_id },
        attributes: ["name", "nanny_id"],
        include: [
          {
            model: appointments,
            attributes: ["appointment_id"],
            include: [{ model: children, attributes: ["name"] }],
          },
        ],
      });

      res.json({ data });
    } catch (error) {
      return res.send("Error getting nanny children");
    }
  }
  //

  async activeNannyDashboard(req, res, next) {
    try {
      // TODO: socket.io
      const appointment = await appointments.findAll({
        attributes: ["nanny_id"],
        group: ["nanny_id"],
        where: {
          nanny_id: {
            [Op.ne]: null,
          },
        },
      });

      const activeNanny = Array.from(
        new Set(appointment.map((x) => x.nanny_id))
      ).length;

      // return console.log(">>>>>>APPOINTMENT", appointment.dataValues);

      let trueNanny = [];

      for (let i = 0; i < appointment.length; i++) {
        let a = appointment[i].dataValues;
        trueNanny.push(a);
      }

      // return console.log(">>>>>>TRUENANNY", trueNanny);

      let result = [];
      for (let i = 0; i < trueNanny.length; i++) {
        const nanny = trueNanny[i].nanny_id;
        // console.log(">>>>>NANNY", nanny);
        result.push(nanny);
      }

      // return console.log(">>>RESULT", result);

      const dataNanny = await nannies.findAll({
        where: { nanny_id: result },
      });

      // return console.log(">>>>>>DATANANNY", dataNanny);

      res.status(200).json({ statusCode: 200, activeNanny, dataNanny });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Nannies();
