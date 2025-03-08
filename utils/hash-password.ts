export const runtime = "nodejs";
import bcrypt from "bcryptjs";
export const encrypt= async(text: string)=>{
    const saltRounds = 10; // Número de rondas de sal
    return await bcrypt.hash(text, saltRounds);
}