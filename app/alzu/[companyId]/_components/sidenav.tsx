"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { Armchair, CheckCheck, FolderOpen, Grid, HandPlatter, LayoutDashboard, Ruler, Salad, Wrench } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"

export const SideNav = (
    // {
        // className,
        //  ...props
    // }: React.HtmlHTMLAttributes<HTMLElement>
) => {

    const pathname = usePathname()
    const params = useParams()

    const routes =[
        {
            href : `/alzu/${params.companyId}`,
            label :"Overview",
            active : pathname === `/${params.companyId}`,
            icon: LayoutDashboard
        },
        {
            href : `/alzu/${params.companyId}/billboards`,
            label :"Billboards",
            active : pathname === `/${params.companyId}/billboards`,
            icon: LayoutDashboard
        },
        {
            href : `/alzu/${params.companyId}/categories`,
            label :"Categories",
            active : pathname === `/${params.companyId}/categories`,
            icon: FolderOpen
        },
        {
            href : `/alzu/${params.companyId}/sizes`,
            label :"Sizes",
            active : pathname === `/${params.companyId}/sizes`,
            icon: Ruler
        },
        {
            href : `/alzu/${params.companyId}/kitchens`,
            label :"Kitchens",
            active : pathname === `/${params.companyId}/kitchens`,
            icon: HandPlatter
        },
        {
            href : `/alzu/${params.companyId}/cuisines`,
            label :"Cuisines",
            active : pathname === `/${params.companyId}/cuisines`,
            icon: HandPlatter
        },
        {
            href : `/alzu/${params.companyId}/products`,
            label :"Products",
            active : pathname === `/${params.companyId}/products`,
            icon: Salad
        },
        {
            href : `/alzu/${params.companyId}/orders`,
            label :"Orders",
            active : pathname === `/${params.companyId}/orders`,
            icon: HandPlatter
        },
        {
            href : `/alzu/${params.companyId}/settings`,
            label :"Settings",
            active : pathname === `/${params.companyId}/settings`,
            icon: Wrench
        },
        {
            href : `/alzu/${params.companyId}/rooms`,
            label :"Rooms",
            active : pathname === `/${params.companyId}/rooms`,
            icon: Grid
        },
        {
            href : `/alzu/${params.companyId}/tables`,
            label :"Tables",
            active : pathname === `/${params.companyId}/tables`,
            icon: Armchair
        },

    ]
    return (
        
        <SidebarMenu>
            {routes.map((route)=>(
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
            ))}
        </SidebarMenu>


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