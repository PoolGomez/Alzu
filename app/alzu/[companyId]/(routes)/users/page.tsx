import { getUsersByCompanyIdAction, getUsersWithAllCompanies } from "@/actions/user-actions";
import { auth } from "@/auth";
import { UserSearchModalProvider } from "@/providers/user-search-modal-provider";
import { CompanyUserRoleWithUser } from "@/types-db";
import { redirect } from "next/navigation";
import UsersForm from "./_components/users-form";

interface UsersPageProps {
    params : Promise<{
        companyId : string
    }>
}


const UsersPage = async({params}:UsersPageProps) => {

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
    
    const users = (await getUsersByCompanyIdAction(companyId)) as CompanyUserRoleWithUser[]


  return (
    <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
            <UserSearchModalProvider />
            <UsersForm users={users} />
        </div>
    </div>
  )
}

export default UsersPage
