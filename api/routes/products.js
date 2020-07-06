const express = require('express')
const router = express.Router()
const multer = require('multer')
//const login = require('../middleware/login')    proteção de rotas (preferi não implementar)

const produtosCTRL = require('../controllers/products-ctrl')

const storage = multer.diskStorage({ 
  destination: (req, file , cb)  => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, new Date().toISOString() + file.originalname)
})

const filtros = (req, file, cb) => {
  if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') cb(null, true)
  else cb(null, false)
}

const upload = multer({ 
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5 
  }, 
  fileFilter: filtros 
})

// ROTAS

router.get('/', produtosCTRL.getProdutos)

router.post('/', upload.single('produto_imagem'), produtosCTRL.postProduto)

router.get('/:id_produto', produtosCTRL.getUmProduto)

router.patch('/', produtosCTRL.patchProduto)

router.delete('/', produtosCTRL.deleteProduto)


module.exports = router