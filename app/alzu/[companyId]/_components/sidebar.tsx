import { auth } from '@/auth';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar';
import { db } from '@/lib/db';
import { Company } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'
import { SideNav } from './sidenav';
import ShowOnlyScreen from '@/components/show-only-screen';


import { CompanySwitcher } from './company-switcher';
import { ToggleTheme } from '@/components/toggle-theme';
import UserButton from '@/components/user-button';

const SideBar = async({children}:{children: React.ReactNode}) => {

    const session = await auth();

    if(!session?.user?.email){
        redirect("/login")
    }

    const myCompaniesSnap = await db.company.findMany({
        where:{
            owner: session?.user?.email
        }
    });
    const myCompanies = [] as Company[];
    myCompaniesSnap.forEach(doc =>{
        myCompanies.push(doc)
    });

    const othersCompanySnap = await db.companyUser.findMany({
        where:{
            userId : session.user.email
        },
        include:{
            company: true
        }
    });
    const othersCompanies = othersCompanySnap.map((item) => item.company);

  return (
    <SidebarProvider>
        <Sidebar collapsible='icon' className='pt-12'>
            <SidebarContent>
                <SidebarGroup>
                    <ShowOnlyScreen screen='mobile'>
                        <CompanySwitcher myCompanies={myCompanies} sharedCompanies={othersCompanies} />
                    </ShowOnlyScreen>
                    <SidebarGroupLabel>Modules</SidebarGroupLabel>
                    <SideNav />
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
        <SidebarInset>
            <header className="fixed top-0 left-0 w-full z-50 flex h-12 shrink-0 items-center justify-between gap-2 pr-2 gap-x-4 md:pr-6 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="p-2" />
                    <Separator orientation="vertical" className="mr-2 h-8" />
                    <ShowOnlyScreen screen='desktop'>
                        <CompanySwitcher myCompanies={myCompanies} sharedCompanies={othersCompanies} />
                    </ShowOnlyScreen>
                    
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

export default SideBar
