import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Company } from "@prisma/client"
import { redirect } from "next/navigation"

interface LayoutAlzuProp {
    children: React.ReactNode
}

const LayoutAlzu = async ({children}:LayoutAlzuProp) => {

  console.log("LayoutAlzu")

  const session = await auth()
  if(!session?.user?.email){
    redirect("/login")
  }
  // obtener stores por el usuario(email)
  // const storeSnap = await getDocs(
  //   query(collection(db,"stores"), where("userId","==", session.user.email))
  // )
  const companySnap = await db.company.findMany({
    where:{
      owner: session?.user?.email
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  let company : Company | undefined;

  //obtener
  // storeSnap.forEach(doc=>{
  //   store = doc.data() as Store;
  //   console.log("store for: ", store)
  //   return
  // })

  if(companySnap.length > 0){
    company = companySnap[0] as Company
    // companySnap.forEach(doc=>{
    //   company = doc as Company;
    //   return
    // })
    redirect(`/alzu/${company.id}`)
  }

  return (
    <div>
    {children}
    </div>
  )
}

export default LayoutAlzu
