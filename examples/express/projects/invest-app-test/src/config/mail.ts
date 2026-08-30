import nodemailer from 'nodemailer';

/**
 * E uma funcao `async`, e nao um objeto, porque em desenvolvimento a conta de
 * teste do Ethereal e criada em tempo de execucao — uma chamada de rede.
 */
async function mailConfig() {
  const config = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    const testAccount = await nodemailer.createTestAccount();

    config.auth = { user: testAccount.user, pass: testAccount.pass };
  }

  return config;
}

export default mailConfig;
