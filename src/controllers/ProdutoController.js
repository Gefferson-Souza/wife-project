import ProdutoModel from "../models/produto.js";

class ProdutoController {
  async index(req, res, next) {
    try {
      const produtos = await ProdutoModel.find({ disponivel: true });

      res.status(200).json({
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

      res.status(200).json({
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

      res.status(201).json({
        data: newProduto,
        message: "Produto adicionado com sucesso!",
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProdutoController();
