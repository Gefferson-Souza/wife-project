import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';

const ProdutoRouter = express.Router();

ProdutoRouter.get("/", ProdutoController.index);
ProdutoRouter.get("/:productId", ProdutoController.productById);
ProdutoRouter.post("/", ProdutoController.store);

export default ProdutoRouter;