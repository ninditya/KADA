import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  }

  return transporter;
}

// Mengirim email notifikasi ketika signup berhasil.
export async function sendSignupSuccessEmail({ to, username }) {
  const smtp = getTransporter();
  if (!smtp || !to) return false;

  await smtp.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Signup Berhasil',
    text: `Halo ${username}, akun kamu berhasil dibuat pada ${new Date().toISOString()}.`
  });

  return true;
}
