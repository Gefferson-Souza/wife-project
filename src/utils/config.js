require('dotenv').config()


const port = process.env.PORT 

const uri = process.env.MONGODB_URI;

module.exports = {port,uri}