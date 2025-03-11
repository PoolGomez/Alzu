import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SideBar from "./_components/sidebar";

interface DashboardLayout{
    children : React.ReactNode,
    // params :Promise<{ storeId : string }>
}

const DashboardLayout = async ({children}: DashboardLayout) => {

    console.log("DashboardLayout")

    const session = await auth();
    if(!session){
        redirect("/login")
    }



  return (
    <>
    <SideBar>
        {children}
    </SideBar>
    
    </>
  )
}

export default DashboardLayout
