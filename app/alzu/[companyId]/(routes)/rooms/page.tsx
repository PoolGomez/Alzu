import { getRoomsByCompanyIdAction } from "@/actions/room-actions";
import { getUserWithAllCompaniesAndPermissions } from "@/actions/user-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RoomColumns } from "./_components/columns";
// import { format } from "date-fns";
import RoomClient from "./_components/client";

type Params = Promise<{
  companyId: string;
}>;

const RoomsPage = async ({ params }: { params: Params }) => {
  //Verificar session
  const session = await auth();
  if (!session?.user?.email) {
    console.log("No hay session");
    redirect("/login");
  }

  const userData = await getUserWithAllCompaniesAndPermissions()

  if (!userData) {
    console.log("No existe usuario en DB");
    redirect("/login");
  }

  const { companyId } = await params;

  const validateOnwer = userData.createdCompanies.some(
    (company) => company.id === companyId
  );
  const validatePermissions = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("VIEW_ROOMS")
  );
  const validateCreateRoom = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("CREATE_ROOM")
  );
  const validateEditRoom = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("EDIT_ROOM")
  );
  const validateDeleteRoom = userData.companiesUserRoles.some((item) =>
    item.role.permissions.includes("DELETE_ROOM")
  );

  if (validateOnwer || validatePermissions) {
    console.log("si tiene permiso");
    const rooms = await getRoomsByCompanyIdAction(companyId)
    // const rooms: RoomColumns[] = []
    const formattedRooms: RoomColumns[] = rooms.map((item) =>({
      id: item.id,
      name: item.name,
      isAvailable: item.isAvailable,
      companyId: item.companyId,
      // createdAt: item.createdAt ? format(item.createdAt, "MMMM do, yyyy") : "",
      // updatedAt: item.updatedAt ? format(item.updatedAt, "MMMM do, yyyy") : "",
    }))
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-5 p-4 pt-4">
          <RoomClient
            data={formattedRooms}
            isCreate={validateCreateRoom}
            isEdit={validateEditRoom}
            isDelete={validateDeleteRoom}
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

export default RoomsPage;
