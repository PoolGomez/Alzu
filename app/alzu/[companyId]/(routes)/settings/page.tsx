import { getCompanyById } from "@/actions/company-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface SettingPageProps {
    params : Promise<{
        companyId : string
    }>
}

const SettingPage = async ({params}:SettingPageProps) => {
    const {companyId} = await params;
    const session = await auth()
    if(!session){
        redirect("/login")
    }
    const company = await getCompanyById(companyId)
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-5 p-8 pt-6">
            {JSON.stringify( company)}
            {/* <SettingsForm initialData={company} /> */}
        </div>
    </div>
  )
}

export default SettingPage
