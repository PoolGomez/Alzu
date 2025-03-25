"use client"
import { getCompanyRoleByCompanyIdAction } from "@/actions/company-role-action"
import { Modal } from "@/components/modal"
import { AlertModal } from "@/components/modal/alert-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useIsMobile } from "@/hooks/use-mobile"
import { CompanyUserRoleWithUser } from "@/types-db"
import { CompanyRole } from "@prisma/client"
import { Edit, LoaderCircle, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteCompanyUserRoleAction, updateCompanyUserRole } from "@/actions/company-user-role-actions"
import { Label } from "@/components/ui/label"



const TableUsers  = ({users, companyId} :{users: CompanyUserRoleWithUser[], companyId: string}) => {

  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  const [companyUserSelect, setCompanyUserSelect] = useState("")
  const router = useRouter()

  const selectDeleteUser = (userId: string) => {
    setCompanyUserSelect(userId)
    setOpen(true)
  }

  const onDelete = async()=>{
    try {
        setIsLoading(true)
        await deleteCompanyUserRoleAction(currentCompanyUserRole?.id as string);
        // await deleteStoreAction(`${params.storeId}`)
        toast.success("Usuario Borrado")
        router.refresh();
        // router.push("/alzu")
    } catch (error) {
        console.log("Error borrando el usuario:", error)
        toast.error("Algo salió mal")
    }finally{
        setIsLoading(false)
        setOpen(false)
    } 
}

  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)


  // const [permissions, setPermissions] = useState<PermissionAction[]>([]);
  // const [userPermissions, setUserPermissions] = useState<PermissionAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [roleCurrent, setRoleCurrent] = useState<string>("")

  const [currentCompanyUserRole , setCurrentCompanyUserRole] = useState<CompanyUserRoleWithUser | null>(null)


  const mostrar = async (companyUserRole: CompanyUserRoleWithUser)=>{
    setCompanyUserSelect(companyUserRole.userId)
    setRoleCurrent(companyUserRole.roleId)

    setCurrentCompanyUserRole(companyUserRole)
    setIsOpenModalEdit(true)
    // const data = await getPermissionsUserAction(companyId,userId)
    // setPermissions(data.permissions);
    // setUserPermissions(data.userPermissions);

    const roles = await getCompanyRoleByCompanyIdAction(companyId)
    setRoles(roles)
    
  }

 

  // Guardar cambios
  const handleSave = async () => {
    
    console.log("companyUserSelect: ", companyUserSelect)
    if (!companyUserSelect) return;
    setLoading(true);

    try {
      // await updatePermissionsAction(companyId, companyUserSelect, userPermissions )
      console.log("roleCurrent: ", roleCurrent)
      await updateCompanyUserRole(currentCompanyUserRole?.id as string, roleCurrent)
      
      console.log("Permisos actualizados correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error actualizando permisos:", error)
    } finally {
      setLoading(false);
    }
  };


  


  
  return (
    <>
    <AlertModal 
            isOpen={open}
            onClose={()=> setOpen(false)}   
            onConfirm={onDelete}
            loading={isLoading}
    />

    <Modal 
            title="Editar Permisos" 
            description="Configurar los permisos del usuario"
            isOpen={isOpenModalEdit}
            onClose={()=>setIsOpenModalEdit(false)}
        >

          <div className="flex w-full mx-auto p-2 bg-white shadow rounded-lg items-center justify-center">

            {/* <UpdateRoleForm roleIdCurrent={roleCurrent} roles={roles} /> */}
            <Label className="w-[20%] items-center justify-center">Rol</Label>
            <Select value={roleCurrent} onValueChange={(e)=>setRoleCurrent(e)}>
              <SelectTrigger className="w-[80%]">
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

                {/* <Accordion type="single" collapsible className="w-full">
                {permissions.filter(p => p.title).map((permission) => {
                  const subtitulos = permissions.filter(p=> p.category === permission.category && p.title === false)
                  return(
                    <AccordionItem key={permission.id} value={`item-${permission.id}`}>
                      <AccordionTrigger><Label className="text-lg font-semibold">{permission.text}</Label></AccordionTrigger>
                      <AccordionContent>
                      <div className="flex flex-col items-start space-x-3 space-y-2 rounded-md border p-4 shadow">
                        {
                          subtitulos.map((subtitle=>(
                            
                              <label key={subtitle.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  checked={userPermissions.includes(subtitle.id)}
                                  onCheckedChange={() => handlePermissionToggle(subtitle.id)}
                                />
                                <Label>{subtitle.text}</Label>
                              </label>
                            
                          )))
                        }
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                )}
                </Accordion> */}


               
              </div>

              <Button
                  onClick={handleSave}
                  className="w-full items-center justify-center text-center"
                  disabled={loading}
                > {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : <Save />}
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>

        </Modal>

    
    <Card>
        {/* <CardHeader>
          <CardTitle>Usuarios con acceso</CardTitle>
        </CardHeader> */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isMobile ? (
                  <TableHead>Nombre - Email</TableHead>
                ):(
                <>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                </>
                )}
                <TableHead>
                    Rol
                </TableHead>
                <TableHead>
                    {/* Rol */}
                </TableHead>
                <TableHead className="text-right">
                    {/* Acciones */}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {JSON.stringify(users)} */}
              { users.length>0 ? users.map((user: CompanyUserRoleWithUser) => (
                <TableRow key={user.id}>
                  {isMobile ? (
                    <>
                    <TableCell>
                      <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {user.user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                                    {user.user.email}
                                    </p>
                                </div>
                    </TableCell>
                    <TableCell>{user.role.name}</TableCell>
                    </>
                  ):(
                    <>
                    <TableCell>{user.user.name}</TableCell>
                    <TableCell>{user.user.email}</TableCell>  
                    <TableCell>{user.role.name}</TableCell>
                    </>
                  )}
                  
                  <TableCell>
                    <Button variant="ghost" size="icon" 
                    // onClick={()=>setIsOpenModalEdit(true)}
                    onClick={()=>mostrar(user)}
                    >
                        <Edit className="w-5 h-5 text-orange-500"/>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={()=>selectDeleteUser(user.id)}>
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              )):(
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : 4}>
                  <div className="flex-1 min-w-0 text-center">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    No se encontraron usuarios
                                    </p>
                                </div>
                  </TableCell>
                </TableRow>
              )
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </>
  )
}

export default TableUsers
