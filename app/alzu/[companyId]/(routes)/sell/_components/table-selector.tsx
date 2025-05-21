'use client';

import { useState, useEffect } from 'react';
// import { Table } from '@/lib/types';
import { useOrder } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Ban, CheckCircle, ChevronLeft, UtensilsCrossed } from 'lucide-react';
import toast from "react-hot-toast";
import { Table, TableStatus } from '@prisma/client';
import { getTablesByRoomIdAction } from '@/actions/table-actions';

export default function TableSelector() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedRoom, selectedTable, selectRoom, selectTable } = useOrder();
  

  useEffect(() => {
    if (!selectedRoom?.id) return;

    const fetchTables = async () => {
      try {
        setLoading(true);
        // const response = await fetch(`/api/tables?roomId=${selectedRoom.id}`);
        const response = await getTablesByRoomIdAction(selectedRoom.id)
        // if (!response.ok) {
        //   throw new Error('Failed to fetch tables');
        // }
        // const data = await response.json();
        setTables(response);
      } catch (error) {
        console.error('Error fetching tables:', error);
        toast.error('Failed to load tables. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [selectedRoom]);

  if (!selectedRoom) return null;

  const handleBackClick = () => {
    selectRoom(null);
  };

  const handleSelectTable = (table: Table) => {
    if (table.status === TableStatus.AVAILABLE || table.status === TableStatus.OCCUPIED) {
      selectTable(table);
    } 
    // else {
    //   toast.error('This table is currently reserved and cannot be selected.');
    // }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">{selectedRoom.name} - Seleccione Mesa</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <Card
              key={table.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTable?.id === table.id 
                  ? 'ring-2 ring-primary' 
                  : table.status === TableStatus.AVAILABLE 
                    ? 'hover:border-green-500/50' 
                    : table.status === TableStatus.OCCUPIED 
                      ? 'hover:border-orange-500/50' 
                      : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => handleSelectTable(table)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                {
                  table.status === TableStatus.AVAILABLE ? (
                    <CheckCircle className="h-8 w-8 mb-2 text-green-500"/>    
                  ) : table.status === TableStatus.OCCUPIED ? (
                    <UtensilsCrossed className="h-8 w-8 mb-2 text-orange-500"/>    
                  ) : (
                    <Ban className="h-8 w-8 mb-2 text-orange-500"/> 
                  )

                }
                {/* <CheckCircle 
                  className={`h-8 w-8 mb-2 ${
                    table.status === TableStatus.AVAILABLE 
                      ? 'text-green-500' 
                      : table.status === TableStatus.OCCUPIED
                        ? 'text-orange-500' 
                        : 'text-gray-400'
                  }`} 
                /> */}
                <p className="font-semibold text-lg">{table.name}</p>
                <span className={`text-xs capitalize mt-1 px-2 py-0.5 rounded-full ${
                  table.status === TableStatus.AVAILABLE 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : table.status === TableStatus.OCCUPIED 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {table.status === TableStatus.AVAILABLE ? 'DISPONIBLE' : 
                    table.status === TableStatus.OCCUPIED ? 'OCUPADO' : 'DESACTIVADO' }
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}