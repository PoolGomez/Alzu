"use server"
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OrderItem } from "@prisma/client";

export async function createOrderItemAction(
  order: OrderItem,
  // companyId: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const userData = await db.user.findUnique({
      where: {
        email: session.user?.email,
      },
      select: {
        email: true,
        companiesUserRoles: {
          select: {
            role: {
              select: {
                permissions: true,
              },
            },
          },
        },
        createdCompanies: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userData) {
      throw new Error("No existe informacion del usuario");
    }

    const isOwner = userData.createdCompanies.some(
      (company) => company.id === order.companyId
    );
    const isCreate = userData.companiesUserRoles.some((item) =>
      item.role.permissions.includes("CREATE_ORDER")
    );

    if (isOwner || isCreate) {
        console.log("order:", order)
      const newOrder = await db.orderItem.create({
        data: {
            productId: order.productId,
            quantity: order.quantity,
            price: order.price,
            subtotal: order.price * order.quantity,
            tableId: order.tableId,
            companyId: order.companyId,
            status: order?.status,
        }
      });

      return newOrder;

    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error createOrderItemAction"
    );
  }
}

export async function getOrderItemByTableIdAction(tableId: string){
    try {
      const session = await auth();
      if (!session?.user?.email) {
        throw new Error("No existe una sesión");
      }
      if(!tableId){
        throw new Error("No existe el id de la mesa");
      }
      const orders = await db.orderItem.findMany({
        where: {
            tableId,
        },
        // omit:{
        //   categoryId:true
        // },
        include:{
          product:{
            select:{
              name: true
            }
          }
        }
      });
      return orders 
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error getOrderItemByTableIdAction"
      );
    }
}

export async function getOrderItemsByCompanyIdAction(companyId: string){
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    if(!companyId){
      throw new Error("No existe el id de la empresa");
    }
    const orders = await db.orderItem.findMany({
      where: {
        companyId,
      },
      // omit:{
      //   categoryId:true
      // },
      include:{
        product:{
          select:{
            name: true
          }
        }
      }
    });
    return orders 
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error getOrderItemByTableIdAction"
    );
  }
}
export async function deleteOrderItemByIdAction(
  orderId: string,
  companyId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const userData = await db.user.findUnique({
      where: {
        email: session.user?.email,
      },
      select: {
        email: true,
        companiesUserRoles: {
          select: {
            role: {
              select: {
                permissions: true,
              },
            },
          },
        },
        createdCompanies: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userData) {
      throw new Error("No existe informacion del usuario");
    }

    const isOwner = userData.createdCompanies.some(
      (company) => company.id === companyId
    );
    const isDelete = userData.companiesUserRoles.some((item) =>
      item.role.permissions.includes("DELETE_ORDER")
    );

    if (isOwner || isDelete) {
      await db.orderItem.delete({
        where: {
          id: orderId,
        },
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error deleteOrderItemByIdAction"
    );
  }
}