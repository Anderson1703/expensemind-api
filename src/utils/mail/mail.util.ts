import nodemailer from "nodemailer";

interface SendEmailResponse {
  error: boolean;
  message: string;
}

export class MailUtil {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      //secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  private async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<SendEmailResponse> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM!,
        to,
        subject,
        text,
        html,
      });
      return { error: false, message: "Email sent successfully" };
    } catch (error: any) {
      return { error: true, message: error.message };
    }
  }

  async sendResetPasswordMail({
    to,
    token,
  }: {
    to: string;
    token: string;
  }): Promise<SendEmailResponse> {
    const subject = "Restablece tu contraseña de ExpenseMind AI";

    const text = `Hola,\n\nHas solicitado restablecer tu contraseña para ExpenseMind AI.\n\nPara continuar con el proceso, por favor utiliza el siguiente token: ${token}\n\nSi no has solicitado restablecer tu contraseña, puedes ignorar este correo.\n\nGracias,\nEl equipo de ExpenseMind AI`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restablece tu contraseña</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 15px;
                }
                .title {
                    color: #2c3e50;
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                .token {
                    background-color: #f0f0f0;
                    padding: 15px;
                    text-align: center;
                    font-size: 24px;
                    letter-spacing: 5px;
                    font-weight: bold;
                    border-radius: 6px;
                    margin: 20px 0;
                    color: #2c3e50;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 12px;
                    color: #666;
                }
                .button {
                    display: inline-block;
                    background-color: #3498db;
                    color: white;
                    text-decoration: none;
                    padding: 12px 30px;
                    border-radius: 4px;
                    font-weight: bold;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="https://outgoing-walkover-548.notion.site/image/attachment%3Aeb13f5fe-922d-4c06-93a6-e4d8a076fbe9%3AChatGPT_Image_Apr_24_2025_03_36_29_PM.png?table=block&id=1e06293e-864a-80da-bb55-d71a100b6152&spaceId=c1403a56-3800-4276-85ee-5eee1442683c&width=1420&userId=&cache=v2" alt="ExpenseMind AI Logo">
                    <h1 class="title">Restablece tu contraseña</h1>
                </div>
                
                <p>Hola,</p>
                
                <p>Has solicitado restablecer tu contraseña para tu cuenta de ExpenseMind AI. Utiliza el siguiente token para completar el proceso:</p>
                
                <div class="token">${token}</div>
                
                <p>Este token expirará en 5 minutos por motivos de seguridad.</p>
                
                <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este correo.</p>
                
                <p>Gracias,<br>El equipo de ExpenseMind AI</p>
                
                <div class="footer">
                    <p>© 2025 ExpenseMind AI. Todos los derechos reservados.</p>
                    <p>Si tienes problemas para restablecer tu contraseña, contacta con nuestro soporte en support@expensemind.com</p>
                </div>
            </div>
        </body>
        </html>
        `;

    return this.sendMail({
      to,
      subject,
      text,
      html,
    });
  }

  async sendOTPCode({
    to,
    otp,
  }: {
    to: string;
    otp: string;
  }): Promise<SendEmailResponse> {
    const subject = "Tu código de verificación para ExpenseMind AI";

    const text = `Hola,\n\nTu código de verificación para ExpenseMind AI es: ${otp}\n\nEste código expirará en 10 minutos.\n\nSi no has solicitado este código, por favor ignora este mensaje o contacta con nuestro equipo de soporte.\n\nGracias,\nEl equipo de ExpenseMind AI`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Código de verificación</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 15px;
                }
                .title {
                    color: #2c3e50;
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                .otp-code {
                    background-color: #f0f0f0;
                    padding: 20px;
                    text-align: center;
                    font-size: 32px;
                    letter-spacing: 8px;
                    font-weight: bold;
                    border-radius: 6px;
                    margin: 20px 0;
                    color: #2c3e50;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="https://outgoing-walkover-548.notion.site/image/attachment%3Aeb13f5fe-922d-4c06-93a6-e4d8a076fbe9%3AChatGPT_Image_Apr_24_2025_03_36_29_PM.png?table=block&id=1e06293e-864a-80da-bb55-d71a100b6152&spaceId=c1403a56-3800-4276-85ee-5eee1442683c&width=1420&userId=&cache=v2" alt="ExpenseMind AI Logo">
                    <h1 class="title">Tu código de verificación</h1>
                </div>
                
                <p>Hola,</p>
                
                <p>A continuación encontrarás tu código de verificación para ExpenseMind AI:</p>
                
                <div class="otp-code">${otp}</div>
                
                <p>Este código expirará en 5 minutos por motivos de seguridad.</p>
                
                <p>Si no has solicitado este código, por favor ignora este mensaje o contacta con nuestro equipo de soporte.</p>
                
                <p>Gracias,<br>El equipo de ExpenseMind AI</p>
                
                <div class="footer">
                    <p>© 2025 ExpenseMind AI. Todos los derechos reservados.</p>
                    <p>ExpenseMind AI - La forma inteligente de gestionar tus gastos</p>
                </div>
            </div>
        </body>
        </html>
        `;

    return this.sendMail({ to, subject, text, html });
  }
}
