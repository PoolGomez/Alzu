"use client"
import { Heading } from '@/app/alzu/_components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { ProductColumns } from './columns'
import { useIsMobile } from '@/hooks/use-mobile'
import ProductTable from './table-product'

interface ProductClientProps {
  data: ProductColumns[];
  isCreate: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isOwner: boolean;
}

const ProductClient = ({data, isCreate, isEdit, isDelete, isOwner}:ProductClientProps) => {
    const params = useParams()
    const router = useRouter()
    const isMobile = useIsMobile();

  return (
    <>
      <div className="flex items-center justify-between">
            <Heading 
                title={`Products (${data.length})`} 
                description="Gestionar productos para tu empresa"
            />
            {
                (isCreate || isOwner) && (
                    <Button onClick={()=>router.push(`/alzu/${params.companyId}/products/create`)} className='cursor-pointer'>
                        <Plus className="h-4 w-4" />
                        {!isMobile && "Crear Producto"}
                    </Button>
                )
            }

        </div>
        <Separator />
        <ProductTable 
            isOwner={isOwner}
            isEdit={isEdit}
            isDelete={isDelete}
            data={data}
        />
        
    </>
  )
}

export default ProductClient
