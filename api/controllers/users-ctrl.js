const mysql = require('../mysql').connect
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.getUsers = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    conn.query('SELECT * FROM usuarios', (error, result, fields) => {
      conn.release()
      if(error) res.status(500).send({ error: error })
      const response = {
        quantidade: result.length,
        usuarios: result.map( user => {
          return {
            id_usuario: user.id_usuario,
            email: user.email,
            senha: user.senha,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os usuarios',
            }
          }
        })
      }
      res.status(200).send({ response })
    })
  })
}

exports.cadastroUsers = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    conn.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [req.body.email],
      (error, result) => {
        if(error) res.status(500).send({ error: error })
        if(result.length > 0) res.status(401).send({ mensagem: 'Usuário já cadastrado!' })
        else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if(errBcrypt) res.status(500).send({ error: errBcrypt })
            conn.query(
              `INSERT INTO usuarios (email, senha) VALUES (? , ? )`,
              [req.body.email, hash],
              (error, result) => {
                conn.release()
                if(error) res.status(500).send({ error: error })
                const response = {
                  mensagem: 'Usuário criado com sucesso!',
                  usuario: {
                    id_usuario: req.body.id_usuario,
                    email: req.body.email
                  }
                }
                return res.status(201).send(response)
              }
            )
          })
        }
      }
    )
  })
}

exports.deleteUser = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    conn.query(`DELETE FROM usuarios WHERE id_usuario = ?`,
      [req.body.id_usuario],
      (error, result, fields) => {
      conn.release()
      if(error) res.status(500).send({ error: error })
      const response = {
        mensagem: 'Usuario removido com sucesso!',
        request: {
          tipo: 'DELETE',
          descricao: 'Deleta um produto'
        }
      }
      res.status(202).send(response)
    })
  })
}

exports.login = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    const _query = `SELECT * FROM usuarios WHERE email = ?`
    conn.query(_query, [req.body.email], (error, result, fields) => {
      conn.release()
      if(error) res.status(500).send({ error: error })
      if(result.length < 1) { 
        return res.status(401).send({ mensagem: 'Falha na autenticação!' }) 
      }
      bcrypt.compare(req.body.senha, result[0].senha, (error, reslt) => {
        if(error) { return res.status(401).send({ mensagem: 'Falha na autenticação!' }) }
        if(result) { 
          const token = jwt.sign({
            id_usuario: result[0].id_usuario,
            email: result[0].email
          }, process.env.JWT_KEY, { expiresIn: '1h' })
          return res.status(200).send({ 
            mensagem: 'Sucesso na autenticação!' ,
            token: token
          }) 
        }
        return res.status(401).send({ mensagem: 'Falha na autenticação!' })
      })
    })
  })
}