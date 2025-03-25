import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const users = [
    {
        id: "01",
        email:"paul123@gmail.com",
        permission:"Lecctura"
    },
    {
        id: "02",
        email:"pepe@gmail.com",
        permission:"Escritura"
    },
    {
        id: "03",
        email:"albert@gmail.com",
        permission:"Admin"
    }
]
const TestPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Gestión de Usuarios Compartidos</h2>
      
      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id} className="flex justify-between items-center p-4">
            <CardContent className="flex-1">{user.email}</CardContent>
            <Select value={user.permission} 
            // onValueChange={(value) => updatePermission(user.id, value)}
            >
              <SelectTrigger><SelectValue placeholder="Permiso" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Lectura</SelectItem>
                <SelectItem value="write">Escritura</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="destructive" 
            // onClick={() => removeUser(user.id)}
            >Eliminar</Button>
          </Card>
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold">Invitar Nuevo Usuario</h3>
        <div className="flex space-x-2 mt-2">
          <Input type="email" placeholder="Correo" 
        //   value={email} onChange={(e) => setEmail(e.target.value)} 
          />
          <Select 
        //   value={permission} onValueChange={setPermission}
          >
            <SelectTrigger><SelectValue placeholder="Permiso" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="read">Lectura</SelectItem>
              <SelectItem value="write">Escritura</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button 
        //   onClick={() => { inviteUser(email, permission); setEmail(""); }}
          >Invitar</Button>
        </div>
      </div>
    </div>
  )
}

export default TestPage
