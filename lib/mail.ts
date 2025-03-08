
export const sendEmailResetPassword = async(email: string, token: string) => {
  try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            to: email,
            token
        }),
      });

      const data = await response.json();
          console.log(data);
  
        return {success: true}

  }catch(error){
    console.log(error)
    return {error: true}
  }
}

export const sendEmailVerification = async(email: string,token: string)=>{
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
              to: email,
              token
           }),
        });
  
        const data = await response.json();
          console.log(data);
  
        return {success: true}

        // if (response.ok) {  
        //   alert("Email sent successfully!");
        // } else {
        //   alert("Failed to send email.");
        // }
      } catch (error) {
        console.error("Error:", error);
        // alert("An error occurred.");
        return {error:true}
      }


    // try {
    //     smtpEmail.subject = "hello, world!"
    //     smtpEmail.to=[
    //         {email:email, name: "Pool"}
    //     ]
    //     smtpEmail.htmlContent = `<p>Click the link below to verify your email</p>
    //                  <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">Verify email</a>
    //                  `
    //     smtpEmail.sender={name:"Fazt Tech", email:"alzu@alzu.com"}
    //     await apiInstance.sendTransacEmail(smtpEmail)
    //     return {
    //                     success: true
    //                 }
    // } catch (error) {
    //     console.log(error)
    //     return {
    //         error: true
    //     }
    // }
   
}




