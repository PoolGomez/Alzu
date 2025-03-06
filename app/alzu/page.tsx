import { auth } from "@/auth"
import LogoutButton from "./_components/logout-button"

const AlzuPage = async() => {
  const session = await auth()
  if(!session){
    return <div>no autentificado</div>
  }

  

  return (
    <div>
      <pre>{JSON.stringify(session, null , 2)}</pre>
      <LogoutButton />
    </div>
  )
}

export default AlzuPage
