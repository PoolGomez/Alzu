"use client"
import { useSearchParams } from "next/navigation"
import LogoutButton from "../../_components/logout-button"
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

const DashboardOverview = () => {

  const searchParams = useSearchParams();
  const alertShownRef = useRef(false);

  useEffect(()=>{
    if(searchParams.get("message") && !alertShownRef.current){
        toast.error(searchParams.get("message"));
        alertShownRef.current = true;

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('message');
        window.history.replaceState({}, '', `${window.location.pathname}`+"?"+`${newSearchParams}`)

      }
  },[searchParams])

  return (
    <div className="min-h-screen bg-white-foreground text-black-foreground">
      DashboardOverview 
      <LogoutButton />
    </div>
  )
}

export default DashboardOverview
