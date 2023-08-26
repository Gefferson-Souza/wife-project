const mongoose = require('mongoose')

const compraSchema = new mongoose.Schema({
    cliente: {type: mongoose.Schema.Types.ObjectId, ref:"ClienteModel"},
    produtos:[
        {
            produto:{type: mongoose.Schema.Types.ObjectId, ref:"ProdutoModel"},
            precoVenda:Number,
        },
    ],
    data:{type: Date, default: Date.now},
});

compraSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('CompraModel', compraSchema);