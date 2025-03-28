import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CategoryForm } from "./_components/category-form"
import { getCategoryByIdAction } from "@/actions/category-actions"
import { Category } from "@prisma/client"

type Params = Promise <{
    companyId: string,
    categoryId: string
}>

const CategoryPage = async ({params}:{params: Params}) => {
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
        const {companyId, categoryId} = await params;
        const validateOnwer = userData.createdCompanies.some((company)=>company.id === companyId)
        const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("EDIT_CATEGORY"))

        const category = (await getCategoryByIdAction(categoryId)) as Category
        // console.log("category: ", category)
      
        if( validateOnwer || validatePermissions){
            console.log("si tiene permiso")
            return (
              <div className="flex-col">
                <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
                  <CategoryForm initialData={category} />
                </div>
            </div>
              
            )
          }else{
            console.log("no tiene permiso")
            redirect(`/alzu/${companyId}/categories`)
          }
  }
  
  export default CategoryPage