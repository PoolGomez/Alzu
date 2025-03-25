"use server"
import { db } from "@/lib/db";

export const updateCompanyUserRole = async (companyUserRoleId: string, newRoleId: string) => {
    try {
        await db.companyUserRole.update({
            where:{
                id: companyUserRoleId
            },
            data:{
                roleId: newRoleId
            }
        });

    } catch (error) {
        console.log(error)
        throw new Error("error updateCompanyUserRole");
    }
}

export const deleteCompanyUserRoleAction = async (id: string) => {
    try {
        await db.companyUserRole.delete({
            where:{
                id
            }
        })

    } catch (error) {
        console.log(error)
        throw new Error("error delete-user-company-action");
    }
}
