import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CreateProductForm } from "./_components/create-product-form"
import { getAllCategoriesByCompanyIdAction } from "@/actions/category-actions"

type Params = Promise <{
  companyId: string
}>

const CreateProductPage = async ({params}:{params: Params}) => {
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
  const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("CREATE_PRODUCT"))


  if( validateOnwer || validatePermissions){
    console.log("si tiene permiso")
    const categories = await getAllCategoriesByCompanyIdAction(companyId)
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
          <CreateProductForm categories={categories} />
        </div>
    </div>
      
    )
  }else{
    console.log("no tiene permiso")
    redirect(`/alzu/${companyId}/products`)
  }

}

export default CreateProductPage
