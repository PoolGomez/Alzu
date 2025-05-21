import { Table } from "@prisma/client"

export type RoomColumns = {
    id: string,
    name: string,
    isAvailable:boolean,
    companyId: string,
    tables: Table[]
    
    // createdAt: string,
    // updatedAt: string,
}