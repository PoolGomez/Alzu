"use client"
import { useStoreModal } from '@/hooks/use-company-modal'
import { useEffect } from 'react'

const AlzuPage = () => {
    const onOpen = useStoreModal((state) => state.onOpen)
    const isOpen = useStoreModal((state) => state.isOpen)
    useEffect(()=>{
        if(!isOpen){
            onOpen();
        }
    },[isOpen, onOpen])
    return null
}

export default AlzuPage
