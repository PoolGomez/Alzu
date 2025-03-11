import NextAuth from "next-auth"
import authConfig from "./auth.config"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"


 
export const { handlers, signIn, signOut, auth } = NextAuth({
  logger:{
    error(code, ...message){
      console.log("logger Error:")
      console.log(code,message)
    },
    warn(code, ...message) {
      console.log("logger Warn:")
      console.log(code,message)
    },
    debug(code, ...message) {
      console.log("logger Debug:")
      console.log(code,message)
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks:{

    //jwt() se ejecuta cada vez que se crea o actualiza un token JWT
        // aqui es donde puedes agregar informacion adicional al token
        // jwt({ token, user }) {
        //   if (user) { // User is available during sign-in
        //     token.role = user.role
        //   }
        //   return token
        // },


        // session() se utiliza para agregar la informacion del token a la sesion del usuario
        // lo que hace este disponible en el cliente
        // session({ session, token}) {
        //   session.user.role = token.role
        //   return session
        // },

  }
})