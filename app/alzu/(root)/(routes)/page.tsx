// "use client"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CardCompany from "./_components/card-company";
import CardNewCompany from "./_components/card-new-company";
import { UserWithAllCompanies } from "@/types-db";


const AlzuPage = async () => {

    const session = await auth()
    if(!session?.user?.email){
        redirect("/login")
    }
    const userData = (await db.user.findUnique({
      // select:{
      //   id: true
      // },
      omit:{
        password: true
      },
      where:{
        email: session.user.email
      },
      include:{
        companiesUserRoles: {
          include: {
            company:true
          }
        },
        createdCompanies: true
      }
    }) ) as UserWithAllCompanies

    if(!userData){
      redirect("/login")
    }

    console.log("userData: ", userData)

    // const myCompaniesData = await db.company.findMany({
    //     where:{
    //         ownerId: userData.id
    //     },
    //     orderBy:{
    //         createdAt:"desc"
    //     }
    // })
    // const sharedCompanyData = await db.companyUser.findMany({
    //         where:{
    //             userId : userData?.id //
    //         },
    //         include:{
    //             company: true
    //         },
    //         distinct: ['companyId'],
    //  });
    // const sharedCompanies= sharedCompanyData.map((item) => item.company);
    
    return (
        <div className="bg-white-foreground p-4">
        <h1 className="text-2xl font-normal m-6">Mis Empresas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CardNewCompany />

          {userData.createdCompanies.map((company) => (
            <CardCompany key={company.id} company={company} />
          ))}
        </div>
        <h1 className="text-2xl font-normal m-6">Empresas Compartidas Conmigo</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userData.companiesUserRoles.map((companyUserRol) => (
            <CardCompany key={companyUserRol.company.id} company={companyUserRol.company} />
          ))}

        </div>
      </div>
    )
}

export default AlzuPage
