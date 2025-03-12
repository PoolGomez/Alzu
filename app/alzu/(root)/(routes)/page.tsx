"use client"
import { useCompanyModal } from '@/hooks/use-company-modal'
import { useEffect } from 'react'

const AlzuPage = () => {
    const onOpen = useCompanyModal((state) => state.onOpen)
    const isOpen = useCompanyModal((state) => state.isOpen)
    useEffect(()=>{
        if(!isOpen){
            onOpen();
        }
    },[isOpen, onOpen])
    return null
}

export default AlzuPage
