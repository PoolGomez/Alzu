import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CreateCategoryForm } from "./_components/create-category-form"

type Params = Promise <{
    companyId: string
}>

const CreateCategoryPage = async ({params}:{params: Params}) => {
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
    const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("CREATE_CATEGORY"))
  
    if( validateOnwer || validatePermissions){
        console.log("si tiene permiso")
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-5 p-4 pt-4">
              <CreateCategoryForm />
            </div>
        </div>
          
        )
      }else{
        console.log("no tiene permiso")
        redirect(`/alzu/${companyId}/categories`)
      }
}

export default CreateCategoryPage
