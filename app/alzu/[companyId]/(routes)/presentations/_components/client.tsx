"use client";
import { Heading } from "@/app/alzu/_components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { PresentationColumns } from "./columns";
import { useIsMobile } from "@/hooks/use-mobile";
import PresentationTable from "./table-presentation";

interface PresentationClientProps {
  data: PresentationColumns[];
  isCreate: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isOwner: boolean;
}

const PresentationClient = ({
  data,
  isCreate,
  isEdit,
  isDelete,
  isOwner,
}: PresentationClientProps) => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex items-center justify-between">

        <Heading
          title={`Presentaciones (${data.length})`}
          description="Gestionar las presentaciones para tu empresa"
        />
        {(isCreate || isOwner) && (
          <Button
            onClick={() =>
              router.push(`/alzu/${params.companyId}/presentations/create`)
            }
            className="cursor-pointer"
          >
            <Plus className={`w-12 h-12 stroke-4`} />
            {!isMobile && "Crear Presentación"}
          </Button>
        )}
      </div>
      <Separator />
      <PresentationTable
        isOwner={isOwner}
        isEdit={isEdit}
        isDelete={isDelete}
        data={data}
      />

    </>
  );
};

export default PresentationClient;
