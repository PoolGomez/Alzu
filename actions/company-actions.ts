"use server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Company } from "@prisma/client"

// export const getCompanyById = async(companyId: string) => {
//     try {
//         const company = await db.company.findUnique({
//             where:{
//                 id : companyId
//             }
//         }) 
//         return company as Company
            
//     } catch (error) {
//         throw new Error(
//             error instanceof Error
//               ? error.message
//               : "Error getCompanyById"
//           );
//     }
// }

export const updateCompanyAction = async (companyId: string, company: Company) => {
    try {

        await db.company.update({
            where:{
                id: companyId
            },
            data:{
                name: company.name
            }
        })
    } catch (error) {
        throw new Error(
            error instanceof Error
              ? error.message
              : "Error updateCompanyAction"
          );
    }
}

export const deleteCompanyAction = async (companyId: string) => {
    try {
        //agregar que se debe borrar todo el contenido relacionado a la empresa
        await db.companyUserRole.deleteMany({
            where:{
                companyId
            }
        })
        await db.companyRole.deleteMany({
            where:{
                companyId
            }
        })
        await db.product.deleteMany({
            where:{
                companyId
            }
        })
        await db.category.deleteMany({
            where:{
                companyId
            }
        })
        await db.room.deleteMany({
            where:{
                companyId
            }
        })
        await db.table.deleteMany({
            where:{
                companyId
            }
        })
        //borrar empresa
        await db.company.delete({
            where:{
                id: companyId
            }
        })
    } catch (error) {
        throw new Error(
            error instanceof Error
              ? error.message
              : "Error deleteCompanyAction"
          );
    }
}

export const createCompanyAction = async (name: string) => {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            throw new Error("No existe una sesión");
        }
        const userData = await db.user.findFirst({
            where:{
                email: session?.user?.email
            }
        })
        if(!userData){
            return new Error("No existe datos del usuario");
        }

        //validar si la  suscripcion del usuario permite la creacion max
        const numCompanies = await db.company.count({
            where:{
                ownerId : userData.id
            }
        })
        const userSuscription = await db.userSubcription.findUnique({
            where:{
                userId: userData.id
            },
            include:{
                subcription:{
                    select:{
                        maxCompanies: true
                    }
                }
            }
        })
        if(!userSuscription) return new Error("No existe una suscription para este usuario");

        if(numCompanies >= userSuscription.subcription.maxCompanies){
            return new Error("No puede superar el limite de empresas creadas para su supcripción");
        }
        //creando empresa
        const newCompany = await db.company.create({
            data:{
                name,
                ownerId: userData.id
            }
        })
        //creando rol basico
        // await db.companyRole.create({
        //     data:{
        //         name: "Invitado",
        //         companyId: newCompany.id,
        //         description:"Role default",
        //         permissions: []
        //     }
        // })
console.log("newCompany:", newCompany)
        return newCompany


    } catch (error) {
        throw new Error(
            error instanceof Error
              ? error.message
              : "Error createCompanyAction"
          );
    }
}