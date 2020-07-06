const mysql = require('../mysql').connect

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    conn.query(
      `SELECT pedidos.id_pedido, 
              pedidos.quantidade, 
              produtos.id_produto, 
              produtos.nome, 
              produtos.preco 
         FROM pedidos 
   INNER JOIN produtos 
           ON pedidos.id_produto = produtos.id_produto;`, 
      (error, result, fields) => {
      conn.release()
        if(error) res.status(500).send({ error: error })
        const response = {
          pedidos: result.map( ped => {
            return {
              id_pedido: ped.id_pedido,
              quantidade: ped.quantidade,
              produto: {
                id_produto: ped.id_produto,
                nome: ped.nome,
                preco: ped.preco
              },
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os pedidos',
                url: 'http://localhost:4000/pedidos/' + ped.id_pedido
              }
            }
          })
        }
        res.status(200).send({ pedidos: response.pedidos })
      }
    )
  })
}

exports.postPedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    conn.query(
      `SELECT * FROM produtos WHERE id_produto = ?`,
      [req.body.id_produto],
      (error, result, fields) => {
        if(error) res.status(500).send({ error: error })
        if(result.length == 0) {
          return res.status(404).send({ mensagem: 'Produto naõ encontrado!' })
        }

        conn.query(
          'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)', 
          [req.body.id_produto, req.body.quantidade],
          (error, result, fields) => {
            conn.release()
            if(error) res.status(500).send({ error: error })
            const response = {
              mensagem: 'Pedido inserido com sucesso!',
              pedido: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                  tipo: 'POST',
                  descricao: 'Insere um pedido',
                  url: 'http://localhost:4000/pedidos'
                }
              }
            }
            res.status(201).send({ response })
          }
        )
      }
    )
  })
}

exports.getUmPedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    conn.query('SELECT * FROM pedidos WHERE id_pedido = ?',
    [req.params.id_pedido],
      (error, result, fields) => {
      conn.release()
      if(error) res.status(500).send({ error: error })
      if(result.length == 0) {
        res.status(404).send({ error: 'Não foi encontrado pedido com este id!' })
        return
      }
      const response = {
        pedido: {
          id_pedido: result[0].id_pedido,
          id_produto: result[0].id_produto,
          quantidade: result[0].quantidade,
          request: {
            tipo: 'GET',
            descricao: 'Retorna um pedido',
            url: 'http://localhost:4000/pedidos'
          }
        }
      }
      res.status(201).send({ response })
    })
  })
}

exports.deletePedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) res.status(500).send({ error: error })
    conn.query(`DELETE FROM pedidos WHERE id_pedido = ?`,
      [req.body.id_pedido],
      (error, result, fields) => {
      conn.release()
      if(error) res.status(500).send({ error: error })
      const response = {
        mensagem: 'Pedido removido com sucesso!',
        request: {
          tipo: 'DELETE',
          descricao: 'Deleta um pedido'
        }
      }
      res.status(202).send(response)
    })
  })
}