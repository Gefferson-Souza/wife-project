const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
require('dotenv').config();

loginRouter.post('/', async (req, res, next) => {
    try {
        const {usuario, senha} = req.body;

        const user = await UserModel.findOne({usuario});

        const passwordCheck = user === null ? false : await bcrypt.compare(senha, user.senha)

        if(!user || !passwordCheck){
            return res.status(404).json({
                error: "Usuário ou senha inválidos!"
            })
        }

        const userToken = {
            usuario: user.usuario,
            id: user._id
        }

        const token = jwt.sign(userToken, process.env.SECRET, {expiresIn: '30m'})

        return res.status(200).json({
            token,
            usuario: user.usuario,
        })
    }catch(err){
        next(err);
    }
})

module.exports = loginRouter;