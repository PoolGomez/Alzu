"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CompanyRole, PermissionAction } from "@prisma/client";

export async function getCompanyRolById(roleId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const role = await db.companyRole.findUnique({
      where: {
        id: roleId,
      },
    });
    return role;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error getCompanyRolById"
    );
  }
}

export async function getCompanyRoleByCompanyIdAction(companyId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("No existe una sesión");
    }
    const roles = await db.companyRole.findMany({
      where: {
        companyId,
      },
    });
    return roles as CompanyRole[];
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error getCompanyRoleByCompanyIdAction"
    );
  }
}

export async function updateCompanyRoleAction(
  id: string,
  name: string,
  description: string,
  permissions: PermissionAction[],
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
    if (isOwner) {
      await db.companyRole.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          description: description,
          permissions: {
            set: permissions,
          },
        },
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updateCompanyRoleAction"
    );
  }
}

export async function deleteCompanyRoleAction(id: string, companyId: string) {
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

    if (isOwner) {
      await db.companyRole.delete({
        where: {
          id,
        },
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleteCompanyRoleAction"
    );
  }
}

export async function createCompanyRoleAction(
  name: string,
  description: string,
  permissions: PermissionAction[],
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
    if (isOwner) {
      await db.companyRole.create({
        data: {
          name,
          description,
          permissions,
          companyId,
        },
      });
    } else {
      throw new Error("Este usuario no tiene el permiso");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error createCompanyRoleAction"
    );
  }
}
