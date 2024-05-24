import ProdutoModel from "../models/produto.js";
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

// Configuração do AWS S3
const s3 = new AWS.S3({
  accessKeyId: 'DO00UVRFHMY68GH6RKEN',
  secretAccessKey: 'xEPc8CC7PQcJJGHaj2a5JO0WSG2chd+NufLS//YxXW8',
  endpoint: 'https://gtsdesenvolvimento.nyc3.digitaloceanspaces.com',
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

function ensureHttps(url) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

class ProdutoController {
  async index(req, res, next) {
    try {
      const produtos = await ProdutoModel.aggregate([
        { $match: { disponivel: true } },
        { $group: { _id: "$tipo", produtos: { $push: "$$ROOT" } } }
      ]);

      return res.status(200).json({
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

      return res.status(200).json({
        data: produto,
        message: "Produto encontrado com sucesso!",
      });
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const { body } = req;

      console.log(body.imagens);

      const uploadPromises = body.imagens.map(async (imagem, index) => {
        const fileContent = Buffer.from(imagem.webviewPath.split(",")[1], 'base64');
        const params = {
          Bucket: `products/${body.tipo}`,
          Key: `${body.nome}${Date.now()}-${index}.jpeg`, // Nome do arquivo no Spaces
          Body: fileContent,
          ACL: 'public-read', // Torna o arquivo acessível publicamente
          ContentType: 'image/jpeg' // Define o tipo de conteúdo do arquivo
        };

        const upload = await s3.upload(params).promise();

        return upload.Location;
      });

      const urls = await Promise.all(uploadPromises);

      const imageUrls = urls.map(url => ensureHttps(url));


      body.imagens = imageUrls;
      const produto = new ProdutoModel(body);
      const newProduto = await produto.save();

      return res.status(201).json({
        data: newProduto,
        message: "Produto adicionado com sucesso!",
        status: 'OK',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProdutoController();
