const { Router } = require('express');
const carrito = require("./carrito");
const productos = require("./productos");

const router = Router();

router.use("/carrito", carrito);
router.use("/productos", productos);

module.exports = router;