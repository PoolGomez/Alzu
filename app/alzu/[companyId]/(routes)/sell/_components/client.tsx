'use client'
import { useOrder } from '@/lib/providers';
import { useState } from 'react'
import RoomSelector from './room-selector';
import TableSelector from './table-selector';
import CategorySelector from './category-selector';
import ProductSelector from './product-selector';

const SellClient = ({companyId}:{companyId: string}) => {

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const { selectedRoom, selectedTable, selectedCategory } = useOrder();
    
  return (
    <div className="flex-1 space-y-5 p-4 pt-4">
    {!selectedRoom ? (
        <RoomSelector companyId={companyId}/>
      ) 
       : !selectedTable ? (
         <TableSelector />
       ) : !selectedCategory ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategorySelector companyId={companyId} />
          
          {/* <div className="lg:col-span-2 space-y-6">
            <CategorySelector 
              onSelectCategory={setSelectedCategoryId}
              selectedCategoryId={selectedCategoryId}
            />
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Products</h2>
              <ProductGrid categoryId={selectedCategoryId} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary />
          </div> */}
        </div>
       ) :(
        <ProductSelector categoryId={selectedCategory.id} />
        // <div>
        //     <h1>Room: {JSON.stringify(selectedRoom)}</h1>
        //   <h1>Table: {JSON.stringify(selectedTable)}</h1>
        //   <h1>Category: {JSON.stringify(selectedCategory)}</h1>
        // </div>
       )
      }
    </div>
  )
}

export default SellClient
