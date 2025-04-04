"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Product } from "@prisma/client";

//module product list
export async function getProductsByCompanyIdAction(companyId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const categories = await db.product.findMany({
      where: {
        companyId,
      },
      omit:{
        categoryId:true
      },
      include:{
        category:{
          select:{
            name: true
          }
        }
      }
    });
    return categories 
    // as Product[];
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error getProductsByCompanyIdAction"
    );
  }
}

//get product to update
export async function getProductByIdAction(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });
    return product as Product;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error getProductByIdAction"
    );
  }
}

//create product
export async function createProductAction(
    name: string,
    description: string,
    imageUrl: string,
    price: number,
    isAvailable: boolean,
    categoryId: string,
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
      const isCreate = userData.companiesUserRoles.some((item) =>
        item.role.permissions.includes("CREATE_PRODUCT")
      );
  
      if (isOwner || isCreate) {
        await db.product.create({
          data: {
            name,
            description,
            imageUrl,
            price,
            isAvailable,
            categoryId,
            companyId,
          },
        });
      } else {
        throw new Error("Este usuario no tiene el permiso");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error createProductAction"
      );
    }
}


export async function updateProductAction(
    productId: string,
    name: string,
    description: string,
    imageUrl: string,
    price: number,
    isAvailable: boolean,
    categoryId: string,
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
      const isEdit = userData.companiesUserRoles.some((item) =>
        item.role.permissions.includes("EDIT_PRODUCT")
      );
  
      if (isOwner || isEdit) {
        await db.product.update({
          where: {
            id: productId,
          },
          data: {
            name,
            description,
            imageUrl,
            price,
            isAvailable,
            categoryId
          },
        });
      } else {
        throw new Error("Este usuario no tiene el permiso");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updateProductAction"
      );
    }
}

export async function deleteProductByIdAction(
    productId: string,
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
        item.role.permissions.includes("DELETE_PRODUCT")
      );
  
      if (isOwner || isDelete) {
        await db.product.delete({
          where: {
            id: productId,
          },
        });
      } else {
        throw new Error("Este usuario no tiene el permiso");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error deleteProductByIdAction"
      );
    }
}