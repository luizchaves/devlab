import nodemailer from 'nodemailer';

import { config } from '#config.ts';
import { log } from '#middlewares/logger.ts';

// #region transport
/**
 * Em desenvolvimento, o `jsonTransport` nao envia nada: ele serializa a
 * mensagem e devolve. Assim o fluxo inteiro e exercitavel sem credencial de
 * SMTP e sem enviar e-mail de verdade para ninguem.
 */
const transporter = config.SMTP_HOST
  ? nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: { user: config.SMTP_USER, pass: config.SMTP_PASSWORD },
    })
  : nodemailer.createTransport({ jsonTransport: true });
// #endregion

// #region send
/**
 * O envio nao bloqueia a resposta HTTP.
 *
 * Um SMTP lento transformaria um cadastro de 50 ms numa espera de tres
 * segundos, e um SMTP fora do ar faria o cadastro falhar — quando na verdade o
 * usuario ja foi criado.
 */
export function send(to: string, subject: string, html: string) {
  transporter
    .sendMail({ from: config.MAIL_FROM, to, subject, html })
    .then(() => log('info', 'mail_sent', { to, subject }))
    .catch((error: Error) => log('error', 'mail_failed', { to, subject, error: error.message }));
}
// #endregion

// #region templates
export function sendWelcome(to: string, name: string, token: string) {
  const link = `${config.APP_URL}/auth/verify?token=${token}`;

  send(
    to,
    'Confirme seu e-mail',
    `<p>Ola, ${name}!</p>
     <p>Confirme seu endereco clicando em <a href="${link}">${link}</a>.</p>`
  );
}
// #endregion
