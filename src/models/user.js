const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    usuario: {type: String, required: true},
    senha: {type: String, required: true}
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('UserModel', userSchema)