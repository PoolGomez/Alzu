"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Presentation } from "@prisma/client";

export async function getPresentationsByCompanyIdAction(companyId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const presentations = await db.presentation.findMany({
      where: {
        companyId,
      },
    });
    return presentations as Presentation[];
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error getPresentationsByCompanyIdAction"
    );
  }
}

export async function getPresentationByIdAction(presentationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const presentation = await db.presentation.findUnique({
    //   select: {
    //     name: true,
    //     description: true,
    //   },
      where: {
        id: presentationId,
      },
    });
    return presentation as Presentation;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error getPresentationByIdAction"
    );
  }
}

export async function createPresentationAction(
    name: string,
    isAvailable: boolean,
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
        item.role.permissions.includes("CREATE_PRESENTATION")
      );
  
      if (isOwner || isCreate) {
        await db.presentation.create({
          data: {
            name,
            companyId,
            isAvailable
          },
        });
      } else {
        throw new Error("Este usuario no tiene el permiso");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error createPresentationAction"
      );
    }
}

export async function updatePresentationAction(
    presentationId: string,
    name: string,
    isAvailable: boolean,
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
        item.role.permissions.includes("EDIT_PRESENTATION")
      );
  
      if (isOwner || isEdit) {
        await db.presentation.update({
          where: {
            id: presentationId,
          },
          data: {
            name,
            isAvailable,
          },
        });
      } else {
        throw new Error("Este usuario no tiene el permiso");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updatePresentationAction"
      );
    }
}

export async function deletePresentationByIdAction(
    presentationId: string,
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
        item.role.permissions.includes("DELETE_PRESENTATION")
      );
  
      if (isOwner || isDelete) {
        await db.presentation.delete({
          where: {
            id: presentationId,
          },
        });
      } else {
        throw new Error("Este usuario no tiene el permiso");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error deletePresentationByIdAction"
      );
    }
}