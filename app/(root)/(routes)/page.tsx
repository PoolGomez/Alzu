import { SessionProvider } from "next-auth/react";
import ContentMain from "./_components/content-main";
import { auth } from "@/auth";
// import ButtonIn from "./_components/button-in";

export default async function Home() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ContentMain />
    </SessionProvider>
  );
}
