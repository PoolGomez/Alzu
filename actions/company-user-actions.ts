import { db } from "@/lib/db";
import { CompanyWithOwnerUsers } from "@/types-db";


export async function getCompanyUsersByEmail(email: string) {
    try {
        const companies = await db.company.findMany({
            where: {
              OR: [
                { owner: { email } }, // Verifica si el email pertenece al creador
                { users: { some: { user: { email } } } }, // Verifica si el usuario está asignado
              ],
            },
            include: {
              owner: true, // Traer información del creador
              users: {
                include: {
                  user: true, // Traer información de los usuarios asignados
                },
              },
            },
          });
        
          return companies as CompanyWithOwnerUsers[];
    } catch (error) {
        console.log(error)
        throw new Error("error getCompanyUsersByEmail");
    }
  
}


// export async function getPermissionCompanyUser ( userId : string, companyId: string) {
//   try {
//     const companyUser = await db.companyUser.findFirst({
//       where:{
//         userId,
//         companyId
//       },
//       include: {
//         role: {
//           include: {
//             permissions: true
//           }
//         }
//       }
//     })
//     return companyUser

//   } catch (error) {
//     console.log(error)
//         throw new Error("error getPermissionCompanyUser");
//   }
// }