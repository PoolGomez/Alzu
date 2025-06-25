"use client"
import { getProductsByCompanyIdAction } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";
import { useOrder } from "@/lib/providers";
import { OrderItem, OrderItemStatus, Product } from "@prisma/client";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OrderButton from "./order-button";
import { createOrderItemAction, getOrderItemByTableIdAction } from "@/actions/order-action";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OrderItemWithProduct } from "@/types-db";

const ProductSelector = (
    {companyId}:{companyId:string}
) => {
    
    const [products, setProducts] = useState<Product[]>([]);

    const[orders, setOrders] =useState<OrderItem[]>([])
    const [loading, setLoading] = useState(true);
    const { selectTable, selectedTable } = useOrder();

    const [newOrderItemId, setNewOrderItemId] = useState("");

    const [productSelect, setProductSelect] = useState<Product | null>();
    const [quantity, setQuantity] = useState(1);
    const [observation, setObservation] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            // const response = await getRoomsByCompanyIdAction("cm8q9d6060004wtcwg91gu9zx");
            const response = await getProductsByCompanyIdAction(companyId);
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
    
        fetchProducts();
    }, [companyId]);

    useEffect(()=>{
        const fetchOrderItemByTable = async()=>{
            try {
                const tableId = selectedTable?.id;
                if(tableId){
                const response = await getOrderItemByTableIdAction(tableId);
                setOrders(response)
                }
            } catch (error) {
                console.error('Error fetching orderItems:', error);
                toast.error('Failed to load orderItems. Please try again.');
            }
        }
        fetchOrderItemByTable();
    },[selectedTable, newOrderItemId])

    const handleBackClick = () => {
        selectTable(null);
    };

    const selectProduct = (product : Product) => {
        setProductSelect(product);
        setDialogOpen(true);
    }
    const addQuantity = () => {
        if(quantity < 10){
            setQuantity(quantity + 1)    
        }
    }
    const removeQuantity = () => {
        if(quantity > 1){
            setQuantity(quantity - 1)
        }
    }

    const addOrder = async (product: Product | null) => {
        // console.log("product: ", product)

        if(product && selectedTable ){
                const order  ={
                productId: product.id,
                quantity: quantity,
                price: product.price,
                subtotal: 0,
                status: OrderItemStatus.CREATED,
                tableId: selectedTable.id,
                companyId: companyId
                
            }
            const newOrder = await createOrderItemAction(order as OrderItem)
            setNewOrderItemId(newOrder.id)
            setQuantity(1);
            setObservation("");

            toast.success("Producto agregado correctamente")
        }

        setDialogOpen(false)

        
    }

    if(loading){
        return <div>Loading...</div>
    }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <Button variant="outline" size="icon" 
                onClick={handleBackClick}
                >
                <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold">Seleccione Producto</h2>
            </div>
            <OrderButton data={orders as OrderItemWithProduct[]} companyId={companyId} />
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
                    <h5>{observation}</h5>
                    {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p> */}
                    <div className="flex items-baseline">
                
                        {/* <span className="font-bold text-sm sm:text-base">{formatPrice(product.price)}</span> */}
                        <span className="font-bold text-sm capitalize mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {formatPrice(product.price)}
                        </span>
                    
                    </div>
                </CardContent>
                
                <CardFooter className="p-2 sm:p-4">

                   


                    <Button className="w-full gap-2 text-xs sm:text-sm py-1 sm:py-2" 
                    // onClick={()=>addOrder(product)}
                    onClick={()=>selectProduct(product)}
                    >
                    Elegir
                    </Button>
                </CardFooter>
                </Card>

          

                ))
                


                
            }
        </div>


         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <form>
                            {/* <DialogTrigger asChild>
                                <Button className="w-full gap-2 text-xs sm:text-sm py-1 sm:py-2" 
                                onClick={()=>selectProduct(product)}
                                >
                                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Elegir
                                </Button>
                            </DialogTrigger> */}
                            <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{productSelect?.name}</DialogTitle>
                                <DialogDescription>
                                    {productSelect?.description}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                
                                {/* <div className="grid gap-3">
                                <Label htmlFor="username-1">Username</Label>
                                <Input id="username-1" name="username" defaultValue="@peduarte" />
                                </div> */}
                                <div className="gap-3 flex justify-between" >
                                <Label htmlFor="name-1">Cantidad</Label>
                                <div className="flex items-center justify-center">
                                    
                                    <Button type="button" onClick={removeQuantity}><Minus></Minus> </Button>
                                    <Label className="w-10 text-center items-center justify-center text-2xl">{quantity}</Label>
                                    {/* <Input id="obs-1" name="observation" defaultValue="" /> */}
                                    <Button type="button" onClick={addQuantity}><Plus></Plus> </Button>
                                </div>
                                
                                </div>

                                <div className="grid gap-3">
                                <Label htmlFor="name-1">Observacion</Label>
                                <Input id="obs-1" name="observation" defaultValue="" />
                                </div>
                            </div>
                            <DialogFooter>
                                {/* <DialogClose asChild> */}
                                <Button variant="outline" onClick={()=>setDialogOpen(false)}>Cancelar</Button>
                                {/* </DialogClose> */}
                                <Button onClick={()=>addOrder(productSelect || null)} > <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />Agregar</Button>
                            </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>

      
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