const bcrypt = require('bcrypt')
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res, next) => {
    try{
        return res.status(404).json({
            error: "Unkown Endingpoint"
        });
        const {usuario, senha} = req.body;

        if(!usuario){
            return res.status(400).json({
                error: "Usuário inválido"
            })
        }else if(!senha){
            return res.status(400).json({
                error: "Senha inválido"
            })
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const user = new User({
            usuario,
            senha:senhaHash,
        })

        const savedUser = await user.save();
        res.status(201).json(savedUser)
    }catch(err){
        next(err)
    }
    
})

module.exports = usersRouter;