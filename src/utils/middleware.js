import morgan from "morgan";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

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

const tokenExtractor = (req, res, next) => {
  try {
    const authorization = req.get('authorization');

    if (authorization && authorization.startsWith('Bearer ', '')) {
      const token = authorization.replace('Bearer ', '');
      req.token = token;
    } else {
      req.token = null;
    }
    next();
  } catch (err) {
    next(err)
  }
}


export {
  morganLogger,
  unkownEndpoint,
  errorHandler,
  tokenExtractor,
}