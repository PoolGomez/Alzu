import { Prisma } from "@prisma/client";

export interface UserSearch {
    id: string;
    name: string;
    email: string;
    isShared: boolean;
    
}

export type UserWithAllCompanies = Prisma.UserGetPayload<{
  
  include:{
    email: true,
    companiesUserRoles : {
      include:{
        company: true,
        role:{
          select:{
            permissions: true
          }
        },
      }
    },
    createdCompanies: true
    // {
    //   select:{
    //     id:true,
    //     name:true,
    //   }
    // },
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


//detalle comanda
export type OrderItemWithProduct = Prisma.OrderItemGetPayload<{
  include:{
    product: {
      select: {
        name: true
      }
    }
  }
}>




