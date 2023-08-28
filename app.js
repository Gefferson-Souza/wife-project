const mongoose = require("mongoose");
const config = require("./src/utils/config");
const middleware = require("./src/utils/middleware")
const express = require("express");
const produtoRouter = require('./src/controllers/produtos')
const clienteRouter = require('./src/controllers/clientes')
const compraRouter = require('./src/controllers/compras')
const loginRouter = require('./src/controllers/login');

const cors = require("cors");

const app = express();

mongoose.set("strictQuery", false);

mongoose
  .connect(config.uri)
  .then(() => {
    console.log("Conectado ao mongodb");
  })
  .catch((error) => {
    console.error(error.message);
  });

app.use(cors());
app.use(express.json())
app.use(middleware.morganLogger);
app.use(middleware.tokenExtractor);
app.use('/login', loginRouter)
app.use('/api/produtos', produtoRouter)
app.use('/api/clientes',middleware.userExtractor, clienteRouter)
app.use('/api/compras',middleware.userExtractor, compraRouter)
app.use(middleware.unkownEndpoint);
app.use(middleware.errorHandler);




module.exports = app;
