import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

const config = { port, uri };

export default config;