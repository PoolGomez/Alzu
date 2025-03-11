"use client"
import { useIsMobile } from "@/hooks/use-mobile"


const ShowOnlyScreen = ({children, screen}:{children: React.ReactNode, screen: string}) => {
    const mobile = useIsMobile()

    if(screen === "mobile" && mobile === true){
        return(
            <>
            {children}
            </>
        )
    }

    if(screen === "desktop" && mobile == false){
        return(
            <>
            {children}
            </>
        )
    }
    
    return null
}

export default ShowOnlyScreen