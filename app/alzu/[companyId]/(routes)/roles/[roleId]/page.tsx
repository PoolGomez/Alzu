
import { redirect } from 'next/navigation'
import RoleForm from './_components/role-form'
import { auth } from '@/auth'
import { getUsersWithAllCompanies } from '@/actions/user-actions'
import { getCompanyRolById } from '@/actions/company-role-action'

interface RolePageProps {
    params : Promise<{
        companyId: string,
        roleId : string
    }>
}

const RolePage = async ({params}:RolePageProps) => {
    const {companyId, roleId} = await params
    const session = await auth()
    if(!session?.user?.email){
        redirect("/login")
    }
    //validacion si el usuario es dueño de la empresa
    const userData =  await getUsersWithAllCompanies(session.user.email)
    if(!userData){
        redirect("/login")
    }
    const company = userData.createdCompanies.find((company)=> company.id === companyId)
    if(!company){
      redirect(`/alzu/${companyId}`)
    }
    //obtener data del Rol
    const roleData = await getCompanyRolById(roleId)
    if(!roleData){
      redirect(`/alzu/${companyId}`)
    }



  return (
  <div className="flex-col">
    <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
     <RoleForm initialData={roleData} />
    </div>
  </div>

  )
}

export default RolePage
