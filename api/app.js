const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const routeProducts = require('./routes/products')
const routeDemands = require('./routes/demands')
const routeUsers = require('./routes/users')

app.use('/uploads', express.static('uploads'))    // deixa a pasta uploads acessível

// midlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Header', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization')
  
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET')
    return res.status(200).send()
  }
  next()
})

// routes
app.use('/produtos', routeProducts)
app.use('/pedidos', routeDemands)
app.use('/usuarios', routeUsers)

app.get('/', (req, res) => {
  res.send({ teste: 'Index geral da aplicação' })
})

app.use((req, res, next) => {                       // rota não encontrada
  const erro = new Error('Não encontrado!')
  erro.status = 404
  next(erro)
})

app.use((error, req, res, next) => {                // erro de outras rotas
  res.status(error.status || 500)
  return res.send({ erro: { mensagem: error.message } })
})

module.exports = app