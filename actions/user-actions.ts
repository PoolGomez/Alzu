"use server"

import { db } from "@/lib/db"
import { CompanyUserRoleWithUser, UserSearch, UserWithAllCompanies } from "@/types-db";


export const searchUserByEmailAction = async(email: string,sessionEmail: string,companyId:string) => {
    console.log("email:",email)
    console.log("sessionEmail:",sessionEmail)
    console.log("companyId:",companyId)
    try {
        const users = await db.user.findMany({
            where:{
                email : {
                    contains: email,
                    not: sessionEmail
                }
            },
            include:{
                companiesUserRoles: {
                    where:{
                        companyId
                    },
                    select: {
                        id: true
                    }
                }
            }
        })

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            isShared: user.companiesUserRoles.length > 0, // Si tiene relación, significa que ya está compartido
        }));

        console.log("users data: ", users)
        console.log("formattedUsers data: ", formattedUsers)
        // return { success: true }    
        return formattedUsers as UserSearch[]
            
    } catch (error) {
        console.log(error)
        // return 
        throw new Error("error search-user-by-email-action");
        // return {error: "error search-user-by-email-action"}
    }
}
export const sendInviteUserAction = async (to: string, companyId: string , roleId: string) => {
    try {
        await db.companyUserRole.create({
            data:{
                userId: to,
                companyId: companyId,
                roleId: roleId

                // permissions:{
                //     connectOrCreate:[
                        // { where: { name: "view_dashboard" }, create: { name: "view_dashboard" }},
                        // { where: { name: "manage_orders" }, create: { name: "manage_orders" } },
                //     ]
                // }
            }
        })
    } catch (error) {
        console.log(error)
        throw new Error("error send-invite-user-action");
    }
}


export const getUsersByCompanyIdAction = async (companyId: string) => {
    try {
        const users = await db.companyUserRole.findMany({
            where:{
                companyId: companyId,
            },
            include:{
                user: true,
                role: true
            },
            orderBy:{
                user:{
                    name: "asc"
                }
            }
        })
        return users as CompanyUserRoleWithUser[]

    } catch (error) {
        console.log(error)
        throw new Error("error getUsersByCompanyIdAction");
    }
}

export const getUsersWithAllCompanies = async(email: string )=> {
    try {
        const userData = (await db.user.findUnique({
                  omit:{
                    password: true
                  },
                  where:{
                    email: email
                  },
                  include:{
                    companiesUserRoles: {
                      include:{
                        role: true
                      }
                    },
                    createdCompanies: true
                  }
            })  ) as UserWithAllCompanies
        return userData

    } catch (error) {
        console.log(error)
        throw new Error("error getUsersWithAllCompanies");
    }
}
