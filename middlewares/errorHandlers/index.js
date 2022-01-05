module.exports = (err, req, res, next) => {
  console.log(err);

  res
    .status(err.statusCode || 500)
    .json({ errors: err.messages || { errors: err.message } });
};