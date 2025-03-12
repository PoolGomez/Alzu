"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BadgeCheck, LogOut, Store, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserButton = ({username}:{username: string})=>{
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const handleLogout = async () => {
        setIsOpen(false)
          await signOut({
            callbackUrl: "/login"
          })
    }

    return (
        <div className="flex items-center gap-2 text-sm">
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
    
              <Button 
                variant="ghost" 
                size="icon" 
                // className="h-7 w-7 data-[state=open]:bg-accent"
                className="data-[state=open]:bg-accent"
            >
                {/* <MoreHorizontal /> */}
                <Avatar className="h-8 w-8 rounded-full">
                            <AvatarImage
                              src={"/img/user.png"}
                              alt={username || ""}
                            />
                            <AvatarFallback className="rounded-lg">
                              CN
                            </AvatarFallback>
                          </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 overflow-hidden rounded-lg p-0" align="end">
              <Sidebar collapsible="none" className="bg-transparent">
                <SidebarContent>
    
                    <SidebarGroup className="border-b last:border-none">
                      <SidebarGroupContent className="gap-0">
                        
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <User className="h-8 w-8 rounded-lg" />
                              
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate  text-xs">
                                {/* {data.user.name} */}
                                {/* {email} */}
                                Bienvenido,
                              </span>
                              <span className="truncate font-semibold">
                                {/* {data.user.email} */}
                                {username}
                              </span>
                            </div>
                          </div>
    
                      </SidebarGroupContent>
                    </SidebarGroup>
    
    
    
                    <SidebarGroup className="border-b last:border-none">
                      <SidebarGroupContent className="gap-0">
                        <SidebarMenu>
                          
                            
                            
                            <SidebarMenuItem >
                              <SidebarMenuButton onClick={()=>{router.push("/alzu/account")}}>
                                <BadgeCheck /> <span>Cuenta</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem >
                              <SidebarMenuButton onClick={()=>{router.push("/alzu/")}}>
                                <Store /> <span>Mis empresas</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
    
                            {/* <SidebarMenuItem >
                              <SidebarMenuButton>
                                <Sparkles /> <span>Actualizar a Pro</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem> */}
    
    
                          
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
    
                    <SidebarGroup className="border-b last:border-none">
                      <SidebarGroupContent className="gap-0">
                        <SidebarMenu>
                          
                            
                            
                            <SidebarMenuItem >
                              <SidebarMenuButton onClick={handleLogout}>
                                <LogOut /> <span>Cerrar Sesión</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
    
    
                          
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
    
                </SidebarContent>
              </Sidebar>
            </PopoverContent>
          </Popover>
        </div>
      )
}

export default UserButton;