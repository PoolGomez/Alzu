// "use client"
// import { useEffect, useState } from "react";
import LogoutButton from "../../_components/logout-button"
// import FullScreenLoader from "@/components/full-screen-loader";

const DashboardOverview = () => {
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 3000); // Simula una carga de 3 segundos
  // }, []);


  return (
    <div className="min-h-screen bg-white-foreground text-black-foreground">
      {/* {loading && <FullScreenLoader />} */}
      DashboardOverview 
      <LogoutButton />
    </div>
  )
}

export default DashboardOverview
