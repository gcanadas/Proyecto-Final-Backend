import twilio from 'twilio';
import logger from '../log/logger';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioMensagerService = process.env.TWILIO_MESSAGER_SERVICE;

export async function sendWhatsapp(message, target) {
    if (!message) {
        logger.error('Error: Se requiere un mensaje para el envio de Whatsapp');
        return
    }
      
    if (!target) {
        logger.error('Error: Se requiere un destinatario para el envio de Whatsapp');
        return
    }

    const client = twilio(accountSid, authToken);

    const opts = {
        body: message,
        from: `whatsapp:${twilioNumber}`,
        to: `whatsapp:${target}`,
    };
    client.messages
        .create(opts)
        .then((message) => logger.info('Se envio correctamente mensaje de Whatsapp:', message.sid))
        .catch(logger.error('Error en el envio de mensaje de Whatsapp'));
}
export async function sendSms(message, target) {
    if (!message) {
        logger.error('Error: Se requiere un mensaje para el envio de SMS');
        return
    }
      
    if (!target) {
        logger.error('Error: Se requiere un destinatario para el envio de SMS');
        return
    }

    const client = twilio(accountSid, authToken);

    client.messages
        .create({
            body: message,
            messagingServiceSid: twilioMensagerService,
            to: target,
        })
        .then((message) => logger.info('Se envio correctamente SMS:', message.sid))
        .catch(logger.error('Error en el envio de SMS'));
}