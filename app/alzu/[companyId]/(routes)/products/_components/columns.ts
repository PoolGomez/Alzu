
export type ProductColumns = {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    
    categoryName: string,
    price: number,
    isAvailable: boolean,
    createdAt: string,
    updatedAt: string,
}

export type ProductPresentationColumns = {
    id: string,
    description: string,
    imageUrl: string,
    price: string,
    isAvailable: boolean,
    presentationId: string,
    productId: string,

    createdAt: string,
    updatedAt: string,
}
