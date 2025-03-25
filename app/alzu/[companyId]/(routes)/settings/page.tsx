// import { getCompanyById } from "@/actions/company-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/settings-form";
// import { Company } from "@prisma/client";
import { UserSearchModalProvider } from "@/providers/user-search-modal-provider";
import { getUsersByCompanyIdAction, getUsersWithAllCompanies } from "@/actions/user-actions";
import { CompanyUserRoleWithUser } from "@/types-db";


interface SettingPageProps {
    params : Promise<{
        companyId : string
    }>
}

const SettingPage = async ({params}:SettingPageProps) => {
    const {companyId} = await params;
    const session = await auth()
    if(!session?.user?.email){
        redirect("/login")
    }

    const userData =  await getUsersWithAllCompanies(session.user.email)
    if(!userData){
        redirect("/login")
    }

    //const company = (await getCompanyById(companyId)) as Company
    const company = userData.createdCompanies.find((company)=> company.id === companyId)

    // if(company.ownerId !== userData.id){
    //     redirect(`/alzu/${company.id}`)
    // }
    if(!company){
        redirect(`/alzu/${companyId}`)
    }
    
    const users = (await getUsersByCompanyIdAction(companyId)) as CompanyUserRoleWithUser[]


  return (
    <div className="flex-col">
        <div className="flex-1 space-y-5 p-8 pt-6">
            <UserSearchModalProvider />
            <SettingsForm initialData={company} users={users} />
        </div>
    </div>
  )
}

export default SettingPage
