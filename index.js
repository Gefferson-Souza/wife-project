import app from './app.js';
import config from './src/utils/config.js';

const port = config.port;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});