import { Prisma } from "@prisma/client";

export interface UserSearch {
    id: string;
    name: string;
    email: string;
    isShared: boolean;
    
}

export type UserWithAllCompanies = Prisma.UserGetPayload<{
  include:{
    companiesUserRoles : {
      include:{
        company: true,
        role:true,
      }
    },
    createdCompanies: true,
  }
}>

export type CompanyUserRoleWithUser = Prisma.CompanyUserRoleGetPayload<{
    include: { 
      user: true,
      role: true
    }
}>

// // export type CompanyUserWithPermissions = Prisma.CompanyUserGetPayload<{
// //     include: { permissions: true}
// // }>

export type CompanyWithOwnerUsers = Prisma.CompanyGetPayload<{
  include:{
    owner: true,
    users: {
        include: {
            user: true
        }
    }
  }  
}>

// export type CompanyUserWithRolePermissions = Prisma.CompanyUserGetPayload<{
//   include:{
//     role:{
//       include:{
//         permissions: true
//       }
//     }
//   }
// }>

