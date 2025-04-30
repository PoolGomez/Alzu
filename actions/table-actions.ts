"use server"
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserWithAllCompaniesAndPermissions } from "./user-actions";
import { hasPermission } from "@/lib/has-permission";
import { TableStatus } from "@prisma/client";

export async function getTablesByCompanyIdAction(companyId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const tables = await db.table.findMany({
      where: {
        companyId,
      },
    //   select:{
    //     id:true,
    //     name:true,
    //     companyId:true,
    //     isAvailable:true
    //   }
    });
    return tables
    
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error getTablesByCompanyIdAction"
    );
  }
}

export async function getTablesByRoomIdAction(roomId: string) {
    try {
      const session = await auth();
      if (!session?.user?.email) {
        throw new Error("No existe una sesión");
      }
      const existsRoom = await db.room.findUnique({
        where: { id: roomId}
      })
      if(!existsRoom){
        throw new Error("Room Id no válido");
      }
      console.log("existsRoom: ", existsRoom)
      const tables = await db.table.findMany({
        where: {
          roomId,
        },
        orderBy:{
          name: "asc"
        }
      //   select:{
      //     id:true,
      //     name:true,
      //     companyId:true,
      //     isAvailable:true
      //   }
      });
      return tables
      
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error getTablesByRoomIdAction"
      );
    }
  }

export const deleteDeleteByIdAction = async (tableId: string, companyId: string) => {
  try {
    const user = await getUserWithAllCompaniesAndPermissions();

    if (!hasPermission(user, companyId, "DELETE_TABLE")) {
      throw new Error("Este usuario no tiene el permiso");
    }
    //logica para verificar si existe ordenes con esta mesa
    await db.table.delete({
      where: { id: tableId },
    });

    
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleteDeleteByIdAction"
    );
  }
}

export const createTableAction = async (
  name: string,
  companyId: string,
  roomId: string,
  isAvailable: boolean,
) => {
  try {
    const user = await getUserWithAllCompaniesAndPermissions();
    if (!hasPermission(user, companyId, "CREATE_TABLE")) {
      throw new Error("Este usuario no tiene el permiso");
    }
    const existsRoom = await db.room.findUnique({
      where: { id: roomId}
    })
    if(!existsRoom){
      throw new Error("Room Id no válido");
    }
    await db.table.create({
      data: {
        name,
        roomId,
        status: TableStatus.AVAILABLE,
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


export const updateTableAction = async (
  tableId: string,
  name: string,
  isAvailable: boolean,
  companyId: string,
) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const user = await getUserWithAllCompaniesAndPermissions()
    if (!hasPermission(user, companyId, "EDIT_TABLE")) {
        throw new Error("Este usuario no tiene el permiso");
    }

    await db.table.update({
        where: { 
          id : tableId,
        },
        data: { 
          name, 
          isAvailable,
        },
    });

  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updateTableAction"
    );
  }
};