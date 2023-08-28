const morgan = require("morgan");
const morganLogger = morgan("dev");
require('dotenv').config();
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

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

const tokenExtractor = (req, res, next) =>{
  try{
    const authorization = req.get('authorization');

    if(authorization && authorization.startsWith('Bearer ', '')){
      const token = authorization.replace('Bearer ', '');
      req.token = token;
    }else {
      req.token = null;
    }
    next();
  }catch(err){
    next(err)
  }
}

const userExtractor = async (req, res, next) => {
  try{
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if(!decodedToken.id){
      return res.status(401).json({
        error: "Token inválido"
      })
    }
    const user = await UserModel.findById(decodedToken.id);
    if(user){
      req.user = user;
    }else{
      req.user = null
    }

    const horarioAtual = Math.floor(new Date().getTime() / 1000);
    
    const expiracaoToken = decodedToken.exp;
    console.log(expiracaoToken - horarioAtual)

    if(expiracaoToken - horarioAtual <= 600){
      const novoToken = jwt.sign(
        {
          usuario: decodedToken.usuario,
          id: decodedToken.id
        },
        process.env.SECRET,
        {expiresIn: '30m'}
      )
      req.token = novoToken;
    }

    console.log(req.token)

    next();
  }catch(err){
    next(err);
  }
}


module.exports = {
    morganLogger,
    unkownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}
