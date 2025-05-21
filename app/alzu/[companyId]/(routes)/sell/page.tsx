import  SellClient from "./_components/client";


type Params = Promise<{
  companyId: string;
}>;

const SellPage = async ({ params }: { params: Params }) => {

  const { companyId } = await params;
  return (
    <div className="flex-col">

      <SellClient companyId={companyId} />
    </div>
  )
}

export default SellPage
