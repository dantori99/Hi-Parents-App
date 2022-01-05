const {
  children,
  appointments,
  users,
  parents,
  nannies,
  sequelize,
} = require("../models");
const Op = require("sequelize").Op;
const moment = require("moment");

const { emitSocket } = require("../middlewares/socket");

const pagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = ((page - 1) * limit) | 0;

  return { limit, offset };
};

const paging = (data, items, page, limit, message) => {
  // console.log(">>>>ITEMS", items);
  const onPage = page ? +page : 1;
  const pages = Math.ceil(items / limit);
  const appointments = data;

  return { items, appointments, pages, onPage, message };
};
class Appointments {
  async getAppointments(req, res, next) {
    try {
      const resData = await appointments.findAll({
        limit: 5,
        order: [["updatedAt", "DESC"]],
        attributes: ["date_request", "appointment_status", "appointment_id"],
        include: [
          {
            model: children,
            include: [
              {
                model: parents,
              },
            ],
          },
        ],
      });
      resData.map((ngantuk) => {
        ngantuk.dataValues.date_request = moment(
          ngantuk.dataValues.date_request
        ).format("DD/MM/YYYY hh:mm A");
      });
      res.status(200).json({
        statusCode: 200,
        message: "success getting appointments",
        data: resData,
      });
    } catch (error) {
      // return console.error(error);
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getFeAppointments(req, res, next) {
    try {
      const { page, size, sort = "DESC" } = req.query;
      const { limit, offset } = pagination(page, size);

      const resData = await appointments.findAndCountAll({
        attributes: ["date_request", "appointment_status", "appointment_id"],
        include: [
          {
            model: children,
            attributes: ["name"],
            include: [
              {
                model: parents,
                attributes: ["name", "client_id"],
              },
            ],
          },
        ],

        limit,
        offset,
        order: [["date_request", sort || "ASC"]],
      });

      const data = resData.rows;
      data.map((x) => {
        x.dataValues.date_request = moment(x.dataValues.date_request).format(
          "DD/MM/YYYY hh:mm A"
        );
      });

      res.status(200).json(paging(data, resData.count, page, limit, "Success"));
    } catch (error) {
      console.log(error);
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getFeAppointmentsSearchChild(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = pagination(page, size);
      const search = req.body.search;

      const resData = await appointments.findAndCountAll({
        attributes: ["date_request", "appointment_status", "appointment_id"],
        include: [
          {
            model: children,
            where: {
              name: {
                [Op.iLike]: `%${search}%`,
              },
            },
            attributes: ["name"],
            include: [
              {
                model: parents,
                attributes: ["name", "client_id"],
              },
            ],
          },
        ],

        limit,
        offset,
      });

      if (resData.count === 0) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "Data not found" });
      }

      const data = resData.rows;
      data.map((x) => {
        x.dataValues.date_request = moment(x.dataValues.date_request).format(
          "DD/MM/YYYY hh:mm A"
        );
      });

      res.status(200).json(paging(data, resData.count, page, limit, "Success"));
    } catch (error) {
      console.log(error);
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getFeAppointmentsPending(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = pagination(page, size);
      const { sort = "DESC" } = req.query;

      const resData = await appointments.findAndCountAll({
        attributes: ["date_request", "appointment_status", "appointment_id"],
        where: { appointment_status: "Pending" },
        include: [
          {
            model: children,
            attributes: ["name"],
            include: [
              {
                model: parents,
                attributes: ["name", "client_id"],
              },
            ],
          },
        ],

        limit,
        offset,

        order: [["date_request", sort || "ASC"]],
      });

      if (resData.count === 0) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "Data not found" });
      }

      const data = resData.rows;
      data.map((x) => {
        x.dataValues.date_request = moment(x.dataValues.date_request).format(
          "DD/MM/YYYY hh:mm A"
        );
      });

      res.status(200).json(paging(data, resData.count, page, limit, "Success"));
    } catch (error) {
      console.log(error);
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getFeAppointmentsAccepted(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = pagination(page, size);
      const { sort = "DESC" } = req.query;

      const resData = await appointments.findAndCountAll({
        attributes: ["date_request", "appointment_status", "appointment_id"],
        where: { appointment_status: "Accept" },
        include: [
          {
            model: children,
            attributes: ["name"],
            include: [
              {
                model: parents,
                attributes: ["name", "client_id"],
              },
            ],
          },
        ],

        limit,
        offset,

        order: [["date_request", sort || "ASC"]],
      });

      if (resData.count === 0) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "Data not found" });
      }

      const data = resData.rows;
      data.map((x) => {
        x.dataValues.date_request = moment(x.dataValues.date_request).format(
          "DD/MM/YYYY hh:mm A"
        );
      });

      res.status(200).json(paging(data, resData.count, page, limit, "Success"));
    } catch (error) {
      console.log(error);
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getAppointmentsDetail(req, res, next) {
    try {
      const resData = await appointments.findAll({
        where: {
          appointment_id: req.params.appointment_id,
        },
      });

      const data = await appointments.findAll({
        where: { appointment_id: resData[0].dataValues.appointment_id },
        attributes: ["appointment_id", "appointment_status"],
        include: [
          {
            model: children,
            where: { child_id: resData[0].dataValues.child_id },
            include: [
              {
                model: parents,
              },
            ],
          },
        ],
      });

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data,
      });
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getAllAppointments(req, res, next) {
    try {
      const data = await appointments.findAll({
        include: [
          {
            model: children,
            include: [
              {
                model: parents,
              },
            ],
          },
        ],
      });

      if (!data) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "Data not found" });
      }

      res.status(200).json({ statusCode: 200, data, message: "Success" });
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getAllAppointmentsSearchChild(req, res, next) {
    try {
      const search = req.body.search;

      const appmnt = await appointments.findAndCountAll({
        include: [
          {
            model: children,
            where: {
              name: {
                [Op.iLike]: `%${search}%`,
              },
            },
            include: [
              {
                model: parents,
              },
            ],
          },
        ],
      });

      if (appmnt.count === 0) {
        return res
          .status(404)
          .json({ statusCode: 404, message: "Data not found" });
      }

      res
        .status(200)
        .json({ statusCode: 200, data: appmnt, message: "Success" });
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async createAppointment(req, res, next) {
    try {
      // todo: socket.io
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });
      const dataAppointment = await appointments.findAll({
        include: [
          {
            model: children,
            include: [
              {
                model: parents,
              },
            ],
          },
        ],
      });
      const appointmentt = await appointments.findAll({
        attributes: ["nanny_id"],
        group: ["nanny_id"],
        where: {
          nanny_id: {
            [Op.ne]: null,
          },
        },
      });

      const activeNanny = Array.from(
        new Set(appointmentt.map((x) => x.nanny_id))
      ).length;

      // return console.log(">>>>>>APPOINTMENT", appointment.dataValues);
      emitSocket("refreshAwaitingAppointment", dataAppointment);
      emitSocket("", activeNanny);
      const userr = await users.findAll({
        where: { role: "Nanny", token: { [Op.ne]: null } },
      });
      // return console.log(currentUser)
      const currentParent = await parents.findOne({
        where: { email: currentUser.email },
      });

      const submitChild = await children.findAll({
        where: { client_id: currentParent.client_id },
      });

      // return console.log(userr)
      let arr = [];
      for (let i = 0; i < userr.length; i++) {
        let acnan = await nannies.findAll({ where: { email: userr[i].email } });
        arr.push(acnan);
      }

      const totalActiveNanny = arr.length;

      let maxSubmit = totalActiveNanny * 5;

      const appmnt = await appointments.findAll({
        where: { appointment_status: "Pending" },
      });
      let tmpData = [];
      if (appmnt.length + submitChild.length <= maxSubmit) {
        for (let i = 0; i < submitChild.length; i++) {
          const data = await appointments.create({
            child_id: submitChild[i].child_id,
          });
          tmpData.push(data);
        }
        res.status(200).json({
          statusCode: 200,
          message: "appointment submitted!",
          data: tmpData,
        });
      } else {
        res.json({
          message: "Nanny is not available!",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, message: "error creating appointment" });
    }
  }

  async updateStatus(req, res, next) {
    try {
      // todo: socket.io
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });

      if (currentUser.role.toLowerCase() !== "Nanny".toLowerCase()) {
        return res.json([" you are not nanny "]);
      }

      let { appointment_id, appointment_status } = req.body;

      if (
        appointment_status.toLowerCase() !== "accept" &&
        appointment_status.toLowerCase() !== "reject"
      ) {
        return res.json({
          statusCode: 200,
          message: "choose between accept or reject",
        });
      }

      const appointmentStat =
        appointment_status.slice(0, 1).toUpperCase() +
        appointment_status.slice(1).toLowerCase();

      const data = await appointments.update(
        { appointment_status: appointmentStat },
        {
          where: {
            appointment_id,
            appointment_status: "Pending",
          },
        }
      );

      if (appointment_status.toLowerCase() === "reject") {
        await appointments.destroy({ where: { appointment_status: "Reject" } });

        return res.json(["appointment rejected and has been deleted!"]);
      }

      if (data[0]) {
        res.json({ statusCode: 200, message: "success update" });
      } else {
        res.status(500).json({ statusCode: 500, message: "failed to update" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ statusCode: 500, message: "error updating status" });
    }
  }

  async getAllAcceptedAppointments(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = pagination(page, size);

      const data = await appointments.findAll(
        {
          where: { appointment_status: "Accept" },
          include: [{ model: children, attributes: ["name"] }],
        },
        limit,
        offset
      );

      res.json(paging(data, data.length, page, limit));
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: "error getting accepted appointment",
      });
    }
  }

  async getTotalNewAppointments(req, res, next) {
    // todo: socket.io
    const data = await appointments.findAndCountAll({
      where: { appointment_status: "Pending" },
    });

    res.status(200).json({ statusCode: 200, data, message: "Success" });
  }
}
module.exports = new Appointments();
