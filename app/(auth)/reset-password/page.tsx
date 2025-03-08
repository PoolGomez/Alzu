import FormResetPassword from "./_components/form-reset-password"

const ResetPasswordPage = async({
  searchParams,
}: {
  searchParams: Promise<{
    token: string;
  }>;
}) => {
  const { token } = await searchParams;
  return (
    <div className="flex min-h-svh w-full items-center justify-center  p-6 md:p-10">
        <div className="w-full max-w-sm">
      <FormResetPassword token={token}/>
      </div>
    </div>
  )
}

export default ResetPasswordPage
