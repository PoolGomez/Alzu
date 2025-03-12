// "use client"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CardCompany from "./_components/card-company";
import CardNewCompany from "./_components/card-new-company";
// import { Card, CardContent } from "@/components/ui/card";

// import { useCompanyModal } from '@/hooks/use-company-modal'
// import { useEffect } from 'react'

// const projects = [
//     { name: "AppINA", id: "appina-58e21" },
//     { name: "membresia", id: "membresia-956d2" },
//     { name: "ProyectoPruebaTest", id: "gameprueba-5d147" },
//     { name: "foo-app-multi-store", id: "foo-app-multi-store" },
//     { name: "chat-socket-next15", id: "chat-socket-next15" },
//     { name: "alzu-web", id: "alzu-web-90386" },
//     { name: "app-adming-pg-2-test-nombre-d", id: "app-adming-pg-2" },
//     { name: "AppPizzeria", id: "apppizzeria-68fee" },
//   ];


const AlzuPage = async () => {
    // const onOpen = useCompanyModal((state) => state.onOpen)
    // const isOpen = useCompanyModal((state) => state.isOpen)
    // useEffect(()=>{
    //     if(!isOpen){
    //         onOpen();
    //     }
    // },[isOpen, onOpen])
    // return null


    const session = await auth()
    if(!session?.user?.email){
        redirect("/login")
    }
    

    const myCompaniesData = await db.company.findMany({
        where:{
            owner: session?.user?.email
        },
        orderBy:{
            createdAt:"desc"
        }
    })
    const sharedCompanyData = await db.companyUser.findMany({
            where:{
                userId : session.user.email
            },
            include:{
                company: true
            }
     });
    const sharedCompanies = sharedCompanyData.map((item) => item.company);


    
    return (
        <div className="bg-white-foreground p-4">
        <h1 className="text-2xl font-normal m-6">Mis Empresas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CardNewCompany />
          {/* <Card className="border border-yellow-500 p-6 flex flex-col items-center justify-center cursor-pointer h-40" onClick={handleClickNewCompany}>
            <Plus size={40} className="text-yellow-500" />
            <p className="mt-2 text-lg">Crear una empresa</p>
          </Card> */}
          {myCompaniesData.map((company) => (
            <CardCompany key={company.id} company={company} />
          ))}
        </div>
        <h1 className="text-2xl font-normal m-6">Empresas Compartidas Conmigo</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sharedCompanies.map((company) => (
            <CardCompany key={company.id} company={company} />
          ))}

          {/* {projects.map((project)=>(
            <Card key={project.id} className="p-4 bg-white-foreground h-40 flex flex-col justify-center cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <h2 className="text-lg font-semibold">{project.name}</h2>
            </CardContent>
          </Card>
          ))} */}
        </div>
      </div>
    )
}

export default AlzuPage
