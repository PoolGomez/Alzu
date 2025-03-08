import FormLogin from "./_components/form-login";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    verified: string;
    error: string;
  }>;
}) => {
  const { verified, error } = await searchParams;
  const isVerified = verified === "true";
  const OAuthAccountNotLinked = error === "OAuthAccountNotLinked";

  return (
    <div className="flex min-h-svh w-full items-center justify-center  p-6 md:p-10">
      <div className="w-full max-w-sm">
        <FormLogin
          isVerified={isVerified}
          OAuthAccountNotLinked={OAuthAccountNotLinked}
        />
      </div>
    </div>
  );
};

export default LoginPage;
