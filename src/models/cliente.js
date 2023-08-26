const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: Number, required: true },
  cpf: Number,
  endereco: String,
  email: String,
  imagem: String,
  compras: [{ type: mongoose.Schema.Types.ObjectId, ref:"CompraModel"}],
});

clienteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("ClienteModel", clienteSchema);
