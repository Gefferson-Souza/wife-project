const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "ClienteModel" },
  produtos: [
    {
      produto: { type: mongoose.Schema.Types.ObjectId, ref: "ProdutoModel" },
      precoVenda: Number,
    },
  ],
  valorTotal: Number,
  aVista: Number,
  aPrazo: Number,
  data: {
    type: String,
    default: () =>
      new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
  },
});

compraSchema.pre("save", function (next) {
  const valorTotal = this.produtos.reduce(
    (total, produto) => total + produto.precoVenda,
    0
  );
  this.valorTotal = valorTotal;
  let valorPrazo = valorTotal - this.aVista;
  this.aPrazo = valorPrazo;
  next();
});

compraSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("CompraModel", compraSchema);
