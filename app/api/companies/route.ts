import { auth } from "@/auth";
import { db } from "@/lib/db";
// import { PermissionAction } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async ( req : Request ) => {
    try {
        const session = await auth()
        const body = await req.json()

        if(!session?.user?.email){
            return new NextResponse("No autorizado",{status:400})
        }

        const {name} = body;

        if(!name){
            return new NextResponse("Falta el nombre de la empresa!",{status: 400})
        }

        const userData = await db.user.findFirst({
            where:{
                email: session?.user?.email
            }
        })

        if(!userData){
            return new NextResponse("No hay datos del usuario!",{status: 400})
        }

        const companyData = {
            name,
            ownerId: userData.id,
        }

        // const storeRef = await addDoc(collection(db, "stores"), storeData);
        const companyRef = await db.company.create({
            data: companyData
        });
        const id = companyRef.id;

         //crea un role basico
         await db.companyRole.create({
            data:{
                name: "Invitado",
                companyId: id,
                description:"Role default",
                permissions: []
            }
        })

        // await updateDoc(doc(db, "stores", id),{
        //     ...storeData,
        //     id,
        //     updateAt: serverTimestamp()
        // })

        console.log("companyData: ", companyData)
        console.log("companyRef: ", companyRef)
        return NextResponse.json({id, ...companyData});

    } catch (error) {
        console.log(`COMPANY_POST:${error}`)
        return new NextResponse("Internal Server Error", { status : 500 })
    }
}