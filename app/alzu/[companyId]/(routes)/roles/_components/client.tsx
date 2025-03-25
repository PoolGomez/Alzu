"use client"
import { Heading } from '@/app/alzu/_components/heading'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Separator } from '@/components/ui/separator'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { columns, RoleColumns } from './columns'
import { useIsMobile } from '@/hooks/use-mobile'
import { columns_mobile } from './columns-mobile'

interface RoleClientProps{
    data: RoleColumns[]
}

const RoleClient = ({data}: RoleClientProps) => {
    const params = useParams()
    const router = useRouter()
    const isMobile = useIsMobile()
  return (
    <>
      <div className="flex items-center justify-between">
            <Heading 
                title={`Roles (${data.length})`} 
                description="Gestionar roles para tu empresa"
            />
            <Button onClick={()=>router.push(`/alzu/${params.companyId}/roles/create`)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Rol
            </Button>
        </div>
        <Separator />
        {
            !isMobile ? (
                <DataTable searchKey="name" columns={columns} data={data}/>
            ):(
                <DataTable searchKey="name" columns={columns_mobile} data={data}/>
            )
        }
        
    </>
  )
}

export default RoleClient
