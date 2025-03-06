import FormLogin from "./_components/form-login";


const LoginPage = async ({
    searchParams
  }:{
    searchParams:Promise<{
      verified: string;
      error: string
    }>
  }) => {

    const {verified, error} = await searchParams;
    const isVerified = verified === "true"
    const OAuthAccountNotLinked = error === "OAuthAccountNotLinked";

  return (
    <div className="flex items-center justify-center h-full">
        <div>
      <FormLogin 
        isVerified={isVerified}
        OAuthAccountNotLinked={OAuthAccountNotLinked}
      />
      </div>
    </div>
  )
}

export default LoginPage
