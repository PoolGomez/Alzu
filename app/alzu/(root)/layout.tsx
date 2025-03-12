import { auth } from "@/auth"
import { Separator } from "@/components/ui/separator"
// import { db } from "@/lib/db"
// import { Company } from "@prisma/client"
import { redirect } from "next/navigation"


import { ToggleTheme } from "@/components/toggle-theme"
import UserButton from "@/components/user-button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface LayoutAlzuProp {
    children: React.ReactNode
}

const LayoutAlzu = async ({children}:LayoutAlzuProp) => {

  console.log("LayoutAlzu")

  const session = await auth()
  if(!session?.user?.email){
    redirect("/login")
  }
  // obtener stores por el usuario(email)
  // const companySnap = await db.company.findMany({
  //   where:{
  //     owner: session?.user?.email
  //   },
  //   orderBy:{
  //     createdAt:"desc"
  //   }
  // })
  // let company : Company | undefined;

  //obtener la primera empresa el usuario
  // if(companySnap.length > 0){
  //   company = companySnap[0] as Company
  //   redirect(`/alzu/${company.id}`)
  // }
  // return (
  //   <div>
  //   {children}
  //   </div>
  // )

  return (
    
    <SidebarProvider>
      <SidebarInset>
            <header className="fixed top-0 left-0 w-full z-50 flex h-12 shrink-0 items-center justify-between gap-2 pr-2 gap-x-4 md:pr-6 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background">
                <div className="flex items-center gap-2 px-4">
                    {/* <SidebarTrigger className="p-2" /> */}
                    ALZU
                    <Separator orientation="vertical" className="mr-2 h-8" />
                    {/* <ShowOnlyScreen screen='desktop'>
                        <CompanySwitcher myCompanies={myCompanies} sharedCompanies={othersCompanies} />
                    </ShowOnlyScreen> */}
                    
                </div>
                <div className="flex gap-x-2 items-center">
                    <ToggleTheme />
                    {/* {session.user.email} */}
                    <UserButton username={session.user.email} />
                </div>
            </header>
            <main className='pt-12'>
                {children}
            </main>
      </SidebarInset>
    </SidebarProvider>
    
    
  )
}

export default LayoutAlzu
