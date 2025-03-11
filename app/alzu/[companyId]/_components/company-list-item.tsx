"use client";

import { cn } from "@/lib/utils";
import { Check, Store } from "lucide-react";


interface CompanyItem {
  label : string,
  value : string,
}

interface CompanyListItemProps {
  company: CompanyItem;
  onSelect: (company: CompanyItem) => void;
  isChecked: boolean;
}

export const CompanyListItem = ({
  company,
  onSelect,
  isChecked,
}: CompanyListItemProps) => {
  return (
    <div
      className="flex items-center px-2 py-1 cursor-pointer hover: bg-grat-50 text-muted-foreground hover:text-primary"
      onClick={() => onSelect(company)}
    >
      <Store className="mr-2 h-4 w-4" />
      <p className="w-full truncate text-sm whitespace-nowrap">{company.label}</p>
      <Check
        className={cn(
          "ml-auto w-4 h-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};
