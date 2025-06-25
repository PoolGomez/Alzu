"use server"
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function addQuantityOrderItemByIdAction(
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
    const isSell = userData.companiesUserRoles.some((item) =>
      item.role.permissions.includes("SELL")
    );

    if (isOwner || isSell) {
      await db.orderItem.update({
        where: {
          id: orderId,
        },
        data:{
            quantity: {
                increment: 1,
            }
        }
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error addQuantityOrderItemByIdAction"
    );
  }
}

export async function removeQuantityOrderItemByIdAction(
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
    const isSell = userData.companiesUserRoles.some((item) =>
      item.role.permissions.includes("SELL")
    );

    if (isOwner || isSell) {
      await db.orderItem.update({
        where: {
          id: orderId,
        },
        data:{
            quantity: {
                decrement: 1,
            }
        }
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error removeQuantityOrderItemByIdAction"
    );
  }
}