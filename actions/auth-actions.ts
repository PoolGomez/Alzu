"use server"
import { signIn } from "@/auth";
import { verifyCaptchaToken } from "@/lib/captcha";
import { db } from "@/lib/db";
import { sendEmailResetPassword } from "@/lib/mail";
import { loginSchema, registerSchema, resetPasswordSchema, sendResetPasswordSchema } from "@/lib/zod";
import CustomError from "@/utils/CustomError";
import { encrypt } from "@/utils/hash-password";

import { nanoid } from "nanoid";
import { AuthError } from "next-auth";
import { z } from "zod";

export const loginAction = async(values: z.infer<typeof loginSchema>) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
        })    
        return { success: true }    
    } catch (error) {
        console.log(error)
        if(error instanceof AuthError) {
            return{ error: error.cause?.err?.message };
        }
        return {error: "error 500"}
    }
}

export const sendEmailResetPasswordAction = async(values:z.infer<typeof sendResetPasswordSchema>, tokenre: string | null)=>{
    try {
        const { data , success } = sendResetPasswordSchema.safeParse(values)
        if(!success){
            return {
                error: "Invalid data"
            }
        }

        if(!tokenre){
            return {
                error: "Token no found"
            }
        }


        // verificar si el usuario existe
        const user = await db.user.findUnique({
            where:{
                email: data.email
            },
            include: {
                accounts: true, // Incluir las cuentas asociadas
              },
        });

        if(!user){
            return {
                error: "No existe un usuario con ese correo"
            }
        }

        //google recaptcha
        const captchaData = await verifyCaptchaToken(tokenre);
        if(!captchaData){
            return {
                error: "Captcha Failed"
            }
        }
        if(!captchaData.success || captchaData.score < 0.5){
            console.log(captchaData)
            // console.log(captchaData["error-codes"])
            return{
                error: "error captcha < 0.5"
                // error:!captchaData.succes ? captchaData["error-codes"] : undefined
            }
            // return {
            //     success: false,
            //     message: "Captcha Failed",
            //     errors: !captchaData.succes ? captchaData["error-codes"] : undefined
            // }
        }


        const verifyTokenExits = await db.resetPasswordToken.findFirst({
            where:{
            identifier: user.email
            }
        })

        //si existe un token , lo eliminamos
        if(verifyTokenExits?.identifier){
            await db.resetPasswordToken.delete({
            where:{
                identifier: user.email
            }
            })
        }
        const token = nanoid()

        await db.resetPasswordToken.create({
            data:{
            identifier:user.email,
            token,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 horas
            }
        })

         //enviar email de restablecimiento
         await sendEmailResetPassword(user.email, token);

         return { success: true } 

        
    } catch (error) {
        console.log(error)
        if(error instanceof AuthError) {
            return{ error: error.cause?.err?.message };
        }
        return {error: "error 500"}
    }
}

export const resetPasswordAction = async (values:z.infer<typeof resetPasswordSchema>, token : string) => {
    try {
        const { data , success } = resetPasswordSchema.safeParse(values)
        if(!success){
            return {
                error: "Invalid data"
            }
        }

        const response = 
        await fetch(`${process.env.NEXTAUTH_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                password: data.password,
                token: token
             }),
          });
    
          
        //   console.log("response: ",await response.json())
        //   const res = response.json()
        //   console.log("response_error:", res. )
    
          if (response.ok) {  
            // alert("Email sent successfully!");
            return { success: true } 
          } else {
            const errorData = await response.json()
            throw new CustomError(errorData.error, 405)
            // return {  error: errorData.error , status: 400 }
          }

          
    } catch (error) {
        console.log("Erro auth-action: ",error)
        if(error instanceof AuthError) {
            return{ error: error.cause?.err?.message };
        }
        if(error instanceof CustomError){
            return {
                error: error.message
            }
        }
        return {error: "Ocurrio un error inesperado"}
    }
}

export const registerAction = async(
    values: z.infer<typeof registerSchema>
) => {
    try {
        const {data, success} = registerSchema.safeParse(values)
        if(!success){
            return {
                error: "Invalid data"
            }
        }

        // verificar si el usuario ya existe
        const user = await db.user.findUnique({
            where:{
                email: data.email
            },
            include: {
                accounts: true, // Incluir las cuentas asociadas
              },
        });

        if(user){
            // Verificar si tiene cuentas OAuth vinculadas
            const oauthAccounts = user.accounts.filter(
                (account) => account.type === "oauth"
            );
            if (oauthAccounts.length > 0) {
                return {
                  error:
                    "To confirm your identity, sign in with the same account you used originally.",
                };
            }

            return {
                error: "User already existe"
            }
        }
        // hash de la contraseña
        // const passwordHash = await bcrypt.hash(data.password, 10);
        const passwordHash = await encrypt(data.password);

        //crear el usuario
        await db.user.create({
            data:{
                email: data.email,
                name: data.name,
                password: passwordHash,
            }
        })

        // iniciar sesion
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
        })

        return { success: true }


    } catch (error) {
        console.log(error)
        if(error instanceof AuthError) {
            return{ error: error.cause?.err?.message };
        }
        return {error: "error 500"}
    }
}