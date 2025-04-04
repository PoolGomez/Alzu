"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Category } from "@prisma/client";

export async function getAllCategoriesByCompanyIdAction(companyId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const categories = await db.category.findMany({
      where: {
        companyId,
      },
    });
    return categories as Category[];
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error getAllCategoriesByCompanyIdAction"
    );
  }
}

export async function deleteCategoryByIdAction(
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
    const isDelete = userData.companiesUserRoles.some((item) =>
      item.role.permissions.includes("DELETE_CATEGORY")
    );

    if (isOwner || isDelete) {
      await db.category.delete({
        where: {
          id: categoryId,
        },
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error deleteCategoryByIdAction"
    );
  }
}

export async function createCategoryAction(
  name: string,
  description: string,
  companyId: string,
  isAvailable: boolean
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
      item.role.permissions.includes("CREATE_CATEGORY")
    );

    if (isOwner || isCreate) {
      await db.category.create({
        data: {
          name,
          description,
          companyId,
          isAvailable
        },
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error createCategoryAction"
    );
  }
}

export async function getCategoryByIdAction(categoryId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const category = await db.category.findUnique({
      select: {
        name: true,
        description: true,
        isAvailable: true
      },
      where: {
        id: categoryId,
      },
    });
    return category as Category;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error getCategoryByIdAction"
    );
  }
}

export async function updateCategoryAction(
  categoryId: string,
  name: string,
  description: string,
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
      item.role.permissions.includes("EDIT_CATEGORY")
    );

    if (isOwner || isEdit) {
      await db.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name,
          description,
          isAvailable
        },
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updateCategoryAction"
    );
  }
}
