import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CreateRoomForm } from "./_components/create-room-form"

type Params = Promise <{
    companyId: string
}>

  
const CreateRoomPage = async ({params}:{params: Params}) => {
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
  const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("CREATE_ROOM"))


  if( validateOnwer || validatePermissions){
    console.log("si tiene permiso")
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
          <CreateRoomForm />
        </div>
    </div>
      
    )
  }else{
    console.log("no tiene permiso")
    redirect(`/alzu/${companyId}/rooms`)
  }
}
export default CreateRoomPage