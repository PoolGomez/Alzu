import { getUsersWithAllCompanies } from "@/actions/user-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProductClient from "./_components/client";
import { getProductsByCompanyIdAction } from "@/actions/product-actions";
import { ProductColumns } from "./_components/columns";
import { format } from "date-fns";
type Params = Promise<{
  companyId: string;
}>;
const ProductsPage = async ({ params }: { params: Params }) => {
  const session = await auth();
  if (!session?.user?.email) {
    console.log("No hay session");
    redirect("/login");
  }
  const userData = await getUsersWithAllCompanies(session.user.email);

  if (!userData) {
    console.log("No existe usuario en DB");
    redirect("/login");
  }

  const { companyId } = await params;

  const validateOnwer = userData.createdCompanies.some(
    (company) => company.id === companyId
  );
  const validatePermissions = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("VIEW_PRODUCTS")
  );
  const validateCreateProduct = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("CREATE_PRODUCT")
  );
  const validateEditProduct = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("EDIT_PRODUCT")
  );
  const validateDeleteProduct = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("DELETE_PRODUCT")
  );

  if (validateOnwer || validatePermissions) {
    console.log("si tiene permiso");
    const products = await getProductsByCompanyIdAction(companyId);
    const formattedProducts: ProductColumns[] = products.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      price: item.price,
      categoryName: item.category.name,
      isAvailable: item.isAvailable,
      createdAt: item.createdAt ? format(item.createdAt, "MMMM do, yyyy") : "",
      updatedAt: item.updatedAt ? format(item.updatedAt, "MMMM do, yyyy") : "",
    }));
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 pt-4">
          <ProductClient
            data={formattedProducts}
            isCreate={validateCreateProduct}
            isEdit={validateEditProduct}
            isDelete={validateDeleteProduct}
            isOwner={validateOnwer}
          />
        </div>
      </div>
    );
  } else {
    console.log("no tiene permiso");
    redirect(`/alzu/${companyId}`);
  }
};

export default ProductsPage;
