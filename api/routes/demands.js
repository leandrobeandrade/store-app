const express = require('express')
const router = express.Router()
const pedidosCTRL = require('../controllers/demands-ctrl')

router.get('/', pedidosCTRL.getPedidos)

router.post('/', pedidosCTRL.postPedido)

router.get('/:id_pedido', pedidosCTRL.getUmPedido)

router.delete('/', pedidosCTRL.deletePedido)

module.exports = router