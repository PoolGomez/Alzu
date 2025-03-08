import { SessionProvider } from "next-auth/react";
import ContentMain from "./_components/content-main";
// import ButtonIn from "./_components/button-in";

export default  function Home() {
  return (
    <SessionProvider >
    <ContentMain />
    {/* <ButtonIn /> */}
    </SessionProvider>
  );
}
