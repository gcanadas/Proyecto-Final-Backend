import { Router } from 'express';
import carrito from './carrito.js';
import productos from './productos.js';
import login from './login.js';

const router = Router();

router.use('/', login);
router.use("/carrito", carrito);
router.use("/productos", productos);

export default router;