import { auth } from "@/auth"
import { db } from "@/lib/db"
import { UserWithAllCompanies } from "@/types-db"
import { redirect } from "next/navigation"

type Params = Promise <{
    companyId: string
}>

const RoomsPage = async ({params}:{params: Params}) => {
    //Verificar session
    const session = await auth()
    if(!session?.user?.email){
    console.log("No hay session")
    redirect("/login")
    }

    const userData = (await db.user.findUnique({
        omit:{
            password: true
        },
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
        console.log("No existe usuario en DB")
        redirect("/login")
    }

    const {companyId} = await params;

    const validateOnwer = userData.createdCompanies.some((company)=>company.id === companyId)
    const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("VIEW_ROOMS"))

    if( validateOnwer || validatePermissions){
        console.log("si tiene permiso")
        return (
          <div className="flex-col">
              <div className="flex-1 space-y-5 p-8 pt-6">
                  Rooms Page
              </div>
          </div>
        )
    }else{
    console.log("no tiene permiso")
    redirect(`/alzu/${companyId}`)
    }
    
}

export default RoomsPage
