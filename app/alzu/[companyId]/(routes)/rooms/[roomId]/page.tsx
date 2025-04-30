import { getUsersWithAllCompanies } from "@/actions/user-actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Room } from "@prisma/client"
import { getRoomByIdAction } from "@/actions/room-actions"
import { RoomForm } from "./_components/room-form"

type Params = Promise <{
    companyId: string,
    roomId: string
}>

const RoomPage = async ({params}:{params: Params}) => {
    const session = await auth()
        if(!session?.user?.email){
            console.log("No hay session")
            redirect("/login")
        }
        const userData = await getUsersWithAllCompanies(session.user.email)
        if(!userData){
            console.log("No existe usuario en DB")
            redirect("/login")
        }
        const {companyId, roomId} = await params;
        const validateOnwer = userData.createdCompanies.some((company)=>company.id === companyId)
        const validatePermissions = userData.companiesUserRoles.some((item)=>item.role.permissions.includes("EDIT_CATEGORY"))

        const room = (await getRoomByIdAction(roomId)) as Room
        // console.log("category: ", category)
      
        if( validateOnwer || validatePermissions){
            console.log("si tiene permiso")
            return (
              <div className="flex-col">
                <div className="flex-1 space-y-5 p-4 md:p-8 pt-4 md:pt-6">
                  {/* <CategoryForm initialData={category} /> */}
                  <RoomForm initialData={room} />
                  
                </div>
            </div>
              
            )
          }else{
            console.log("no tiene permiso")
            redirect(`/alzu/${companyId}/categories`)
          }
  }
  
  export default RoomPage