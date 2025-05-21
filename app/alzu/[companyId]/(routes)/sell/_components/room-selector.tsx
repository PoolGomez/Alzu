'use client';

import { useState, useEffect } from 'react';
// import { Room } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import toast from "react-hot-toast";
import { getRoomsByCompanyIdAction } from '@/actions/room-actions';
import { RoomColumns } from './columns';
import { useOrder } from '@/lib/providers';
import { Room, TableStatus } from '@prisma/client';


export default function RoomSelector({companyId}:{companyId:string}) {
  const [rooms, setRooms] = useState<RoomColumns[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedRoom, selectRoom } = useOrder();
  // const [ selectedRoom, setSelectedRoom ] = useState<RoomColumns>();
  

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // const response = await getRoomsByCompanyIdAction("cm8q9d6060004wtcwg91gu9zx");
        const response = await getRoomsByCompanyIdAction(companyId);
        setRooms(response);
        // if(response){
        //     setRooms(response);
        // }
        
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to load rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [
    // toast
  ]);

  const handleSelectRoom = (room: RoomColumns) => {
    const room_sel = {
      id: room.id,
      name: room.name,
      companyId: room.companyId,
      isAvailable: room.isAvailable,
      // tables: room.tables,
      // createdAt: "",
      // updatedAt: ""
    }  as Room;
    selectRoom(room_sel);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Seleccione Sala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      <div className='flex flex-col '>
        <h2 className="text-2xl font-bold">Seleccione Sala</h2>
        <div className='flex justify-start items-center'>
          <span className='m-2 w-3 h-3 rounded-full shadow bg-green-500'/> <span className='text-sm'>Disponible</span>
          <span className='m-2 w-3 h-3 rounded-full shadow bg-yellow-500' /> <span className='text-sm'>Ocupado</span>
          <span className='m-2 w-3 h-3 rounded-full shadow bg-red-500' />  <span className='text-sm'>No disponible</span>
        </div>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          // const availableTables = room.tables.filter(table => table.isAvailable === true).length;
          const availableTables = room.tables.filter(table => table.status === TableStatus.AVAILABLE).length;
          const occupiedTables = room.tables.filter(table => table.status === TableStatus.OCCUPIED).length;
          const disabledTables = room.tables.filter(table => table.status === TableStatus.DISABLED).length;
          const totalTables = room.tables.length;
          
          return (
            <Card 
              key={room.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRoom?.id === room.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelectRoom(room)}
            >
              <CardHeader className="pb-2">
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>
                  {totalTables} {totalTables === 1 ? 'mesa' : 'mesas'} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant={availableTables > 0 ? "outline" : "secondary"}>
                    {availableTables} 
                    {/* disponible */}
                    <span className='ml-2 w-3 h-3 rounded-full shadow bg-green-500' />
                    
                  </Badge>
                  <Badge variant={availableTables === 0 ? "destructive" : "outline"} className="opacity-80">
                    {occupiedTables} 
                    {/* ocupadas */}
                    <span className='ml-2 w-3 h-3 rounded-full shadow bg-yellow-500' />
                  </Badge>
                  <Badge variant={availableTables === 0 ? "destructive" : "outline"} className="opacity-80">
                    {disabledTables} 
                    {/* desahabilitadas */}
                    <span className='ml-2 w-3 h-3 rounded-full shadow bg-red-500' />
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}