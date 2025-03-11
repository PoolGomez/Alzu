"use client"

import { CompanyModal } from "@/components/modal/company-modal";
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    return (
        <>
        <CompanyModal />
        </>
    )
}