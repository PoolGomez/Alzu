import { getUsersWithAllCompanies } from "@/actions/user-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateRoleForm from "./_components/create-role-form";

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
    <div className="flex-col">
      <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
        <CreateRoleForm />
      </div>
    </div>
  )
}

export default CreateRolePage
