import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

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
      
        if( validateOnwer || validatePermissions){
            console.log("si tiene permiso")
            return (
              <div className="flex-col">
                <div className="flex-1 space-y-5 p-4 pt-4">
                  <p>Update Category</p>
                  <p>categoryId: {categoryId}</p>
                    {/* <ProductClient 
                     data={formattedRoles} 
                    /> */}
                </div>
            </div>
              
            )
          }else{
            console.log("no tiene permiso")
            redirect(`/alzu/${companyId}/categories`)
          }
  }
  
  export default CategoryPage