
const {
  children,
  appointments,
  users,
  parents,
  nannies,
  sequelize,
} = require("./models");
const Op = require("sequelize").Op;
const cron = require('node-cron');
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hiparent.id@gmail.com',
    pass: 'Hiparent123'
  },
  tls: {
    rejectUnauthorized: false
  }
})

module.exports = function() {
  cron.schedule('0 17 * * *', async function(req, res, next) { //  */10 * * * * *
    try {
      let emails = [];
      const appointment = await appointments.findAll({
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

        let previousData = '';
        appointment.map(appointmentData => {
        if (previousData == appointmentData.dataValues.child.parent.client_id) return;
        emails.push(appointmentData.dataValues.child.parent.email)
        previousData = appointmentData.dataValues.child.parent.client_id;
        let mailOptions = {
        from: 'hiparent.id@gmail.com',  
        to: appointmentData.dataValues.child.parent.email,  
        subject: 'Registration Success!',
        html: `<html>
        <p>Please pick up your children!</p></html>`
      }
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error)
          } else {
            console.log(`Email sent: ` + info.response )
          }
        });
      });
    } catch (error) {
      return res.json([" failed parent cron "])
    }
  }, { scheduled: true });

  cron.schedule('0 20 * * *', async function(req, res, next) { //  */10 * * * * *
    try {
      await appointments.destroy({ where: {}, truncate: true })
    } catch (error) {
      return console.log(error)
    }
  });

  cron.schedule('0 20 * * *', async function(req, res, next) { //  */10 * * * * *
    try {
      await appointment_activities.destroy({ where: {}, truncate: true })
    } catch (error) {
      return console.log(error)
    }
  });

  cron.schedule('* 7-17 * * *', async function(req, res, next) { //* 7-17/1 * * *
    try {
      let emails = [];
      const appointment = await appointments.findAll({
        where: { nanny_id: { [Op.ne]: null } },
        include: [{ model: nannies }]
      });
      let previousData = ''
      appointment.map(appointmentData => {
        if (previousData == appointmentData.dataValues.nanny.nanny_id) return;
        emails.push(appointmentData.dataValues.nanny.email)
        previousData = appointmentData.dataValues.nanny.nanny_id;
        let mailOptions = {
        from: 'hiparent.id@gmail.com',  
        to: appointmentData.dataValues.nanny.email,  
        subject: 'Registration Success!',
        html: `<html>
        <p>Please update your children activity!</p></html>`
      }
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error)
          } else {
            console.log(`Email sent: ` + info.response )
          }
        });
      });
    } catch (error) {
      return console.log(error)}
  });

  cron.schedule('0 * * * *', async function(req, res, next) { //* 7-17/1 * * *
    try {
      let emails = [];
      const appointment = await appointments.findAll({
        where: { appointment_status: "Pending"},
        include: [{ model: nannies }]
      });
      let previousData = ''
      appointment.forEach(appointmentData => {
        if (previousData == appointmentData.dataValues.nanny.nanny_id) return;
        emails.push(appointmentData.dataValues.nanny.email)
        previousData = appointmentData.dataValues.nanny.nanny_id;
        let mailOptions = {
        from: 'hiparent.id@gmail.com',  
        to: appointmentData.dataValues.nanny.email,  
        subject: 'Registration Success!',
        html: `<html>
        <p>There is a pending appointment</p></html>`
      }
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error)
          } else {
            console.log(`Email sent: ` + info.response )
          }
        });
      });
    } catch (error) {
      return console.log(error)}
  });
}