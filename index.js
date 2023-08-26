const app = require('./app')
const port = require('./src/utils/config').port

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`)
})