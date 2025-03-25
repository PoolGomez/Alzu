"use client"
import { Heading } from '@/app/alzu/_components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const ProductClient = ({isCreate}:{isCreate: boolean}) => {
    const params = useParams()
    const router = useRouter()
  return (
    <>
      <div className="flex items-center justify-between">
            <Heading 
                // title={`Roles (${data.length})`} 
                title={`Products`} 
                description="Gestionar roles para tu empresa"
            />
            {
                isCreate && (
                    <Button onClick={()=>router.push(`/alzu/${params.companyId}/products/create`)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Producto
                    </Button>
                )
            }
            {/* <Button onClick={()=>router.push(`/alzu/${params.companyId}/products/create`)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
            </Button> */}
        </div>
        <Separator />
        {/* {
            !isMobile ? (
                <DataTable searchKey="name" columns={columns} data={data}/>
            ):(
                <DataTable searchKey="name" columns={columns_mobile} data={data}/>
            )
        } */}
        
    </>
  )
}

export default ProductClient
