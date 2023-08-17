const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    descricao: String,
    categoria: {type: String, required: true},
    preco: {type: Number, required: true},
    img: Buffer
})

produtoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('ProdutoModel', produtoSchema);