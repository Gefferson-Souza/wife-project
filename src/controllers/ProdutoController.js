import ProdutoModel from "../models/produto.js";

class ProdutoController {
  async index(req, res, next) {
    try {
      const produtos = await ProdutoModel.aggregate([
        { $match: { disponivel: true } },
        { $group: { _id: "$tipo", produtos: { $push: "$$ROOT" } } }
      ]);

      return res.status(200).json({
        data: produtos,
        message: "Produto encontrado com sucesso!",
      });
    } catch (err) {
      next(err);
    }
  }

  async productById(req, res, next) {
    try {
      const { productId } = req.params;
      const produto = await ProdutoModel.findById(productId);

      return res.status(200).json({
        data: produto,
        message: "Produto encontrado com sucesso!",
      });
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const produto = new ProdutoModel(req.body);
      const newProduto = await produto.save();

      return res.status(201).json({
        data: newProduto,
        message: "Produto adicionado com sucesso!",
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProdutoController();
