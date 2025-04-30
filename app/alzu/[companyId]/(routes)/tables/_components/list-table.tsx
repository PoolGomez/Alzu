import { Table } from "@prisma/client";
import { CellAction } from "./cell-action";

interface ListTablesProps {
    isOwner: boolean;
    isEdit: boolean;
    isDelete: boolean;
  //   data: CategoryColumns[];
  data: Table[] | null;
  handleSelectRoom: (params:string)=>void
}

const ListTable = ({ data, isOwner, isEdit,isDelete,handleSelectRoom }: ListTablesProps) => {
  return (
    <>
    <div className="flex flex-col w-full gap-y-1">
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-between p-4 rounded-lg shadow-md">
          <div className="flex w-full items-center justify-center">
            No hay Mesas
          </div>
        </div>
      ) : (
        data.map((table) => (
          <div
            key={table.id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-md"
          >
            <div className="flex flex-col">
              <span className="text-lg font-semibold ml-8 w-32 truncate">{table.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`text-sm ${
                  table.isAvailable === true ? "text-green-500" : "text-red-500"
                }`}
              >
                {table.isAvailable === true ? "Disponible" : "Desactivado"}
              </span>
            </div>

            <CellAction
                                id={table.id}
                                table={table}
                                isOwner={isOwner}
                                isEdit={isEdit}
                                isDelete={isDelete}
                                handleSelectRoom={handleSelectRoom}
                              />

          </div>
        ))
      )}
      </div>
      
    </>
  );
};

export default ListTable;
