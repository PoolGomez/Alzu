import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import CategoryClient from "./_components/client"
import { getCategoriesByCompanyIdAction } from "@/actions/category-actions"
import { CategoryColumns } from "./_components/columns"
import { format } from "date-fns"
// import { Category } from "@prisma/client"

type Params = Promise <{
    companyId: string
  }>

const CategoriesPage = async ({params}:{params: Params}) => {
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
    const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("VIEW_CATEGORIES"))
    const validateCreateCategory = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("CREATE_CATEGORY"))
    const validateEditCategory = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("EDIT_CATEGORY"))
    const validateDeleteCategory = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("DELETE_CATEGORY"))

    const categories = await getCategoriesByCompanyIdAction(companyId)
    const formattedCategories : CategoryColumns[] = categories.map(item => ({
        id: item.id,
        name: item.name,
        description: item?.description || null,
        createdAt: item.createdAt ? format(item.createdAt,"MMMM do, yyyy") : "",
        updatedAt: item.updatedAt ? format(item.updatedAt,"MMMM do, yyyy") : ""
    }))

    if( validateOnwer || validatePermissions){
        console.log("si tiene permiso")
        
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
                <CategoryClient data={formattedCategories} isCreate={validateCreateCategory} isEdit={validateEditCategory} isDelete={validateDeleteCategory} isOwner={validateOnwer} />
            </div>
        </div>
          
        )
      }else{
        console.log("no tiene permiso")
        redirect(`/alzu/${companyId}`)
      }
}

export default CategoriesPage
