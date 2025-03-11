"use client"
import { useSession } from "next-auth/react"

const ButtonsLogin = () => {
    const { data: session } = useSession()

    if(!session){
        return(
            <>
            <a href='/login' className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Iniciar Sesión
              </a>
            <a href='/register' className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Comenzar Prueba Gratis
              </a>
              </>
        )
    }else{
        return(
            <a href='/login' className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Ingresar
              </a>
        )
    }

    // return (
    //     <h1>{session?.user?.email ?? "no existe"}</h1>
    // )
    // if (session?.user?.email === "admin") {
    //     return <p>logueado</p>
    //   }
     
    //   return <p>No logueado</p>
}

export default ButtonsLogin