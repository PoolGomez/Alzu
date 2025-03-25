import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ProductClient from "./_components/client"
type Params = Promise <{
  companyId: string
}>
const ProductsPage = async({params}:{params: Params}) => {
  
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

  // const currentCompany = await db.company.findUnique({
  //   where:{
  //     id: companyId
  //   }
  // })
  // if(!currentCompany){
  //   console.log("No existe company en DB")
  //   redirect("/login")
  // }
  // const userPermissions = (await getPermissionCompanyUser(userData.id, companyId)) as CompanyUserWithRolePermissions

console.log("userData ProductsPage: ", userData)
const validateOnwer = userData.createdCompanies.some((company)=>company.id === companyId)
const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("VIEW_PRODUCTS"))
const validateCreate = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("CREATE_PRODUCT"))

  if( validateOnwer || validatePermissions){
    console.log("si tiene permiso")
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 pt-4">
            <ProductClient 
            isCreate={validateCreate}
            // data={formattedRoles} 
            />
        </div>
    </div>
      
    )
  }else{
    console.log("no tiene permiso")
    redirect(`/alzu/${companyId}`)
  }


  
}

export default ProductsPage
