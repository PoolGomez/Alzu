"use server"
import { db } from "@/lib/db";
import { Room } from "@prisma/client";
import { getUserWithAllCompaniesAndPermissions } from "./user-actions";
import { hasPermission } from "@/lib/has-permission";
import { auth } from "@/auth";

export const getRoomByIdAction = async (RoomId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const room = await db.room.findUnique({
      where: {
        id: RoomId,
      },
    });
    return room as Room;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error getRoomByIdAction"
    );
  }
};


export async function getRoomsByCompanyIdAction(companyId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const rooms = await db.room.findMany({
      where: {
        companyId,
      },
      select:{
        id:true,
        name:true,
        companyId:true,
        isAvailable:true,
        tables: true
      },
      orderBy:{
        name:"asc"
      }
    });
    return rooms
    
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error getRoomsByCompanyIdAction"
    );
  }
}

export const createRoomAction = async (
  name: string,
  companyId: string,
  isAvailable: boolean,
) => {
  try {
    const user = await getUserWithAllCompaniesAndPermissions();
    if (!hasPermission(user, companyId, "CREATE_ROOM")) {
      throw new Error("Este usuario no tiene el permiso");
    }
    await db.room.create({
      data: {
        name,
        companyId,
        isAvailable,
      },
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error createRoomAction"
    );
  }
};

export const updateRoomAction = async (
  roomId: string,
  name: string,
  companyId: string,
  isAvailable: boolean
) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const user = await getUserWithAllCompaniesAndPermissions()
    if (!hasPermission(user, companyId, "EDIT_ROOM")) {
        throw new Error("Este usuario no tiene el permiso");
    }

    await db.room.update({
        where: { 
          id : roomId,
        },
        data: { 
          name, 
          isAvailable,
        },
    });

  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updateRoomAction"
    );
  }
};

export const deleteRoomByIdAction = async (roomId: string, companyId: string) => {
  try {
    const user = await getUserWithAllCompaniesAndPermissions();

    if (!hasPermission(user, companyId, "DELETE_ROOM")) {
      throw new Error("Este usuario no tiene el permiso");
    }
    const existsTables = await db.table.count({
      where:{
        roomId
      }
    })
    if(existsTables > 0 ){
      throw new Error("No se puede eliminar porque hay mesas relacionadas a este piso");
    }
    await db.room.delete({
      where: { id: roomId },
    });

    
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleteRoomByIdAction"
    );
  }
}
