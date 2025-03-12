"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Company } from "@prisma/client"
import { useRouter } from "next/navigation";


const CardCompany = ({company}:{company: Company}) => {
    const router = useRouter();
    const handleClick = () => {
        router.push(`/alzu/${company.id}`);
    }
  return (
    <Card className="p-4 bg-white-foreground h-40 flex flex-col justify-center cursor-pointer" onClick={handleClick}>
              <CardContent className="flex flex-col items-center justify-center h-full">
                <h2 className="text-lg font-semibold">{company.name}</h2>
                {/* <p className="text-gray-400 text-sm">{project.id}</p> */}
              </CardContent>
            </Card>
  )
}

export default CardCompany
