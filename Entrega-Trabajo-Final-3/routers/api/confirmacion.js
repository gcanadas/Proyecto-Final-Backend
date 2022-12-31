import { Router } from "express";
import sendMail from '../../controllers/mail.js';
import { sendWhatsapp, sendSms } from '../../controllers/twilio.js';

const router = Router();
const adminNumber = process.env.ADMIN_PHONE;

router.post('/confirmacion', async (req, res, next) => {
    try{
        logger.info(`Ruta: ${req.originalUrl} - Metodo: ${req.method}`);
        const subject = `Nuevo pedido de ${req.body.name} - ${req.body.email}`
        const body = req.body.message;
        sendMail(subject, body);
        sendWhatsapp(subject, adminNumber);
        sendSms("Su pedido a sido recibido y se encuentra en proceso", req.body.phone);
    } catch (err) {
        logger.error(`Ruta ${req.originalUrl} - Metodo: ${req.method}`);
    }
});

export default router;