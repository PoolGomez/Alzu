"use client"
import { deleteCompanyAction, updateCompanyAction } from '@/actions/company-actions'
import { Heading } from '@/app/alzu/_components/heading'
import { AlertModal } from '@/components/modal/alert-modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Company } from '@prisma/client'
import { Plus, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import TableUsers from './table-users'
import { useUserSearchModal } from '@/hooks/use-user-search-modal'
import { CompanyUserRoleWithUser } from '@/types-db'
// import { CompanyUserWithUser } from '@/types-db'

interface SettingsFormProps {
    initialData : Company,
    users: CompanyUserRoleWithUser[],
}

const formSchema = z.object({
    name : z
        .string()
        .min(3, {message : "Nombre de la empresa debe tener un mínimo de 3 caracteres"})
})



const SettingsForm = ({initialData, users}: SettingsFormProps) => {

    const [open, setOpen] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const params = useParams()
    const router = useRouter()
    const userSearchModal = useUserSearchModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            // await axios.patch(`/api/${params.storeId}`, {name: data.name});
            await updateCompanyAction(params.companyId as string, data as Company)
            
            toast.success("Empresa Actualizada correctamente")
            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error("Algo salió mal")
        }finally{
            setIsLoading(false)
        }   
    }

    const onDelete = async()=>{
        try {
            setIsLoading(true)
            await deleteCompanyAction(params.companyId as string);
            // await deleteStoreAction(`${params.storeId}`)
            toast.success("Empresa Borrada")
            router.refresh();
            router.push("/alzu")
        } catch (error) {
            console.log("Error borrando la empresa:", error)
            toast.error("Algo salió mal")
        }finally{
            setIsLoading(false)
            setOpen(false)
        } 
    }

  return (
    <>
    <AlertModal 
        isOpen={open}
        onClose={()=> setOpen(false)}   
        onConfirm={onDelete}
        loading={isLoading}
    />
    <div className="flex items-center justify-center">
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button variant={"destructive"} size={"icon"} onClick={()=>{setOpen(true)}} >
            <Trash className="h-4 w-4" />
        </Button>
    </div>
    <Separator />
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                    control={form.control} 
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isLoading}
                                    placeholder="Your store name..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
                <Button disabled={isLoading} type="submit" size={"sm"}>Save Changes</Button>
            
        </form>
    </Form>
    <Separator />
    <div className="flex items-center justify-center">
        <Heading title="Compartir Empresa" description="Compartir la empresa con otros usuarios" />
        <Button onClick={()=>{
            userSearchModal.onOpen()
            }} >
            <Plus/>Nuevo Usuario
        </Button>
    </div>
    
    

    <TableUsers users={users} companyId={params.companyId as string}/>


    {/* <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
    /> */}
    </>
  )
}

export default SettingsForm
