"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"

interface ModalProps {
    title: string,
    description: string,
    isOpen : boolean,
    onClose : () => void,
    children?: React.ReactNode
}

export const Modal = (
    {
        title,
        description,
        isOpen,
        onClose,
        children
    }: ModalProps
) => {
    const onChange = (open: boolean) => {
        if(!open){
            onClose()
        }
    }
    return (
      <Dialog open={isOpen} onOpenChange={onChange}>
        <DialogContent 
        // className="max-w-screen max-h-screen overflow-y-auto"
        className="max-w-full max-h-full"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {/* <div> */}
          {children}
          {/* </div> */}
        </DialogContent>
      </Dialog>
    );
}
