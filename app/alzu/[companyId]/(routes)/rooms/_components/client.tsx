"use client"

import { useParams, useRouter } from "next/navigation";
import { RoomColumns } from "./columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heading } from "@/app/alzu/_components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RoomTable from "./table-room";

interface RoomClientProps {
  data: RoomColumns[];
  isCreate: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isOwner: boolean;
}

const RoomClient = ({data, isCreate, isEdit, isDelete, isOwner}:RoomClientProps) => {
    const params = useParams()
    const router = useRouter()
    const isMobile = useIsMobile();
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading 
                title={`Salas (${data.length})`} 
                description="Gestionar salas para tu empresa"
            />
            {
                (isCreate || isOwner) && (
                    <Button onClick={()=>router.push(`/alzu/${params.companyId}/rooms/create`)} className='cursor-pointer'>
                        <Plus className="h-4 w-4" />
                        {!isMobile && "Crear Sala"}
                    </Button>
                )
            }

        </div>
        <Separator />
        <RoomTable
            isOwner={isOwner}
            isEdit={isEdit}
            isDelete={isDelete}
            data={data}
        />
        </>
    )
}
export default RoomClient