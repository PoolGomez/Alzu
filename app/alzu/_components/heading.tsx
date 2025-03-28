"use client"

import { useIsMobile } from "@/hooks/use-mobile"

interface HeadingProps{
    title: string,
    description : string
}

export const Heading = ({title, description}: HeadingProps) => {
    const isMobile = useIsMobile()
    return (
        <div className="w-full">
            {/* <h2 className="text-3xl font-bold tracking-tight">{title}</h2> */}
            <h2 className={`${isMobile ? "text-xl":"text-3xl"} font-bold tracking-tight `}>{title}</h2>
            {/* <p className="text-sm text-muted-foreground">{description}</p> */}
            <p className={`${isMobile ? "text-xs":"text-sm"} text-muted-foreground`}>{description}</p>
        </div>
    )
}