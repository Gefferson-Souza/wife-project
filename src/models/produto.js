import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    categoria: {type: String, required: true},
    quantidade: {type: Number, required: true},
    descricao: String,
    valorCompra: {type: Number, required: true},
    valorVenda: {type: Number, required: true},
    imagem: String,
    disponivel: {type: Boolean, default: true},
})

export default mongoose.model("ProdutoModel", produtoSchema);