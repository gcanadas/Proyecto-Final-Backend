import nodemailer from 'nodemailer';
import logger from '../log/logger';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'donnell.lakin@ethereal.email',
        pass: 'mhDU7JpffXNEtFEd38',
    },
})


export default async function sendMail(subject, body) {
    const opts ={
        from: 'Backend Node Server',
        to: process.env.EMAIL_ADMIN,
        subject,
        html: body,
    }
  
    try {
        const result = await transporter.sendMail(opts)
        logger.info(`Resultado de envio de email: ${result}`)
    } catch (error) {
        logger.error(`Error en envio de email: ${error.message}`)
    }
}