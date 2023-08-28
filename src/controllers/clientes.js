const clienteRouter = require("express").Router();
const ClienteModel = require("../models/cliente");
const multer = require("multer");
const fs = require("fs").promises;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clientes/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

clienteRouter.get("/", async (req, res, next) => {
  try {
    const clientesInDb = await ClienteModel.find({});
    return res.status(200).json(clientesInDb);
  } catch (err) {
    next(err);
  }
});

clienteRouter.get("/:id", async (req, res, next) => {
  try{
    const cliente = await ClienteModel.findById(req.params.id);
    res.status(200).json(cliente);
  }catch(err){
    next(err)
  }
})

clienteRouter.post("/", upload.single("imagem"), async (req, res, next) => {
  try {
    const { nome, telefone, cpf, endereco, email } = req.body;
    let imagem = req.file ? req.file.path : undefined;

    const cliente = new ClienteModel({
      nome,
      telefone,
      cpf,
      endereco,
      email,
      imagem,
    });

    const savedCliente = await cliente.save();
    return res.status(201).json(savedCliente);
  } catch (err) {
    next(err);
  }
});

clienteRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({
        error: "O Cliente não existe ou já foi excluído",
      });
    }

    if (cliente.imagem) {
      try {
        await fs.unlink(cliente.imagem);
      } catch (err) {
        console.error("Erro ao excluir imagem do cliente", err);
      }
    }

    await ClienteModel.findByIdAndRemove(id);

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

clienteRouter.put("/:id", upload.single("imagem"), async (req, res, next) => {
  try {
    const { nome, telefone, cpf, endereco, email } = req.body;
    let imagem = req.file ? req.file.path : undefined;

    const cliente = {
      nome,
      telefone,
      cpf,
      endereco,
      email,
    };
    if (imagem) {
      cliente.imagem = imagem;
    }

    const oldCliente = await ClienteModel.findById(req.params.id);

    if (!oldCliente) {
      return res.status(404).end();
    }

    const updatedCliente = await ClienteModel.findByIdAndUpdate(
      req.params.id,
      cliente,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCliente) {
      return res.status(404).end();
    }

    if (updatedCliente.imagem) {
      if(oldCliente && oldCliente.imagem){
        if(updatedCliente.imagem !== oldCliente.imagem){
          try{
            await fs.unlink(oldCliente.imagem);
          }catch(err){
            console.error("Erro ao excluir imagem antiga do Cliente", err)
          }
        }
      }
    }

    return res.status(201).json(updatedCliente);
  } catch (err) {
    next(err);
  }
});

module.exports = clienteRouter;
