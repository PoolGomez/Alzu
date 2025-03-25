import { getUsersWithAllCompanies } from "@/actions/user-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface CreateRolePageProps {
  params : Promise<{
      companyId : string
  }>
}

const CreateRolePage = async ({params}:CreateRolePageProps) => {

  const {companyId} = await params;
    const session = await auth()
    if(!session?.user?.email){
        redirect("/login")
    }
  
    const userData =  await getUsersWithAllCompanies(session.user.email)
    if(!userData){
        redirect("/login")
    }
    const company = userData.createdCompanies.find((company)=> company.id === companyId)
    if(!company){
      redirect(`/alzu/${companyId}`)
    }

  return (
    <div>
      CreateRolePage
    </div>
  )
}

export default CreateRolePage
