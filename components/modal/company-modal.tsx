"use client"
import { useCompanyModal } from "@/hooks/use-company-modal"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// import axios from "axios"


import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import toast from "react-hot-toast"
import { Modal } from "@/components/modal"
import { Company } from "@prisma/client"
import { createCompanyAction } from "@/actions/company-actions"
// import { DatabaseStoreRepository } from "@/src/infrastructure/database/repositories/DatabaseStoreRepository"
// import { CreateStore } from "@/src/application/useCases/stores/CreateStore"

const formSchema = z.object({
    name : z
        .string()
        .min(3, {message : "Company name should be minimum 3 characters"})
})


export const CompanyModal = () => {
    // const storeRepo = new DatabaseStoreRepository();
    // const useCase = new CreateStore(storeRepo);


    const companyModal = useCompanyModal();

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            //  const newStore = await useCase.execute(values.name);
            // const newCompany = (await axios.post("/api/companies", values)).data as Company;         
            const newCompany = await createCompanyAction(values.name) as Company
            if(newCompany instanceof Error){
                toast.error(newCompany.message)    
            }else{
                toast.success("Empresa Creada")
                window.location.assign(`/alzu/${newCompany.id}`)
            }
            
            
        } catch (error) {
            console.log(error)
            toast.error("Algo salió mal")
        }finally{
            setIsLoading(false)
        }   
    }

    return (
        <Modal
            title="Crea una nueva empresa"
            description="Añade una nueva empresa para gestionar los productos y categorías"
            isOpen={companyModal.isOpen}
            onClose={companyModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                                control={form.control} 
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="El nombre de tu empresa..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={isLoading} type="button"  variant={"outline"} size={"sm"} onClick={companyModal.onClose}>Cancelar</Button>
                                <Button disabled={isLoading} type="submit" size={"sm"}>Continuar</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}