export const runtime = "nodejs";
import bcrypt from "bcryptjs";
export const encrypt= async(text: string)=>{
    return await bcrypt.hash(text, 10);
}