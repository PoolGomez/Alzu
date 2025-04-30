import { getUserWithAllCompaniesAndPermissions } from "@/actions/user-actions";
import { PermissionAction } from "@prisma/client";

// ✅ Función de validación de permisos
export function hasPermission(user: Awaited<ReturnType<typeof getUserWithAllCompaniesAndPermissions>>, companyId: string, requiredPermission: PermissionAction) {
    const isOwner = user.createdCompanies.some((company) => company.id === companyId);
    const hasRolePermission = user.companiesUserRoles.some((item) =>
      item.role.permissions.includes(requiredPermission)
    );
  
    return isOwner || hasRolePermission;
}
