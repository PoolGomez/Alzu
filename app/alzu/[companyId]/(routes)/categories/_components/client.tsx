"use client";
import { Heading } from "@/app/alzu/_components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftCircleIcon, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumns } from "./columns";
import { useIsMobile } from "@/hooks/use-mobile";
import CategoryTable from "./table-category";

interface CategoryClientProps {
  data: CategoryColumns[];
  isCreate: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isOwner: boolean;
}

const CategoryClient = ({
  data,
  isCreate,
  isEdit,
  isDelete,
  isOwner,
}: CategoryClientProps) => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleClickBack = () => {
    router.push(`/alzu/${params.companyId}/categories`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <ArrowLeftCircleIcon
          className={` ${
            isMobile ? "mx-2 w-12 h-12" : "mx-4 w-16 h-16"
          } cursor-pointer `}
          onClick={() => handleClickBack()}
        />
        <Heading
          title={`Categorias (${data.length})`}
          description="Gestionar las categorias para tu empresa"
        />
        {(isCreate || isOwner) && (
          <Button
            onClick={() =>
              router.push(`/alzu/${params.companyId}/categories/create`)
            }
            className="cursor-pointer"
          >
            <Plus className={`w-12 h-12 stroke-4`} />
            {!isMobile && "Crear Categoría"}
          </Button>
        )}
      </div>
      <Separator />
      <CategoryTable
        isOwner={isOwner}
        isEdit={isEdit}
        isDelete={isDelete}
        data={data}
      />

    </>
  );
};

export default CategoryClient;
