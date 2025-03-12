"use client"

import { PlusCircle } from "lucide-react"

interface CreateNewCompanyItemProps{
    onClick : () => void
}
export const CreateNewCompanyItem = ({onClick}: CreateNewCompanyItemProps) => {
    return (
        <div 
            onClick={onClick} 
            className="flex items-center bg-background px-2 py-2 cursor-pointer hover:bg-accent"
        >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="text-sm"> Crear empresa</span>
        </div>
    )
}