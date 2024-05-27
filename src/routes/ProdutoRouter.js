import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';

const ProdutoRouter = express.Router();

ProdutoRouter.get("/", ProdutoController.index);
ProdutoRouter.get("/thumbnail/script", ProdutoController.addThumbnailScript);
ProdutoRouter.get("/:productId", ProdutoController.productById);
ProdutoRouter.post("/", ProdutoController.store);
ProdutoRouter.delete("/:productId", ProdutoController.deleteProduct);

export default ProdutoRouter;