"use client";
import { Card } from "@/components/ui/card";
import { useCompanyModal } from "@/hooks/use-company-modal";
import { Plus } from "lucide-react";
import React from "react";

const CardNewCompany = () => {
  const companyModal = useCompanyModal();
  const handleClick = () => {
    companyModal.onOpen();
  };

  return (
    <Card
      className="border border-yellow-500 p-6 flex flex-col items-center justify-center cursor-pointer h-40"
      onClick={handleClick}
    >
      <Plus size={40} className="text-yellow-500" />
      <p className="mt-2 text-lg">Crear una empresa</p>
    </Card>
  );
};

export default CardNewCompany;
