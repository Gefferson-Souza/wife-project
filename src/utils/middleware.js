const morgan = require("morgan");

const morganLogger = morgan("dev");

const unkownEndpoint = (req, res, next) => {
  res.status(404).json({
    error: "Unkown EndingPoint",
  });
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const errorStatus = err.status || 404;

  res.status(errorStatus).json({ err: err.message });

  next(err);
};


module.exports = {
    morganLogger,
    unkownEndpoint,
    errorHandler
}
