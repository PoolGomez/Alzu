import { auth } from "@/auth";
import  SellClient from "./_components/client";
import { redirect } from "next/navigation";
import { getUsersWithAllCompanies } from "@/actions/user-actions";


type Params = Promise<{
  companyId: string;
}>;

const SellPage = async ({ params }: { params: Params }) => {

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

  const { companyId } = await params;
  const validateOnwer = userData.createdCompanies.some((company)=>company.id === companyId)
  const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("SELL"))

  if(validateOnwer || validatePermissions){

    return (
      <div className="flex-col">
        <SellClient companyId={companyId} />
      </div>
    )

  }else{
    console.log("no tiene permiso")
    redirect(`/alzu/${companyId}?message=Sus permisos para esta opción no existen o han sido actualizados`)
  }


  
}

export default SellPage
