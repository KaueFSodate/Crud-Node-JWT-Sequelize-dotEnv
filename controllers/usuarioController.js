const User = require('../models/usuario')
const bcrypt = require('bcrypt')

// Helpers
const criarToken = require('../helpers/criarToken')
const pegarToken = require('../helpers/pegarToken')
const pegarUsuarioToken = require('../helpers/pegarUsuarioToken')


module.exports = class usuarioController{


    static listar = async(req, res) => {

        // Pega os usuários no BD e armazena em 'resposta'
        const resposta = await User.findAll()

        // Se tiver valor retorna
        if(resposta){
            res.json(resposta)
            return
        }
    }

    static listarId = async(req, res) => {
        const id = req.params.id

        // Pega o usuário no BD onde o id for igual ao id que o usuário inseriu e armazena em 'resposta'
        const resposta = await User.findOne({
            where:{
                id: id
            }
        });

        // Se tiver valor retorna
        if(!resposta){
            res.json({message: "Usuário não encontrado"})
            return
        }

        res.json({usuario: resposta})


    }

    static cadastrar = async(req, res) => {

        const {name, senha, email} = req.body

        // Validações

        if(!name){
            res.json({message: "Insira um nome"})
            return
        }

        if(!senha){
            res.json({message: "Insira uma senha"})
            return
        }

        if(!email){
            res.json({message: "Insira um e-mail"})
            return
        }

        // Checa se e-mail já está em uso
        const resposta = await User.findOne({
            where:{
                email: email
            }
        });

        if(resposta){
            res.json({message: "E-mail já está em uso"})
            return
        }

        // Criptografa a senha inseria pelo usuário
        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(senha, salt);

        // Objeto usuário
        const usuario = {
            name: name,
            password: senhaCriptografada,
            email: email,
        }

        // Criação do objeto
        try {
            await User.create(usuario);
            res.status(201).json({msg: "Usuario criado com sucesso", User});
        } catch (error) {
            console.log(error);
        }

    }

    static login = async(req, res) => {
        const {email, password} = req.body

        if(!email){
            res.json({message:"Insira um email"})
            return
        }

        if(!password){
            res.json({message:"Insira uma senha"})
            return
        }

        // Checar usuario
        const Usuario = await User.findOne({
            where:{
                email: email
            }
        });

        if(!Usuario){
            res.json({message:"E-mail incorreto!"})
            return
        }

        // Checar senha

        const existeSenha = await bcrypt.compare(password, Usuario.password)
        console.log(Usuario.password)

        if(!existeSenha){
            res.json({message:"Senha invalida!"})
            return
        }

        //Criar token após o login
        await criarToken(req, res, Usuario)

    }

    static editar = async(req, res) => {
        const id = req.params.id

        // Checa se o usuário existe e pegar o usuario
        const token = pegarToken(req)
        const user = await pegarUsuarioToken(token)

        const {name, password, email} = req.body

        // Validações

        const usuarioid = id

        if(!name){
            res.json({message: "Insira um nome"})
            return
        }

        user.name = name


        if(!password){
            res.json({message: "Insira uma senha"})
            return
        }

        if(!email){
            res.json({message: "Insira um e-mail"})
            return
        }

        user.email = email

        const salt = bcrypt.genSaltSync(10);
        const senhaCriptografada = bcrypt.hashSync(password, salt);

        user.password = senhaCriptografada


        try {
            await User.update(user.dataValues,{
                where:{
                    id: usuarioid
                }
            });;
            res.status(201).json({msg: "Usuario atualizado com sucesso", user});
        } catch (error) {
            console.log(error);
        }
    }

    static deletar = async(req, res) => {
        const id = req.params.id

        try {
            await User.destroy({
                where:{
                    id: id
                }
            });
            res.status(200).json({msg: "Usuario deletado"});
        } catch (error) {
            console.log(error.message);
        }

    }

}