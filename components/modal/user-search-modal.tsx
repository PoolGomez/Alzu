"use client"
import { Modal } from '../modal'
import { useUserSearchModal } from '@/hooks/use-user-search-modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { searchUserByEmailAction, sendInviteUserAction } from '@/actions/user-actions';
import { CheckCheck, LoaderCircle, Search, SendHorizonal } from 'lucide-react';
import Image from 'next/image';
import { useSession } from "next-auth/react"
import { useParams, useRouter } from 'next/navigation';
import { UserSearch } from '@/types-db';
import { useIsMobile } from '@/hooks/use-mobile';
import toast from 'react-hot-toast';
import { getCompanyRoleByCompanyIdAction } from '@/actions/company-role-action';
import { CompanyRole } from '@prisma/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
    email: z.string()
    .min(1, {message : "Debe ingresar un valor de busqueda"}),
  })

const UserSearchModal = () => {
    const userSearchModal = useUserSearchModal();
    const [ isLoading, setIsLoading ] = useState(false)
    const [ users, setUsers] = useState<UserSearch[] | null >(null)
    const { data: session } = useSession()
    const params = useParams()
    const isMobile = useIsMobile()

    const [roles, setRoles] = useState<CompanyRole[] | null>(null)
    const [rolSelect, setRolSelect] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const router = useRouter()
    useEffect(() => {
      const getCompanyRole = async () => {
        try {
            const companyRoles = await getCompanyRoleByCompanyIdAction(params.companyId as string)
            if(companyRoles){
                setRoles(companyRoles)

            }
            console.log("companyRoles: ", companyRoles)
        } catch (error) {
            console.log(error)
            toast.error("Error al obtener Roles")
        }
        
      }
      getCompanyRole()
    }, [params.companyId])
    
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            console.log("sessionn:  ", session)
            setIsLoading(true)
            const results = await searchUserByEmailAction(data.email, session?.user?.email as string , params.companyId as string)
            if(results){
                // results.forEach((element: User) => {
                //     console.log("element:", element)
                // });
                setUsers(results)
            }
            // const companyRoles = await getCompanyRoleByCompanyIdAction(params.companyId as string)
            // if(companyRoles){ setRoles(companyRoles) }

            console.log("results type: ",typeof results)
            console.log("results: ", results)
            // await axios.patch(`/api/${params.storeId}`, {name: data.name});
            // await updateCompanyAction(params.companyId as string, data as Company)
            
            // toast.success("Empresa Actualizada correctamente")
            // router.refresh();
        } catch (error) {
            console.log(error)
            toast.error("Algo salió mal")
        }finally{
            setIsLoading(false)
        }   
    }
    const handleInvite = async (to: string, roleId: string) => {
        try {
            if(rolSelect === ""){
                toast.error("Seleccione un Rol para el usuario")
            }else{
                await sendInviteUserAction(to, params.companyId as string, roleId)
                router.refresh()
            }
            

        } catch (error) {
            console.log(error)
            toast.error("Algo salió mal")
        }
    }


  return (
    <Modal
            title="Nuevo Usuario"
            description="Busca usuarios para compartirles tu empresa"
            isOpen={userSearchModal.isOpen}
            onClose={userSearchModal.onClose}
        >

        {/* <div className="flex items-center space-x-2"> */}
          {/* <div className="grid flex-1 gap-2"> */}
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                <div className="flex items-center">
                    <div className='grid flex-1 gap-2'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input placeholder="Email..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" size="sm" className="px-3" disabled={isLoading}>
                        {isLoading ? (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        ):(
                            <Search  className="mr-2 h-4 w-4"/>
                        )}
                        Buscar
                        
                    </Button>

                    <Accordion type='single' collapsible className='w-full border-b-2'>
                        {
                            users ? users.map((user: UserSearch) => {
                                if(user.isShared){
                                    return(
                                        // <AccordionItem value={user.id} key={user.id} className='border-2'>
                                        //     <AccordionTrigger>
                                                <div 
                                                key={user.id} 
                                                className="flex items-center space-x-4 rtl:space-x-reverse py-4 border-t-2">
                                                        <div className="shrink-0 relative w-8 h-8 rounded-full" >
                                                            <Image fill  className="object-cover" src="/img/user.png" alt="Neil image" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                            {user.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                                                            {user.email}
                                                            </p>
                                                        </div>
                                                        <Button type='button' variant={'outline'}>
                                                            <CheckCheck className="mr-2 h-4 w-4" />
                                                            {!isMobile && "Invitado"}
                                                        </Button>
                                                </div>
                                        //     </AccordionTrigger>
                                            
                                        // </AccordionItem>
                                        
                                    )
                                }else{
                                    return(
                                        <AccordionItem value={user.id} key={user.id} className='border-t-2'>
                                            <AccordionTrigger onClick={()=>{
                                                console.log("trigger")
                                                setRolSelect("")
                                                }}>
                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                    <div className="shrink-0 relative w-8 h-8 rounded-full" >
                                                        <Image fill  className="object-cover" src="/img/user.png" alt="Neil image" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        {user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                                                        {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className='bg-accent items-center justify-center space-y-4 py-4 px-4'>
                                                {/* <div>
                                                    {roles && roles.map((rol)=>rol.name)}
                                                </div> */}
                                                <div className="flex items-center space-x-4 rtl:space-x-reverse justify-between">
                                                    {/* <p>Roles:</p> */}
                                                    <Select value={rolSelect} onValueChange={(e)=>setRolSelect(e)}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Selecciona un Rol" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                            {/* <SelectLabel>Roles</SelectLabel> */}
                                                            {
                                                                roles && roles.map((rol)=>(
                                                                    <SelectItem key={rol.id} value={rol.id}>{rol.name}</SelectItem>
                                                                ))
                                                            }
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
        
                                                    <Button variant={'default'} onClick={()=>handleInvite(user.id, rolSelect)}>
                                                        <SendHorizonal className={`${isMobile ? "mr-2":"mr-5"} h-4 w-4`} />
                                                        {!isMobile && "Enviar"}
                                                    </Button>
        
                                                </div>
                                                
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                }
                                
                                
                            }) : (
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex-1 min-w-0 items-center justify-center text-center">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    Sin resultlados
                                    </p>
                                </div>
                                </div>
                            )
                        }
                        
                    </Accordion>

                    {/* <ul className=" py-4">
                        {users ? users.map((user : UserSearch)=>(
                            <li key={user.id} className="pb-3 sm:pb-4">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="shrink-0 relative w-8 h-8 rounded-full" >
                                    <Image fill  className="object-cover" src="/img/user.png" alt="Neil image" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                                    {user.email}
                                    </p>
                                </div>
                                {
                                    user.isShared ? (
                                    <Button type='button' variant={'outline'}>
                                        <Check className="mr-2 h-4 w-4" />
                                        {!isMobile && "Invitado"}
                                    </Button>
                                    ):(
                                    <Button variant={'outline'} onClick={()=>handleInvite(user.id,"sss")}>
                                        <SendHorizonal className={`${isMobile ? "mr-2":"mr-5"} h-4 w-4`} />
                                        {!isMobile && "Invitar"}
                                    </Button>
                                    )
                                }
                                </div>
                            </li>
                        ))
                        :(
                            <li className="pb-3 sm:pb-4">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex-1 min-w-0 items-center justify-center text-center">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    Sin resultlados
                                    </p>
                                </div>
                                </div>
                            </li>
                        )
                    }
                    </ul> */}




                    </div>
                    </div>
                </form>
            </Form>

{/* <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 py-4"> */}
{/* <ul className=" py-4">
    {users ? users.map((user : UserSearch)=>(
        <li key={user.id} className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="shrink-0 relative w-8 h-8 rounded-full" >
                <Image fill  className="object-cover" src="/img/user.png" alt="Neil image" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {user.name}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {user.email}
                </p>
            </div>
            {
                user.isShared ? (
                <Button variant={'outline'} onClick={()=>handleInvite(user.email)}>
                    <Check className="mr-2 h-4 w-4" />
                    {!isMobile && "Invitado"}
                </Button>
                ):(
                <Button variant={'outline'} onClick={()=>handleInvite(user.email)}>
                    <SendHorizonal className="mr-5 h-4 w-4" /> Invitar
                </Button>
                )
            }
            </div>
        </li>
    ))
    :(
        <li className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-1 min-w-0 items-center justify-center text-center">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Sin resultlados
                </p>
            </div>
            </div>
        </li>
    )
}
</ul> */}



          {/* </div> */}
        {/* </div> */}

                  
            
            
        </Modal>
  )
}

export default UserSearchModal
