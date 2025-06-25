'use client'
import { useOrder } from '@/lib/providers';
// import { useState } from 'react'
import RoomSelector from './room-selector';
import TableSelector from './table-selector';
// import CategorySelector from './category-selector';
import ProductSelector from './product-selector';

const SellClient = ({companyId}:{companyId: string}) => {

    // const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const { selectedRoom, selectedTable } = useOrder();
    
  return (
    <div className="flex-1 space-y-5 p-4 pt-4">
    {!selectedRoom ? (
        <RoomSelector companyId={companyId}/>
      ) 
       : !selectedTable ? (
         <TableSelector />
       ) :(
        <ProductSelector companyId={companyId}/>
       
       )
      }
    </div>
  )
}

export default SellClient
