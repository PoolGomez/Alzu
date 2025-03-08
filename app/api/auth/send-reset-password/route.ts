import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
      const { to, token } = await req.json();
  
      // Configurar Nodemailer con Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Tu correo de Gmail
          pass: process.env.EMAIL_PASS, // Contraseña de aplicación
        },
      });
  
      // Configurar el correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Restablecer contraseña - Alzu",
        // text: 
        html:`<p>Haga clic en el enlace a continuación para restablecer su contraseña</p>
                     <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${token}">Restablecer contraseña</a>
                     `
      };
  
      // Enviar el correo
      await transporter.sendMail(mailOptions);
  
      return NextResponse.json({ message: "Correo enviado exitosamente" });
    } catch (error) {
        console.log(`SEND-EMAIL-RESET-PASSWORD_POST:${error}`)
      return NextResponse.json({ error: "Error al enviar correo" }, { status: 500 });
    }
  }