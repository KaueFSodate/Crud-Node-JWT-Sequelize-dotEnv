const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')

// MiddleWare
const autenticado = require('../helpers/verificarToken')

router.get('/', usuarioController.listar)
router.get('/:id', usuarioController.listarId)
router.post('/', usuarioController.cadastrar)
router.post('/login', usuarioController.login)
router.put('/:id', autenticado, usuarioController.editar)
router.delete('/:id', autenticado, usuarioController.deletar)

module.exports = router