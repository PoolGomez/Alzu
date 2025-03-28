"use client"
import { Heading } from "@/app/alzu/_components/heading"
import { Button } from "@/components/ui/button"
import { useUserSearchModal } from "@/hooks/use-user-search-modal"
import { CompanyUserRoleWithUser } from "@/types-db"
import { Plus } from "lucide-react"
import { useParams } from "next/navigation"
import TableUsers from "../../settings/_components/table-users"

interface UsersFormProps {
    users: CompanyUserRoleWithUser[],
}

const UsersForm = ({users}: UsersFormProps) => {

    const params = useParams()
    const userSearchModal = useUserSearchModal()

  return (
    <>
    <div className="flex items-center justify-center">
        <Heading title="Usuarios" description="Configura los usuarios" />
        <Button onClick={()=>{
            userSearchModal.onOpen()
            }} >
            <Plus/>Nuevo Usuario
        </Button>
    </div>
    
    <TableUsers users={users} companyId={params.companyId as string}/>

    </>
  )
}

export default UsersForm