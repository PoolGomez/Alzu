import { getProductByIdAction } from "@/actions/product-actions"
import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { Product } from "@prisma/client"
import { redirect } from "next/navigation"
import { ProductForm } from "./_components/product-form"
import { getAllCategoriesByCompanyIdAction } from "@/actions/category-actions"

type Params = Promise <{
  companyId: string,
  productId: string
}>

const ProductPage = async ({params}:{params: Params}) => {
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
          const {companyId, productId} = await params;
          const validateOnwer = userData.createdCompanies.some((company)=>company.id === companyId)
          const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("EDIT_PRODUCT"))
  
          const product = (await getProductByIdAction(productId)) as Product
        
          if( validateOnwer || validatePermissions){
              console.log("si tiene permiso")
              const categories = await getAllCategoriesByCompanyIdAction(companyId)
              return (
                <div className="flex-col">
                    <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
                      <ProductForm initialData={product} categories={categories} />
                    </div>
                </div>

                // <div className="flex-col">
                //     <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
                //       <ProductForm initialData={product} categories={categories} />
                //     </div>
                // </div>
                
              )
            }else{
              console.log("no tiene permiso")
              redirect(`/alzu/${companyId}/products`)
            }
}

export default ProductPage
