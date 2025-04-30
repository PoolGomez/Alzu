import { Table } from "@prisma/client"

export type TableColumns = {
    id: string,
    name: string,
    isAvailable:boolean,
    companyId: string,
    
    // createdAt: string,
    // updatedAt: string,
}
export type RoomColumns = {
    id: string,
    name: string,
    isAvailable:boolean,
    companyId: string,
    tables: Table[]
    
    // createdAt: string,
    // updatedAt: string,
}



