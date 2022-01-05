const {
  children,
  parents,
  users,
  appointments,
  appointment_activities,
  nannies,
} = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
// const appointment_activities = require("../../coba/backend/controllers/appointment_activities");

const pagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = ((page - 1) * limit) | 0;

  return { limit, offset };
};

class Children {
  /* Nanny Asign children */
  async assignChild(req, res, next) {
    try {
      // todo: socket.io
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({ where: { token } });
      // is_taken
      const currentNanny = await nannies.findOne({
        where: { email: currentUser.email },
      });
      const countChild = await children.findAll({})
      const appmnt = await appointments.findAll({ where: { nanny_id: currentNanny.nanny_id } })
      const assgnChild = await appointments.findAll({ where: {  } })

      if (currentNanny == null) {
        return res.json(["You are not a nanny"]);
      }

      let { appointment_id } = req.body;

      const app = await appointments.findAll({
        where: {
          appointment_id,
          appointment_status: "Accept",
        },
      });

      if (( appmnt.length + 1 ) > 5) return res.send("you maximum assigned child is 5")

      for (let i = 0; i < app.length; i++) {
        await appointments.update(
          { is_taken: true, nanny_id: currentNanny.nanny_id },
          {
            where: {
              appointment_id: app[i].dataValues.appointment_id,
              appointment_status: "Accept",
              is_taken: null,
            },
          }
        );
      }

      let finalData = [];

      for (let i = 0; i < app.length; i++) {
        const resData = await appointment_activities.create({
          appointment_id: app[i].dataValues.appointment_id,
          activity_detail: "",
          photo: "",
          time: "",
        });

        const result = await appointment_activities.findOne({
          where: { appointment_id: resData.appointment_id },
          include: [
            {
              model: appointments,
              attributes: ["appointment_id"],
              include: [{ model: children, attributes: ["child_id", "name"] }],
            },
          ],
        });

        finalData.push(result);
      }

      res.json({ finalData });
    } catch (error) {
      // return console.log(error);
      res.json({
        statusCode: 500,
        message: `Error assign child appointment_id : ${req.body.appointment_id}`,
      });
    }
  }

  async getManageChild(req, res, next) {
    try {
      const childToBeAssign = await appointments.findAll({
        where: { is_taken: null, nanny_id: null, appointment_status: "Accept" },
        include: [
          {
            model: children,
            attributes: ["child_id", "name"],
          },
        ],
      });

      if (childToBeAssign <= 0) {
        return res.status(400).json({
          statusCode: 400,
          message: "There is not child to assigned",
        });
      } else {
        return res
          .status(200)
          .json({ statusCode: 200, message: "Success", data: childToBeAssign });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal Server Error" });
    }
  }

  /* parent make children data */
  async createChildren(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });

      const currentParent = await parents.findOne({
        where: { email: currentUser.email },
      });

      let { name, gender, place_birth, date_birth } = req.body;
      const photo = req.body.photo.url;
      const parsedDateBirth = moment(date_birth, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );

      let data = await children.create({
        client_id: currentParent.client_id,
        name,
        gender,
        place_birth,
        date_birth: parsedDateBirth,
        photo,
      });

      res
        .status(201)
        .json({ statusCode: 201, message: "success create children", data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  /* update children data */
  async updateChildren(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });
      const currentParent = await parents.findOne({
        where: { email: currentUser.email },
      });

      const currentChild = await children.findAll({
        where: { client_id: currentParent.client_id },
      });

      const currentChilds = [];

      for (let i = 0; i < currentChild.length; i++) {
        const currentChildId = await children.findOne({
          where: { child_id: currentChild[i].child_id },
        });
        currentChilds.push(currentChildId.dataValues.child_id);
      }
      // return res.send({currentChilds});
      let { name, gender, place_birth, date_birth } = req.body;
      const parsedDateBirth = moment(date_birth, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      const photo = req.body.photo.url;

      const data = await children.findAll({
        where: { child_id: { [Op.or]: currentChilds } },
      });

      await children.update(
        {
          name,
          gender,
          place_birth,
          date_birth: parsedDateBirth,
          photo,
        },
        {
          where: { child_id: req.params.child_id },
        }
      );

      const resData = await children.findOne({
        where: { child_id: req.params.child_id },
      });

      res.status(201).json({
        statusCode: 201,
        message: "success update children",
        data: resData,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errors: ["Internal Server Error (update children)"] });
    }
  }

  async getAllChildren(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
      });
      const currentParent = await parents.findAll({
        where: { email: currentUser.email },
      });

      const data = await parents.findAll({
        where: { email: currentParent[0].dataValues.email },
      });

      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push(
          await parents.findOne({
            where: { client_id: data[0].client_id },
            include: [{ model: children }],
          })
        );
      }
      return res.json({ arr });
    } catch (error) {
      // If error
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  async getAllChildActivities(req, res, next) {
    try {
      const currentChild = await children.findAll({});
      //   return console.log(">>>>CURRENTCHILD", currentChild);

      const currentAppointments = [];

      for (let i = 0; i < currentChild.length; i++) {
        const currentAppointment = await appointments.findOne({
          where: { child_id: currentChild[i].child_id },
        });
        currentAppointments.push(currentAppointment);
      }

      const { page, size, sort = "DESC" } = req.query;
      const { limit, offset } = pagination(page, size);

      let data = await appointment_activities.findAndCountAll({
        limit,
        offset,
        order: [["appointment_id", sort || "ASC"]],
        // where: { appointment_id: { [Op.or]: currentAppointments } },
        attributes: ["createdAt", "activity_detail", "id"],
        include: [
          {
            model: appointments,
            attributes: ["appointment_id"],
            include: [
              {
                model: children,
                attributes: ["name"],
              },
              {
                model: nannies,
                attributes: ["name"],
              },
            ],
          },
        ],
      });
      // return console.log(Object.keys(data))
      data.rows.map((ngantuk) => {
        ngantuk.dataValues.createdAt = moment(
          ngantuk.dataValues.createdAt
        ).format("DD/MM/YYYY hh:mm A");
      });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Children();
