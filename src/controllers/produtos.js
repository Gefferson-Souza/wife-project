const produtoRouter = require('express').Router();
const ProdutoModel = require('../models/produto')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

produtoRouter.get('/', async(req, res, next) => {
    try{
        const produtosInDb = await ProdutoModel.find({});
        res.status(200).json(produtosInDb);

    }catch(err){
        next(err);
    }
})

produtoRouter.post('/',upload.single('imagem'), async(req,res,next) => {
    try{
    const {nome, descricao, categoria, preco} = req.body;
    const imagem = req.file.path;

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

produtoRouter.delete('/:id', async (req,res,next) => {
    try{
        const id = req.params.id
        const produto = await ProdutoModel.findById(id)

        if(!produto){
            return res.status(404).json({
                error:"Produto não existe ou já foi deletado"
            }) 
        }

        const ProdutoDeletado = await ProdutoModel.findByIdAndRemove(id);
        return res.status(204).end()
    }catch(err){
        next(err)
    }
})

produtoRouter.put('/:id', async (req,res,next) => {

})

module.exports = produtoRouter;