const produtoRouter = require('express').Router();
const ProdutoModel = require('../models/produto')


produtoRouter.get('/', async(req, res, next) => {
    try{
        const produtosInDb = await ProdutoModel.find({});
        res.status(200).json("ASDASDASDASD");

    }catch(err){
        next(err);
    }
})

produtoRouter.post('/', async(req,res,next) => {
    try{
    const {nome, descricao, categoria, preco, imagem} = req.body;

    const produto = new ProdutoModel({
        nome,
        descricao,
        categoria,
        preco,
        imagem
    })

    const savedProduto = await produto.save();
    res.status(201).json(savedProduto);

    }catch(err){
        next(err)
    }
})

module.exports = produtoRouter;