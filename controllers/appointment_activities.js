const {
  appointment_activities,
  appointments,
  nannies,
  users,
  parents,
  children,
  sequelize,
} = require("../models");

const moment = require("moment");

const { Op } = require("sequelize");

const pagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = ((page - 1) * limit) | 0;

  return { limit, offset };
};

const paging = (message, activity, items, page, limit) => {
  // console.log(">>>>ITEMS", items);
  const onPage = page ? +page : 1;
  const pages = Math.ceil(items / limit);
  let data = activity;

  return { message, items, data, pages, onPage };
};

class Activities {
  async createActivity(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });
      // return console.log(currentUser)
      if (!currentUser) return res.send("Belum login");

      const currentNanny = await nannies.findOne({
        where: { email: currentUser.email },
      });

      if (currentNanny == null) return res.send("Nanny not found");

      const resData = await appointments.findOne({
        where: {
          appointment_id: req.body.appointment_id,
          nanny_id: currentNanny.nanny_id,
        },
      });
      if (resData == null) return res.send("No access");

      let { activity_detail, appointment_id, time } = req.body;
      const photo = req.body.photo.url;

      const data = await appointment_activities.create({
        appointment_id,
        activity_detail,
        photo,
        time,
      });

      return res.json({ data });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "error creating activity" });
    }
  }

  async editActivity(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });

      if (currentUser == null) return res.send("Belum login");

      const currentNanny = await nannies.findOne({
        where: { email: currentUser.email },
      });

      if (currentNanny == null) return res.send("Nanny not found");

      let { activity_detail, time } = req.body;
      const photo = req.body.photo.url;

      await appointment_activities.update(
        {
          activity_detail,
          photo,
          time,
        },
        { where: { id: req.body.id } }
      );

      const data = await appointment_activities.findOne({
        where: { id: req.body.id },
      });

      return res.json({ data });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "error creating activity" });
    }
  }

  async deleteActivity(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });

      if (currentUser == null) return res.send("Belum login");

      const currentNanny = await nannies.findOne({
        where: { email: currentUser.email },
      });

      const tmpApp = await appointments.findAll({
        where: { nanny_id: currentNanny.nanny_id },
      });

      if (tmpApp[0] == null) return res.send("You are not allowed");

      if (currentNanny == null) return res.send("Nanny not found");

      if (currentNanny.dataValues.nanny_id != tmpApp[0].nanny_id)
        return res.send("You are not allowed");

      let { id } = req.body;

      const delData = await appointment_activities.destroy({ where: { id } });

      // return console.log(delData)

      if (delData === 0) {
        return res.send("no data");
      } else {
        return res.send("deleted");
      }
    } catch (error) {
      return console.log(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "error creating activity" });
    }
  }

  async getAllActivityOfEachAppointment(req, res, next) {
    try {
      const resData = await appointments.findAll({
        where: {
          appointment_id: req.params.appointment_id,
        },
      });

      const data = await appointments.findAll({
        where: { appointment_id: resData[0].dataValues.appointment_id },
        include: [
          {
            model: children,
            where: { child_id: resData[0].dataValues.child_id },
          },
        ],
      });

      const tmpData = await appointment_activities.findAll({
        where: { appointment_id: data[0].dataValues.appointment_id },
      });
      //    return console.log();

      const result = [];

      for (let i = 0; i < data.length; i++) {
        const arr = await appointment_activities.findAll({
          where: { appointment_id: tmpData[i].dataValues.appointment_id },
        });

        result.push(arr);
      }

      const finalData = await appointments.findAll({
        where: { appointment_id: resData[0].dataValues.appointment_id },
        include: [
          {
            model: appointment_activities,
            where: { appointment_id: data[0].dataValues.appointment_id },
          },
          {
            model: children,
            where: { child_id: data[0].dataValues.child_id },
            attributes: ["name", "photo"],
            include: [
              {
                model: parents,
                attributes: ["name"],
              },
            ],
          },
        ],
      });
      //   return res.json({ data });

      res.status(200).json({
        statusCode: 200,
        message: "These are your child's activities",
        finalData,
      });
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: "Bad Request" });
    }
  }

  async getAllChildActivities(req, res, next) {
    try {
      let data = await appointment_activities.findAll({
        // where: { appointment_id: currentAppointments[0].dataValues.appointment_id },
        order: [["updatedAt", "ASC"]],
        attributes: ["createdAt", "activity_detail", "id"],
        include: [
          {
            model: appointments,
            attributes: ["appointment_id"],
            include: [
              {
                model: children,
                attributes: ["child_id", "name"],
              },
              {
                model: nannies,
                attributes: ["nanny_id", "name"],
              },
            ],
          },
        ],
      });

      data.map((ngantuk) => {
        ngantuk.dataValues.createdAt = moment(
          ngantuk.dataValues.createdAt
        ).format("DD/MM/YYYY hh:mm A");
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getAllChildActivitiesFe(req, res, next) {
    try {
      const {
        page,
        size,
        search_child,
        search_nanny,
        sort = "DESC",
      } = req.query;
      const { limit, offset } = pagination(page, size);

      const a = search_child
        ? { [Op.iLike]: `%${search_child}%` }
        : { [Op.ne]: null };
      const b = search_nanny
        ? { [Op.iLike]: `%${search_nanny}%` }
        : { [Op.ne]: null };

      const currentChild = await children.findAll({});
      //   return console.log(">>>>CURRENTCHILD", currentChild);

      const currentAppointments = [];

      for (let i = 0; i < currentChild.length; i++) {
        const currentAppointment = await appointments.findOne({
          where: { child_id: currentChild[i].child_id },
        });
        currentAppointments.push(currentAppointment);
      }

      let data = await appointment_activities.findAndCountAll({
        // where: { appointment_id: { [Op.or]: currentAppointments } },
        attributes: ["createdAt", "activity_detail", "id"],
        include: [
          {
            model: appointments,
            attributes: ["appointment_id"],
            include: [
              {
                model: children,
                attributes: ["child_id", "name"],
                where: {
                  name: a,
                },
                // required: true,
              },
              {
                model: nannies,
                attributes: ["nanny_id", "name"],
                where: {
                  name: b,
                  // [Op.iLike]: `%${search_nanny}%`,
                },
                // required: true,
              },
            ],
            required: true,
          },
        ],
        order: [["createdAt", sort || "ASC"]],
        limit,
        offset,
      });

      data.rows.map((ngantuk) => {
        ngantuk.dataValues.createdAt = moment(
          ngantuk.dataValues.createdAt
        ).format("DD/MM/YYYY hh:mm A");
      });

      res
        .status(200)
        .json(paging("Success", data.rows, data.count, page, limit));
    } catch (error) {
      console.log(error);
      // next(error);
    }
  }
}

module.exports = new Activities();
