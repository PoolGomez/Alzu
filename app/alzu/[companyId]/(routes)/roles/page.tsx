import { redirect } from "next/navigation";
// import RolesForm from "./_components/roles-form"
import { auth } from "@/auth";
import { getCompanyRoleByCompanyIdAction } from "@/actions/company-role-action";
import { CompanyRole } from "@prisma/client";
import RoleClient from "./_components/client";
import { format } from "date-fns"
import { RoleColumns } from "./_components/columns";
import { getUsersWithAllCompanies } from "@/actions/user-actions";

interface RolesPageProps {
  params : Promise<{
      companyId : string
  }>
}

const RolesPage = async ({params}:RolesPageProps) => {

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


  const roles = (await getCompanyRoleByCompanyIdAction(companyId)) as CompanyRole[]

  const formattedRoles :  RoleColumns[] = roles.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    permissions: item.permissions,
    // ...formattedRoles,
    createdAt: item.createdAt ? format(item.createdAt,"dd-MM-yyyy") : "",
    updatedAt: item.updatedAt ? format(item.updatedAt,"dd-MM-yyyy, hh:mm:ss") : "",
    
  }))

  

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 pt-4">
            <RoleClient data={formattedRoles} />
        </div>
    </div>
  )
}

export default RolesPage
