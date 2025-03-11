export async function getCaptchaToken() {

    return new Promise<string | null>(resolve => {

        grecaptcha.ready(async()=>{
            const sitekey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
            if(!sitekey){
                resolve(null)
                return;
            }
            const token = await grecaptcha.execute(sitekey,{
                action: "contact"
            })
            resolve(token)
        })
    })
    
}

export async function verifyCaptchaToken(token: string){
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    if(!secretKey){
        throw new Error("No secret key found")
    }
    const url = new URL("https://www.google.com/recaptcha/api/siteverify")
    url.searchParams.append('secret', secretKey)
    url.searchParams.append('response',token)

    const res = await fetch(url,{ method:'POST'})
    const captchaData: CaptchaData = await res.json()
    // console.log(captchaData)
    if(!res.ok) return null
    return captchaData;
}

type CaptchaData = {
    success: true;
    challenge_ts: string;
    score: number;
    action: string;
} | {
    success: false;
    "error-codes": string[];
};