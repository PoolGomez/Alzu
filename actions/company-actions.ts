"use server"
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
        return {error: "error get-company-by-id-action"}
    }
}

export const updateCompanyAction = async (companyId: string, company: Company) => {
    try {

        const companyUpdated = await db.company.update({
            where:{
                id: companyId
            },
            data:{
                name: company.name
            }
        })
        console.log("companyUpdated: ",companyUpdated)
    } catch (error) {
        console.log("Error update-company-action: ",error)
        return {error: "error update-company-action"}
    }
}

export const deleteCompanyAction = async (companyId: string) => {
    try {
        //agregar que se debe borrar todo el contenido relacionado a la empresa
        await db.company.delete({
            where:{
                id: companyId
            }
        })
    } catch (error) {
        console.log(error)
        return {error: "error delete-company-action"}
    }
}