require('dotenv').config()

const pegarToken = require('./pegarToken')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET


const verificarToken = (req, res, next) => {

    // Se não tiver o token no headers
    if(!req.headers.authorization){
    return res.json({message: "Acesso negado"})
    }

    // Pegou o token do req.headers.authorization
    const token = pegarToken(req)

    // Se não tiver token
    if(!token){
        res.json({message: "Acesso negado"})
    }

    try {
        const decoded = jwt.verify(token, secret)  // Decodifica o usuario que está no token
        req.usuario = decoded
        next()
    } catch (error) {
        res.json({message: error})
    }

}

module.exports = verificarToken