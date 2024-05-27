import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema(
    {
        tipo: { type: String, required: true },
        nome: { type: String, required: true },
        categoria: [{ type: String, required: true }],
        quantidade: { type: Number, required: true },
        descricao: String,
        valorCompra: { type: Number, required: true },
        valorVenda: { type: Number, required: true },
        imagens: [{ type: String }],
        thumbnail: { type: String },
        suggestedPrice: { type: Number },
        disponivel: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("ProdutoModel", produtoSchema);