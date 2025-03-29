import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PresentationColumns } from "./_components/columns"
import { format } from "date-fns"
import { getPresentationsByCompanyIdAction } from "@/actions/presentation-actions"
import PresentationClient from "./_components/client"

type Params = Promise <{
    companyId: string
}>

const PresentationsPage = async ({params}:{params: Params}) => {
    const session = await auth()
    if(!session?.user?.email){
        console.log("No hay session")
        redirect("/login")
    }
    const userData = await getUsersWithAllCompanies(session.user.email)

    if(!userData){
        console.log("No existe usuario en DB")
        redirect("/login")
    }

    const {companyId} = await params;
    
    const validateOnwer = userData.createdCompanies.some((company)=>company.id === companyId)
    const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("VIEW_PRESENTATIONS"))
    const validateCreateCategory = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("CREATE_PRESENTATION"))
    const validateEditCategory = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("EDIT_PRESENTATION"))
    const validateDeleteCategory = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("DELETE_PRESENTATION"))

    const presentations = await getPresentationsByCompanyIdAction(companyId)
    const formattedPresentations : PresentationColumns[] = presentations.map(item => ({
        id: item.id,
        name: item.name,
        isAvailable: item.isAvailable,
        createdAt: item.createdAt ? format(item.createdAt,"MMMM do, yyyy") : "",
        updatedAt: item.updatedAt ? format(item.updatedAt,"MMMM do, yyyy") : ""
    }))

    if( validateOnwer || validatePermissions){
        console.log("si tiene permiso")
        
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
                <PresentationClient data={formattedPresentations} isCreate={validateCreateCategory} isEdit={validateEditCategory} isDelete={validateDeleteCategory} isOwner={validateOnwer} />
            </div>
        </div>
          
        )
      }else{
        console.log("no tiene permiso")
        redirect(`/alzu/${companyId}`)
      }
}

export default PresentationsPage
