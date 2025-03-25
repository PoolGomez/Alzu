import { create } from "zustand";

interface useUserSearchModalProps{
    isOpen : boolean,
    onOpen: () => void;
    onClose: ()=>void;
}

export const useUserSearchModal = create<useUserSearchModalProps>((set)=>({
    isOpen: false,
    onOpen: ()=> set({ isOpen: true}),
    onClose: ()=> set({ isOpen: false}),
}))