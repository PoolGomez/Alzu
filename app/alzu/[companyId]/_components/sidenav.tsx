"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { Armchair, CheckCheck, FolderOpen, Grid, HandPlatter, House, LayoutDashboard, Ruler, Salad, UserRoundCog, Wrench } from "lucide-react"
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Company, PermissionAction } from "@prisma/client"


interface SidenavProps {
    userId: string,
    currentCompany: Company,
    permissions: PermissionAction[]
}
export const SideNav = ({userId, currentCompany, permissions}:SidenavProps) => {

    const pathname = usePathname()
    const params = useParams()

    // const currentCompany = myCompanies.some(comp => comp.id === params.companyId)
    // const currentCompany = myCompanies.filter((comp) => comp.id === params.companyId) || []

    const routes =[
        {
            href : `/alzu/${params.companyId}`,
            label :"Inicio",
            active : pathname === `/alzu/${params.companyId}`,
            icon: House,
            permission: "VIEW_COMPANY"
        },
        {
            href : `/alzu/dashboard/${params.companyId}`,
            label :"Dashboard",
            active : pathname === `/alzu/dashboard/${params.companyId}`,
            icon: LayoutDashboard,
            permission: "VIEW_DASHBOARD"
        },
        // {
        //     href : `/alzu/${params.companyId}/billboards`,
        //     label :"Billboards",
        //     active : pathname === `/${params.companyId}/billboards`,
        //     icon: LayoutDashboard
        // },
        {
            href : `/alzu/${params.companyId}/categories`,
            label :"Categorias",
            active : pathname === `/alzu/${params.companyId}/categories`,
            icon: FolderOpen,
            permission: "VIEW_CATEGORIES"
        },
        {
            href : `/alzu/${params.companyId}/presentations`,
            label :"Presentaciones",
            active : pathname === `/alzu/${params.companyId}/presentations`,
            icon: Ruler,
            permission: "VIEW_PRESENTATIONS"
        },
        // {
        //     href : `/alzu/${params.companyId}/kitchens`,
        //     label :"Kitchens",
        //     active : pathname === `/${params.companyId}/kitchens`,
        //     icon: HandPlatter
        // },
        // {
        //     href : `/alzu/${params.companyId}/cuisines`,
        //     label :"Cuisines",
        //     active : pathname === `/${params.companyId}/cuisines`,
        //     icon: HandPlatter
        // },
        {
            href : `/alzu/${params.companyId}/products`,
            label :"Productos",
            active : pathname === `/alzu/${params.companyId}/products`,
            icon: Salad,
            permission: "VIEW_PRODUCTS"
        },
        {
            href : `/alzu/${params.companyId}/orders`,
            label :"Ordenes",
            active : pathname === `/alzu/${params.companyId}/orders`,
            icon: HandPlatter,
            permission:"VIEW_ORDERS"
        },
        // {
        //     href : `/alzu/${params.companyId}/settings`,
        //     label :"Settings",
        //     active : pathname === `/${params.companyId}/settings`,
        //     icon: Wrench
        // },
        {
            href : `/alzu/${params.companyId}/rooms`,
            label :"Salas",
            active : pathname === `/alzu/${params.companyId}/rooms`,
            icon: Grid,
            permission:"VIEW_ROOMS"
        },
        {
            href : `/alzu/${params.companyId}/tables`,
            label :"Mesas",
            active : pathname === `/alzu/${params.companyId}/tables`,
            icon: Armchair,
            permission:"VIEW_TABLES"
        },

    ]

    const routesAdmin = [
        
        {
            href:  `/alzu/${params.companyId}/roles`,
            label :"Roles",
            active : pathname === `/alzu/${params.companyId}/roles`,
            icon: UserRoundCog
        },
        {
            href : `/alzu/${params.companyId}/settings`,
            label :"Ajustes",
            active : pathname === `/alzu/${params.companyId}/settings`,
            icon: Wrench
        },
    ]

    return (
        <>
        <SidebarMenu>
            {routes.map((route)=>{
                if(permissions.some( (permiso : string) => permiso === route.permission) 
                    || userId === currentCompany.ownerId
                ) {
                    return(
                        <Collapsible 
                            key={route.label}
                            asChild
                            defaultOpen={route.active}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={route.label}>
                                        
                                            <Link 
                                                href={route.href}
                                                className={cn(
                                                    "text-sm font-medium transition-colors hover:text-primary w-full",
                                                    route.active 
                                                        ? "text-black dark:text-white" 
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center justify-start">
                                                        {route.icon && <route.icon className="h-4 w-4" />}
                                                        <p className="text-sm ml-4">{route.label}</p>
                                                    </div>
                                                    <div>
                                                        {route.active && <CheckCheck className="w-4 h-4"/>}
                                                    </div>
                                                </div>
                                            </Link>
                                        
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                            </SidebarMenuItem>
                        
                        </Collapsible>
                    )
                }
                // else{
                //     return null
                // }
            
        }
            )}
        </SidebarMenu>
        <SidebarSeparator />
        { currentCompany && userId === currentCompany.ownerId && (
            <>
            <SidebarGroupLabel>Administrar</SidebarGroupLabel>
                <SidebarMenu>
                    {routesAdmin.map((route)=>(
                        <Collapsible key={route.label}
                        asChild
                        defaultOpen={route.active}
                        className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={route.label}>
                                        
                                            <Link 
                                                href={route.href}
                                                className={cn(
                                                    "text-sm font-medium transition-colors hover:text-primary w-full",
                                                    route.active 
                                                        ? "text-black dark:text-white" 
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center justify-start">
                                                        {route.icon && <route.icon className="h-4 w-4" />}
                                                        <p className="text-sm ml-4">{route.label}</p>
                                                    </div>
                                                    <div>
                                                        {route.active && <CheckCheck className="w-4 h-4"/>}
                                                    </div>
                                                </div>
                                            </Link>
                                        
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                            </SidebarMenuItem>
                        </Collapsible>
                        
                    
                    ))}
                </SidebarMenu>
            </>
        )
        
        // JSON.stringify(currentCompany)

        }
        
        </>


    )
}


{/* <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
            {routes.map(route => (
                <Link 
                    key={route.href} 
                    href={route.href} 
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active 
                            ? "text-black dark:text-white" 
                            : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav> */}