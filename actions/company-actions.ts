import { db } from "@/lib/db"
import { Company } from "@prisma/client"

export const getCompanyById = async(companyId: string) => {
    try {
        const company = await db.company.findUnique({
            where:{
                id : companyId
            }
        })
        // return { success: true }    
        return company as Company
            
    } catch (error) {
        console.log(error)
        return {error: "error company-actions"}
    }
}