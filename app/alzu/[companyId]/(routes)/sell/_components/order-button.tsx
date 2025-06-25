"use client"
import { deleteOrderItemByIdAction } from "@/actions/order-action";
import { addQuantityOrderItemByIdAction, removeQuantityOrderItemByIdAction } from "@/actions/sell-actions";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format-price";
// import { useOrder } from "@/lib/providers";
import { OrderItemWithProduct } from "@/types-db";
import { Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import { useEffect, useState } from "react";

const OrderButton = ({data,companyId}:{data: OrderItemWithProduct[], companyId: string}) => {
    // const { selectedRoom, selectedTable } = useOrder();
    const [open, setOpen] = useState(false);

    const [orders, setOrders] = useState<OrderItemWithProduct[]>([])
    const [total, setTotal] = useState(0)

    const [isMounted, setIsMounted] = useState(false)
        useEffect(()=>{
            setIsMounted(true)
        },[])

        useEffect(()=>{
            console.log("orders:", data)
            setOrders(data)

        },[data])

        useEffect (()=>{
            setTotal(orders.reduce((accumulator, item) => {
                return accumulator + (item.quantity * item.price);
            }, 0));
            // calcularTotal(orders);
        },[orders])
    
        if(!isMounted){
            return null
        }

        const deleteOrder = async(orderId: string) =>{

            await deleteOrderItemByIdAction(orderId, companyId);
            setOrders(orders.filter(item => item.id !== orderId))

            calcularTotal(orders)
        }

        const calcularTotal = (datos: OrderItemWithProduct[]) => {
            setTotal(datos.reduce((accumulator, item) => {
                return accumulator + (item.quantity * item.price);
            }, 0));
        }


    const addQuantity = async (order: OrderItemWithProduct) => {
        await addQuantityOrderItemByIdAction(order.id, companyId);

        const ordersUpdate = orders.map((item:OrderItemWithProduct)=>{
            if(item.id=== order.id){
                item.quantity++
                return item;
            };
            return item;
        })
        setOrders(ordersUpdate as OrderItemWithProduct[]);

    }
    const removeQuantity = async (order: OrderItemWithProduct) => {
        await removeQuantityOrderItemByIdAction(order.id, companyId);

        const ordersUpdate = orders.map((item:OrderItemWithProduct)=>{
            if(item.id=== order.id){
                item.quantity--
                return item;
            };
            return item;
        })
        setOrders(ordersUpdate as OrderItemWithProduct[]);
    }

  return (
    <>
    <Modal 
        title="Orden" 
        description="Detalle de la orden"
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        {/* <div >

        
        <p>Room: {selectedRoom?.name}</p>
        <p>Table: {selectedTable?.name}</p>
        
        {orders.map((order)=>(
            <div key={order.id} className="flex items-center justify-between">
                <span>{order.product.name}</span> <span> {order.quantity}</span> <span> {formatPrice(order.price)}</span> <span> {formatPrice(order.price * order.quantity) }</span><Trash className="w-4 h-4 cursor-pointer" onClick={()=>deleteOrder(order.id)}/>
            </div>
        ))} */}


        <div className="">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">Tu carrito está vacío.</p>
          ) : (
            <ul className="space-y-2">
              {orders.map((order) => (
                <li key={order.id} className="border-b border-gray-400 pb-2">
                    {/* <h4 className="text-lg font-medium">{order.product.name}</h4> */}
                    <div className="flex items-center justify-between">
                        <Label className="w-full text-left text-lg py-4">{order.product.name}</Label>
                        <Trash className="w-4 h-4 cursor-pointer text-red-500" onClick={()=>deleteOrder(order.id)}/>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex">
                            <Button variant={"outline"} onClick={()=>removeQuantity(order)}><Minus className="h-3 w-3 sm:h-4 sm:w-4"></Minus></Button>
                            <Label className="w-10 text-center items-center justify-center text-lg">{order.quantity}</Label>
                            <Button variant={"outline"} onClick={()=>addQuantity(order)}><Plus className="h-3 w-3 sm:h-4 sm:w-4"></Plus></Button>
                        </div>
                        {/* <span>{order.quantity}</span> */}
                        {/* <span>{formatPrice(order.price * order.quantity)}</span> */}
                        <Label className="w-30 text-center items-center justify-center text-lg">{formatPrice(order.price * order.quantity)}</Label>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between ">
            <Label className="text-center items-center justify-center text-lg">Total:</Label>
            <Label className="w-50 text-center items-center justify-center text-2xl font-bold">{formatPrice(total)}</Label>
        </div>
        {/* <h3 className="text-xl font-bold mb-4">Total: $999.00</h3> */}

          <Button>
            Enviar
          </Button>


            <Button 
            // disabled={loading} 
            variant={"destructive"} 
            onClick={() => setOpen(false)}>
                Cerrar
            </Button>
        {/* </div> */}

    </Modal>
    <Button className="h-8 w-8 " onClick={()=>setOpen(true)} >
        <ShoppingCart className="h-4 w-4"  />
    </Button>
    </>
    
  )
}

export default OrderButton
