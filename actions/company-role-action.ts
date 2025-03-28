"use server"
import { db } from "@/lib/db";
import { CompanyRole, PermissionAction } from "@prisma/client";

export async function getCompanyRolById(roleId: string) {
  try {
    const role = await db.companyRole.findUnique({
          where:{
            id: roleId
          }
    })
    return role;

  } catch (error) {
    console.log(error)
        throw new Error("error getCompanyRolById");
  }
}

export async function getCompanyRoleByCompanyIdAction(companyId: string) {
    try {
        const roles = await db.companyRole.findMany({
            where: {
              companyId
            },
          });
          return roles as CompanyRole[]
    } catch (error) {
        console.log(error)
        throw new Error("error getCompanyRoleByCompanyIdAction");
    }
  
}

export async function updateCompanyRoleAction(id: string, name: string, description: string, permissions: PermissionAction[]){
  try {
    await db.companyRole.update({
      where:{
          id: id
      },
      data:{
          name: name,
          description: description,
          permissions: {
              set: permissions
          }
      }
    })
  } catch (error) {
    console.log(error)
        throw new Error("error updateCompanyRoleAction");
  }
}

export async function deleteCompanyRoleAction(id: string){
  try {
    await db.companyRole.delete({
      where: {
        id
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error("error deleteCompanyRoleAction");
  }
}

export async function createCompanyRoleAction(name: string, description: string, permissions: PermissionAction[], companyId: string){
  try {
    await db.companyRole.create({
      data:{
        name,
        description,
        permissions,
        companyId
      }
    })
  } catch (error) {
    console.log(error)
    throw new Error("error createCompanyRoleAction");
  }
}
