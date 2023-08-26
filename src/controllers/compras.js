const compraRouter = require("express").Router();
const CompraModel = require("../models/compra");
const ClienteModel = require("../models/cliente");

compraRouter.get("/", async (req, res, next) => {
  try {
    const compras = await CompraModel.find({});
    return res.status(200).json(compras);
  } catch (err) {
    next(err);
  }
});

compraRouter.get("/:id", async (req, res, next) => {
  try {
    const compra = await CompraModel.findById(req.params.id);
    return res.status(200).json(compra);
  } catch (err) {
    next(err);
  }
});

compraRouter.post("/", async (req, res, next) => {
  try {
    const { clienteId, produtos } = req.body;

    const cliente = await ClienteModel.findById(clienteId);

    if(!cliente){
        return res.status(404).json({
            error: "Cliente não existe"
        })
    }

    const produtosDisponiveis = await Promise.all(
        produtos.map(async (produto) => {
            const produtoDisponivel = await ProdutoModel.findOne({
                _id: produto.id,
                disponivel: true
            })
            return produtoDisponivel
        })
    )

    if(produtosDisponiveis.some((produto) => !produto)){
        return res.status(400).json({
            error: "Alguns produtos não estao disponíveis para compra"
        })
    }

    const compra = new CompraModel({
      clienteId,
      produtos,
    });

    const savedCompra = await compra.save();

    await Promise.all(
        produtos.map(async(produto) => {
            
        })
    )

    await ClienteModel.findByIdAndUpdate(clienteId, {
      $push: { compras: savedCompra.id },
    });
    return res.status(201).json(savedCompra);
  } catch (err) {
    next(err);
  }
});

module.exports = compraRouter;
