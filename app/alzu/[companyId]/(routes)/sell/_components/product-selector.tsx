"use client"
import { getProductsByCategoryIdAction } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";
import { useOrder } from "@/lib/providers";
import { Product } from "@prisma/client";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductSelector = ({categoryId}:{categoryId:string}) => {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { selectCategory } = useOrder();

    useEffect(() => {
        const fetchRooms = async () => {
          try {
            // const response = await getRoomsByCompanyIdAction("cm8q9d6060004wtcwg91gu9zx");
            const response = await getProductsByCategoryIdAction(categoryId);
            setProducts(response);
            // if(response){
            //     setRooms(response);
            // }
            
          } catch (error) {
            console.error('Error fetching rooms:', error);
            toast.error('Failed to load products. Please try again.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchRooms();
    }, [categoryId]);

    const handleBackClick = () => {
        selectCategory(null);
      };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
        <div className='flex items-center gap-2'>
            <Button variant="outline" size="icon" 
            onClick={handleBackClick}
            >
            <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Seleccione Producto</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {
            products.length === 0 ?(
                <h1>No hay registros</h1>
            ): products.map((product)=>(
                
                <Card key={product.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg group h-full flex flex-col pb-2 pt-0 gap-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 pb-2">
                    <Image
                    // src={product.image}
                    src={"https://res.cloudinary.com/dbbnwkjjh/image/upload/v1743719963/camiseta_base_espalda_1_1_p3ft2z.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                </div>

                <CardContent className="pb-0 pt-0 pl-2 pr-2 sm:p-4 flex-grow">
                    
                    <h3 className="font-semibold text-sm sm:text-base leading-tight mb-2">{product.name}</h3>
                    {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p> */}
                    <div className="flex items-baseline">
                
                        {/* <span className="font-bold text-sm sm:text-base">{formatPrice(product.price)}</span> */}
                        <span className="font-bold text-sm capitalize mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {formatPrice(product.price)}
                        </span>
                    
                    </div>
                </CardContent>
                
                <CardFooter className="p-2 sm:p-4">
                    <Button className="w-full gap-2 text-xs sm:text-sm py-1 sm:py-2">
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                    Agregar
                    </Button>
                </CardFooter>
                </Card>

          

                ))
                


                
            }
        </div>

      
    </div>
  )
}

export default ProductSelector
      // <Card
                //     key={product.id}
                //     className={`cursor-pointer transition-all duration-200 hover:shadow-md ring-2 ring-primary hover:border-green-500/50`}
                //    style={{
                //         backgroundImage: `url("https://res.cloudinary.com/dbbnwkjjh/image/upload/v1743719963/camiseta_base_espalda_1_1_p3ft2z.png")`,
                //         backgroundSize:'cover',
                //         backgroundPosition: 'center'
                //     }}
                // >
                //     <CardTitle><p className="font-semibold text-lg">{product.name}</p></CardTitle>
                //     <CardContent 
                //     className="p-4 flex flex-col items-center justify-center h-32"
                
                //     >
                    
                //     </CardContent>
                //     <CardFooter>
                //     <span className={`text-xs capitalize mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                //         {formatPrice(product.price)}
                //     </span>
                //     </CardFooter>
                // </Card>