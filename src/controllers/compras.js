const compraRouter = require("express").Router();
const CompraModel = require("../models/compra");
const ClienteModel = require("../models/cliente");
const ProdutoModel = require("../models/produto");

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
    const { clienteId, produtos, aVista } = req.body;

    const cliente = await ClienteModel.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente não existe",
      });
    }

    const produtosDisponiveis = new Set();

    for (let produto of produtos) {
      const produtoId = produto.produto.toString();

      if (produtosDisponiveis.has(produtoId)) {
        return res.status(400).json({
          error: "Mesmo produto adicionado mais de uma vez",
        });
      }

      let produtoAtual = await ProdutoModel.findOne({
        _id: produto.produto,
        disponivel: true,
      });

      if (!produtoAtual) {
        return res.status(400).json({
          error: "Alguns produtos não estão disponíveis para compra",
        });
      }
      produtosDisponiveis.add(produtoId);
    }

    const compra = new CompraModel({
      clienteId,
      produtos,
      aVista,
    });

    const savedCompra = await compra.save();

    await Promise.all(
      produtos.map(async (produto) => {
        let novoProduto = { ...produto, disponivel: false };
        await ProdutoModel.findByIdAndUpdate(produto.produto, novoProduto, {
          new: true,
          runValidators: true,
        });
      })
    );

    await ClienteModel.findByIdAndUpdate(clienteId, {
      $push: { compras: savedCompra.id },
    });
    return res.status(201).json(savedCompra);
  } catch (err) {
    next(err);
  }
});

module.exports = compraRouter;
