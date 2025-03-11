"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCompanyModal } from "@/hooks/use-company-modal";
import { Company } from "@prisma/client";
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CompanyListItem } from "./company-list-item";
import { CreateNewCompanyItem } from "./create-company-item";
// import { useIsMobile } from "@/hooks/use-mobile";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface CompanySwitcherProps extends PopoverTriggerProps {
  items: Company[];
}

export function CompanySwitcher({ items }: CompanySwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const companyModal = useCompanyModal();

//   const isMobile = useIsMobile();

  const formattedCompanies = items?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentCompany = formattedCompanies?.find(
    (item) => item.value === params.companyId
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/alzu/${store.value}`);
  };

  return (
    
      
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={currentCompany?.label}
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentCompany?.value
                        ? formattedCompanies?.find(
                            (framework) =>
                              framework.value === currentCompany.value
                          )?.label
                        : "Select Store..."}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <SidebarGroupLabel>Stores</SidebarGroupLabel>
                {/* <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
                        <StoreIcon className="mr-2 h-4 w-4 min-w-4" />
                        <input
                        type="text"
                        placeholder="Search Store..."
                        onChange={handleSearchTerm}
                        className="flex-1 w-full outline-none"
                        />
                    </div> */}
                {formattedCompanies?.map((item, index) => (
                  <CompanyListItem
                    company={item}
                    key={`${index}-${item.value}`}
                    onSelect={onStoreSelect}
                    isChecked={currentCompany?.value === item.value}
                  />
                ))}

                {/* <Link href="/alzu">
                      <DropdownMenuItem className="gap-2 p-2 ">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                          <Building2 className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                          Ver todas las empresas
                        </div>
                      </DropdownMenuItem>
                    </Link>
                      
                      
                    <Link href="/alzu/create">
                        <DropdownMenuItem className="gap-2 p-2">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                            <Plus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                            Crear una empresa
                        </div>
                        </DropdownMenuItem>
                    </Link> */}

                <Separator />

                <CreateNewCompanyItem
                  onClick={() => {
                    setOpen(false);
                    companyModal.onOpen();
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      
  );
}
