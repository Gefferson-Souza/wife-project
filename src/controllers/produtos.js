const produtoRouter = require("express").Router();
const ProdutoModel = require("../models/produto");
const multer = require("multer");
const fs = require("fs").promises;
const userExtractor = require('../utils/middleware').userExtractor;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/produtos/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

produtoRouter.get("/", async (req, res, next) => {
  try {
    const produtosInDb = await ProdutoModel.find({disponivel: true});
    return res.status(200).json(produtosInDb);
  } catch (err) {
    next(err);
  }
});

produtoRouter.get("/:id", async (req,res,next) => {
  try{
    const produto = await ProdutoModel.findById(req.params.id);
    res.status(200).json(produto);
  }catch(err){
    next(err);
  }
})

produtoRouter.post("/",userExtractor, upload.single("imagem", 5), async (req, res, next) => {
  try {
    const { nome, descricao, categoria, preco } = req.body;
    const imagem = req.files
      ? req.files.map((file) => file.path)
      : req.file
      ? req.file.path
      : undefined;

    const produto = new ProdutoModel({
      nome,
      descricao,
      categoria,
      preco,
      imagem,
    });

    const savedProduto = await produto.save();
    return res.status(201).json(savedProduto);
  } catch (err) {
    next(err);
  }
});


produtoRouter.delete("/:id",userExtractor, async (req, res, next) => {
  try {
    const id = req.params.id;
    const produto = await ProdutoModel.findById(id);

    if (!produto) {
      return res.status(404).json({
        error: "Produto não existe ou já foi excluido",
      });
    }

    if (produto.imagem) {
      try {
        await fs.unlink(produto.imagem);
      } catch (err) {
        console.error("Erro ao excluir imagem", err);
      }
    }

    await ProdutoModel.findByIdAndRemove(produto.id);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

produtoRouter.put("/:id",userExtractor, upload.single("imagem"), async (req, res, next) => {
  try {
    const { nome, categoria, descricao, preco } = req.body;
    let imagem = req.file ? req.file.path : undefined;

    const produto = {
      nome,
      categoria,
      descricao,
      preco,
    };

    if (imagem) {
      produto.imagem = imagem;
    }

    const oldProduto = await ProdutoModel.findById(req.params.id);

    if(!oldProduto){
      return res.status(404).end();
    }

    const updatedProduto = await ProdutoModel.findByIdAndUpdate(
      req.params.id,
      produto,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduto) {
      return res.status(404).end();
    }

    if (updatedProduto.imagem) {
      if (oldProduto && oldProduto.imagem) {
        if (updatedProduto.imagem !== oldProduto.imagem) {
          try {
            await fs.unlink(oldProduto.imagem);
          } catch (err) {
            console.error("Erro ao excluir a imagem antiga", err);
          }
        }
      }
    }

    return res.status(201).json(updatedProduto);
  } catch (err) {
    next(err);
  }
});

module.exports = produtoRouter;
