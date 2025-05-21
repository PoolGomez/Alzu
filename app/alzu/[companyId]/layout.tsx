import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SideBar from "./_components/sidebar";
import { 
  getCompanyUsersByEmail, 
  // getPermissionCompanyUser 
} from "@/actions/company-user-actions";
import { CompanyWithOwnerUsers, UserWithAllCompanies } from "@/types-db";
import { db } from "@/lib/db";
import { PermissionAction } from "@prisma/client";
import { OrderProvider } from "@/lib/providers";

type Params = Promise<{
  companyId: string
}>

interface DashboardLayout{
    children : React.ReactNode,
    params :Params
}

const DashboardLayout = async ({children, params}: DashboardLayout) => {
  const{companyId} = await params;

    console.log("DashboardLayout")

    const session = await auth();
    if(!session?.user?.email){
        redirect("/login")
    }
    const userData = (await db.user.findUnique({
      // select:{
      //   id:true,
      //   email: true,
      // },
      // omit:{
      //   password: true
      // },
      where:{
        email: session.user.email
      },
      include:{
        companiesUserRoles: {
          include:{
            role: true,
            company: true
          }
        },
        createdCompanies: true
        
      }
    })  ) as UserWithAllCompanies
    
    if(!userData){
      redirect("/login")
  }
    
    //verificar
    const companies = await getCompanyUsersByEmail(session.user.email)
    const company = companies.find((c)=>c.id === companyId) as CompanyWithOwnerUsers

    const permissions : PermissionAction[] = []

    // const permissions = (await getPermissionCompanyUser(userData.id, companyId)) as CompanyUserWithRolePermissions
    const companiesUserRole = userData.companiesUserRoles.find((cur)=> cur.companyId === companyId) // ?.role.permissions 
    
    if(companiesUserRole){
      companiesUserRole.role.permissions.map((item)=> permissions.push(item))
    }
    // const permissions = 
  

    // const companyUserData = await db.companyUser.findFirst({
    //   where:{
    //     userId: userData.id,
    //     companyId : companyId
    //   },
    //   include:{
    //     role:{
    //       include:{
    //         permissions: true
    //       }
    //     }
    //   }
    // })
    // console.log("companyUserData: ", companyUserData)

    // const isOwner = await db.company.findFirst({
    //   where:{
    //     id:companyId,
    //     ownerId: userData.id
    //   }
    // })

    // const currentCompany = await db.company.findUnique({
    //   where:{
    //     id: companyId
    //   }
    // })
    // if(!currentCompany){
    //   console.log("empresa no enocntrada")
    //   redirect("/login")
    // }

    
    
    // const userPermissions = (await db.companyUser.findUnique({
    //       where:{
    //           userId_companyId:{
    //               userId: userData.id,
    //               companyId: currentCompany.id
    //           } 
    //       },
    //       include:{
    //           permissions: true
    //       }
    //   }) ) as CompanyUserWithPermissions

       if(companies.length > 0 ){
        return (
          <>
          <OrderProvider>
          <SideBar 
            company={company}
            // companies={companies}
            currentUserEmail={userData.email} 
            currentUserId={userData.id} 
            // currentCompany={currentCompany} 
            permissions={permissions}
            myCompanies={userData.createdCompanies}
            otherCompanies={userData.companiesUserRoles.map((cur)=>cur.company)}
          >
              {children}
          </SideBar>
          </OrderProvider>
          </>
        )
       }
      else{
        console.log("no tiene permisos")
        redirect("/login")
      }

  
}

export default DashboardLayout
