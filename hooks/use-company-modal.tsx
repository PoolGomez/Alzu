import { create } from "zustand";

interface useCompnayModalProps{
    isOpen : boolean,
    onOpen: () => void;
    onClose: ()=>void;
}

export const useCompanyModal = create<useCompnayModalProps>((set)=>({
    isOpen: false,
    onOpen: ()=> set({ isOpen: true}),
    onClose: ()=> set({ isOpen: false}),
}))