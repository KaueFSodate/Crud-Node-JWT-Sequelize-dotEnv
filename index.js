// Variaveis globais
require('dotenv').config()

// Configuração server
const express = require('express')
const port = process.env.PORT;
const app = express()

// Configuração BD
const con = require('./config/conexao')
const usuario = require('./models/usuario')

// Variaveis das rotas
const usuarioRoutes = require('./routes/usuarioRoutes')

// Utilizar json
app.use(express.json())

// Routes
app.use('/', usuarioRoutes)

// Iniciar aplicação
con.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server rodando na porta ${port}`)
    })
}).catch((error) => {console.log(error)})