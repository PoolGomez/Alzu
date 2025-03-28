// import { getCompanyById } from "@/actions/company-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/settings-form";
// import { Company } from "@prisma/client";
import { UserSearchModalProvider } from "@/providers/user-search-modal-provider";
import { getUsersWithAllCompanies } from "@/actions/user-actions";


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
    


  return (
    <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
            <UserSearchModalProvider />
            <SettingsForm initialData={company} />
        </div>
    </div>
  )
}

export default SettingPage
