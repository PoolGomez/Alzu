
// import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod";
import { db } from "./lib/db";
import bcrypt from "bcrypt"
import {nanoid} from"nanoid"
import { sendEmailVerification } from "./lib/mail";

// Notice this is only an object, not a full Auth.js instance
export default {

  providers: [
    Credentials({
      authorize: async (credentials)=> {

        const {data, success} =loginSchema.safeParse(credentials);
        if(!success){
          throw new Error("Invalid credentials.");
        }

        //verificar si el usuario existe
        const user = await db.user.findUnique({
          where:{
            email: data.email,
            // password: data.password
          }
        })
        if(!user || !user.password){
          throw new Error("No user found");
        }

         //verificar si la contraseña es correcta
         const isValid = await bcrypt.compare(data.password, user.password);
            
         if(!isValid){
           throw new Error("Incorrect password");
         }

         // verificacaion d e email
         if(!user.emailVerified){
           const verifyTokenExits = await db.verificationToken.findFirst({
             where:{
               identifier: user.email
             }
           })

           //si existe un token , lo eliminamos
           if(verifyTokenExits?.identifier){
             await db.verificationToken.delete({
               where:{
                 identifier: user.email
               }
             })
           }
           const token = nanoid()

           await db.verificationToken.create({
             data:{
               identifier:user.email,
               token,
               expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 horas
             }
           })

           //enviar email de verificacion
           await sendEmailVerification(user.email, token);


           throw new Error("Please check Email send verification");
         }

         return user;


      }
    }),
  ],

} satisfies NextAuthConfig