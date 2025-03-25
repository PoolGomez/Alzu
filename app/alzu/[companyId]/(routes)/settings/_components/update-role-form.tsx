"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyRole } from "@prisma/client";
import { useState } from "react";


// const formSchema = z.object({
//     roleId: z.string().min(1)
//   });

const UpdateRoleForm = ({roleIdCurrent, roles}:{roleIdCurrent : string, roles : CompanyRole[]}) => {

    const [roleCurrent, setRoleCurrent] = useState(roleIdCurrent)
    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues:  {
    //       roleId: roleIdCurrent
    //     },
    //   });

  return (
    <div>
        <Select value={roleCurrent} onValueChange={(e)=>setRoleCurrent(e)}>
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

    </div>
  )
}

export default UpdateRoleForm
