import Script from "next/script"
import FormSendResetPassword from "./_components/form-send-reset-password"


const SendResetPasswordPage = () => {
  return (
    <>
    <Script 
          strategy="beforeInteractive" 
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`}
        />
    <div className="flex min-h-svh w-full items-center justify-center  p-6 md:p-10">
        <div className="w-full max-w-sm">
      <FormSendResetPassword />
      </div>
    </div>
    </>
  )
}

export default SendResetPasswordPage
