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
        subject: "Verificación de Email - Alzu",
        // text: 
        html:`<p>Haga clic en el enlace a continuación para verificar su correo electrónico</p>
                     <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">Verificar correo electrónico</a>
                     `
      };
  
      // Enviar el correo
      await transporter.sendMail(mailOptions);
  
      return NextResponse.json({ message: "Correo enviado exitosamente" });
    } catch (error) {
        console.log(`SEND-EMAIL-VERIFY-EMAIL_POST:${error}`)
      return NextResponse.json({ error: "Error al enviar correo" }, { status: 500 });
    }
  }

// export const POST = async (req: Request)=>{
//     try {
//         const body = await req.json()
//         const { name, email, message } = body;
//         console.log("name:", name)
//         console.log("email:", email as string)
//         console.log("message:", message)
//         const response = await axios.post(
//             "https://api.brevo.com/v3/smtp/email",
//             {
//               sender: {
//                 name: process.env.TARGET_NAME as string,
//                 email: process.env.TARGET_EMAIL as string,
//               },
//               to: [{ email: email as string }],
//               subject: "Contact Form Submission",
//               htmlContent: `<html>
//                   <body>
//                     <h1>Contact Form Submission</h1>
//                     <p><strong>Name:</strong> ${name}</p>
//                     <p><strong>Email:</strong> ${email}</p>
//                     <p><strong>Message:</strong></p>DDD
//                     <p>${message}</p>
//                   </body>
//                 </html>
//               `,
//             },
//             {
//               headers: {
//                 "api-key": process.env.BREVO_API_KEY as string,
//                 "Content-Type": "application/json",
//                 accept: "application/json",
//               },
//             }
//           );
    
//           return NextResponse.json({
//             message: "Email sent successfully!", 
//             data: response.data
//           })
          

            
//     } catch (error) {
//         console.log(`SENDEMAIL_POST:${error}`)
//         return new NextResponse("Internal Server Error", { status : 500 })
//     }
// }
