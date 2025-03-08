import { db } from "@/lib/db";
import CustomError from "@/utils/CustomError";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    const { token, password } = await request.json();

    if(!password){
      throw new CustomError('Password no enviado', 400)
    }

    if (!token) {
      throw new CustomError('Token no enviado', 400)

    }

    //verificar si existe el token en la base de datos
    const verifyToken = await db.resetPasswordToken.findFirst({
      where: {
        token,
      },
    });

    if (!verifyToken) {
      throw new CustomError('Token no encontrado o ya ha sido', 400)
    }

    //verificar si el token expiro
    if (verifyToken.expires < new Date()) {
      throw new CustomError('Token ha expirado', 400)
    }

    // hash de la contraseña
    const pass = password as string;
    const passwordHash = await bcrypt.hash(pass, 10);

    //marcar el email como verificado
    await db.user.update({
      where: {
        email: verifyToken.identifier,
      },
      data: {
        password: passwordHash,
      },
    });

    // eliminar el token
    await db.resetPasswordToken.delete({
      where: {
        identifier: verifyToken.identifier,
      },
    });

return  NextResponse.json({ message: "Contraseña restablecida" }, { status: 200 })

  } catch (error) {

    if(error instanceof CustomError){
      console.log(error.message)
      return NextResponse.json({ error: "Ocurrio un Error al restablecer la contraseña." }, { status: error.statusCode })
    }else{
      console.log(error)
      return NextResponse.json({ error: "Error 500 restablecer contraseña" }, { status: 500 })
    }
    
  }
}
