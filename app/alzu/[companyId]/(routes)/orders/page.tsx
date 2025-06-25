import { getOrderItemsByCompanyIdAction } from "@/actions/order-action";
import { getUsersWithAllCompanies } from "@/actions/user-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Params = Promise<{
    companyId: string;
}>;

const OrdersPage = async ({ params }:{params: Params}) => {
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
        item.role.permissions.includes("VIEW_ORDERS")
      );
      // const validateCreateProduct = userData.companiesUserRoles.some((item) =>
      //   item.role.permissions.includes("CREATE_ORDER")
      // );
      // const validateEditProduct = userData.companiesUserRoles.some((item) =>
      //   item.role.permissions.includes("EDIT_ORDER")
      // );
      // const validateDeleteProduct = userData.companiesUserRoles.some((item) =>
      //   item.role.permissions.includes("DELETE_ORDER")
      // );

      if (validateOnwer || validatePermissions) {
        console.log("si tiene permiso");
        const orderItems = await getOrderItemsByCompanyIdAction(companyId);
        // const formattedProducts: ProductColumns[] = products.map((item) => ({
        //   id: item.id,
        //   name: item.name,
        //   description: item.description,
        //   imageUrl: item.imageUrl,
        //   price: item.price,
        //   categoryName: item.category.name,
        //   isAvailable: item.isAvailable,
        //   createdAt: item.createdAt ? format(item.createdAt, "MMMM do, yyyy") : "",
        //   updatedAt: item.updatedAt ? format(item.updatedAt, "MMMM do, yyyy") : "",
        // }));
        return (
          <div className="flex-col">
            <div className="flex-1 space-y-5 p-4 pt-4">

                {JSON.stringify(orderItems)}
              {/* <ProductClient
                data={formattedProducts}
                isCreate={validateCreateProduct}
                isEdit={validateEditProduct}
                isDelete={validateDeleteProduct}
                isOwner={validateOnwer}
              /> */}
            </div>
          </div>
        );
      } else {
        console.log("no tiene permiso");
        redirect(`/alzu/${companyId}`);
      }
}

export default OrdersPage
