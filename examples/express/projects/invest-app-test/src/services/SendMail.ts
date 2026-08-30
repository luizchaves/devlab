import nodemailer from 'nodemailer';

import mailConfig from '@/config/mail.ts';

/**
 * O nome descreve a intencao, nao o transporte: quem chama nao escolhe assunto,
 * remetente nem formato. Todo o conhecimento de SMTP para neste arquivo.
 */
async function createNewUser(to: string) {
  const config = await mailConfig();

  // Sem SMTP configurado (em teste, por exemplo) o envio e apenas registrado.
  if (!config.host) {
    console.warn(`SMTP nao configurado: e-mail de boas-vindas para ${to} nao enviado.`);
    return;
  }

  const transporter = nodemailer.createTransport(config);

  const info = await transporter.sendMail({
    from: 'noreply@investapp.dev',
    to,
    subject: 'Conta criada no InvestApp',
    // Vai nos dois formatos: clientes que nao renderizam HTML caem no texto.
    text: 'Conta criada com sucesso. Acesse o InvestApp para acompanhar a sua carteira.',
    html: '<h1>Conta criada com sucesso.</h1><p>Acesse o InvestApp para acompanhar a sua carteira.</p>',
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`Send email: ${nodemailer.getTestMessageUrl(info)}`);
  }
}

export default { createNewUser };
