const {
  users,
  parents,
  nannies,
  children,
  appointments,
  appointment_activities,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const pagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = ((page - 1) * limit) | 0;

  return { limit, offset };
};

const paging = (message, parent, items, page, limit) => {
  // console.log(">>>>ITEMS", items);
  const onPage = page ? +page : 1;
  const pages = Math.ceil(items / limit);
  let data = parent;

  return { message, items, data, pages, onPage };
};

class Parents {
  //get information parents
  async currentAccount(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
        attributes: {
          exclude: ["password"],
        },
      });

      let data = await parents.findOne({
        where: { email: currentUser.email },
      });

      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  //dashboard parent child activity in parent
  async dashboardParent(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
        attributes: {
          exclude: ["password"],
        },
      });
      const currentParent = await parents.findOne({
        where: { email: currentUser.email },
      });

      const currentChild = await children.findAll({
        where: { client_id: currentParent.client_id },
      });

      // If data is nothing
      if (currentChild.length === 0) {
        return res.status(404).json({ errors: ["No Children Activity"] });
      }

      let currentAppointments = [];

      for (let i = 0; i < currentChild.length; i++) {
        const currentAppointment = await appointments.findOne({
          where: { child_id: currentChild[i].child_id },
        });

        currentAppointments.push(currentAppointment);
      }

      const tmpData = currentAppointments.filter((x) => x);

      let result = [];

      for (let i = 0; i < tmpData.length; i++) {
        const tmp = tmpData[i].dataValues.appointment_id;
        result.push(tmp);
      }

      //pagination
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

      let data = await appointment_activities.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", sort || "ASC"]],

        where: { appointment_id: { [Op.or]: result } },
        include: [
          {
            model: appointments,
            attributes: ["appointment_id"],
            include: [
              {
                model: children,
                where: {
                  name: a,
                },
              },
              {
                model: nannies,
                attributes: ["nanny_id", "name"],
                where: {
                  name: b,
                },
              },
            ],
          },
        ],
      });

      res
        .status(200)
        .json(paging("Success", data.rows, data.count, page, limit));
    } catch (error) {
      return console.log(error);
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  // Update data/profile parent
  async updateParent(req, res, next) {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      const currentUser = await users.findOne({
        where: { token },
        attributes: {
          exclude: ["password"],
        },
      });

      let {
        name,
        phone_number,
        address,
        job,
        place_birth,
        date_birth,
        gender,
      } = req.body;
      const parsedDateBirth = moment(date_birth, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      const photo = req.body.photo.url;

      const data = await parents.findOne({
        where: { email: currentUser.email },
      });

      if (!name) {
        await parents.update(
          {
            name: data.name,
            phone_number,
            address,
            job,
            place_birth,
            date_birth: parsedDateBirth,
            gender,
            photo,
          },
          {
            where: {
              id: data.id,
            },
          }
        );
      } else {
        await parents.update(
          {
            name,
            phone_number,
            address,
            job,
            place_birth,
            date_birth: parsedDateBirth,
            gender,
            photo,
          },
          {
            where: {
              id: data.id,
            },
          }
        );
      }

      const resData = await parents.findOne({
        where: { email: currentUser.email },
      });

      // If success
      res
        .status(200)
        .json({ statusCode: 200, message: "Profile Update", data: resData });
    } catch (error) {
      // If error
      console.log(error);
      res.status(500).json({ errors: ["Internal Server Error"] });
    }
  }

  async activeClient(req, res, next) {
    // TODO: socket.io
    const data = await users.findAndCountAll({
      where: {
        role: "Parent",
        token: { [Op.ne]: null },
      },
      attributes: {
        exclude: ["password"],
      },
    });

    res.json({ data });
  }
}

module.exports = new Parents();
