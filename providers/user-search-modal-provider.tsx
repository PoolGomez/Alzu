"use client"
import UserSearchModal from "@/components/modal/user-search-modal";
import { useEffect, useState } from "react"

export const UserSearchModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    return (
        <>
        <UserSearchModal />
        </>
    )
}