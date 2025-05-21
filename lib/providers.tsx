'use client';

import { Category, Product, Room, Table } from '@prisma/client';
import { ReactNode, createContext, useContext, useState } from 'react';
// import { Order, OrderItem, Product, Room, Table } from '@/lib/types';
interface OrderItemContext {
    // id: string;
    // orderId: string;
    productId: string;
    product?: Product;
    quantity: number;
    price: number;
    notes?: string;
    // createdAt: Date;
    // updatedAt: Date;
}
  
interface OrderContext {
    // id: string;
    tableId: string;
    table?: Table;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    items: OrderItemContext[];
    total: number;
    notes?: string;
    waiter?: string;
    // createdAt: Date;
    // updatedAt: Date;
}

interface OrderContextType {
  currentOrder: OrderContext | null;
  selectedRoom: Room | null;
  selectedTable: Table | null;
  selectedCategory : Category | null; //??
  selectRoom: (room: Room | null) => void;
  selectTable: (table: Table | null) => void;
  selectCategory: (category: Category | null) => void; //??
  addToOrder: (product: Product, quantity: number, notes?: string) => void;
  removeFromOrder: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  updateItemNotes: (index: number, notes: string) => void;
  clearOrder: () => void;
  setWaiter: (name: string) => void;
  setOrderNotes: (notes: string) => void;
}

const OrderContext = createContext<OrderContextType>({} as OrderContextType);

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); //??
  const [currentOrder, setCurrentOrder] = useState<OrderContext | null>(null);

  const initializeOrder = (tableId: string) => {
    if (!currentOrder || currentOrder.tableId !== tableId) {
      setCurrentOrder({
        tableId,
        status: 'pending',
        items: [],
        total: 0,
        
      });
    }
  };

  const selectRoom = (room: Room | null) => {
    setSelectedRoom(room);
    setSelectedTable(null);
    setSelectedCategory(null); //??
    setCurrentOrder(null);
  };

  const selectTable = (table: Table | null) => {
    setSelectedTable(table);

    setSelectedCategory(null); //??
    setCurrentOrder(null); //??
    // if (table) {
    //   initializeOrder(table.id);
    // } else {
    //   setCurrentOrder(null);
    // }
  };

  const selectCategory = (category:Category | null) =>{
    setSelectedCategory(category);
    if (category) {
      initializeOrder(category.id);
    } else {
      setCurrentOrder(null);
    }
  }

  const addToOrder = (product: Product, quantity: number, notes?: string) => {
    if (!currentOrder) return;

    const newItem: OrderItemContext = {
      productId: product.id,
      product,
      quantity,
      price: product.price,
      notes,
    };

    // Check if product already exists in order
    const existingItemIndex = currentOrder.items.findIndex(
      (item) => item.productId === product.id && (item.notes || '') === (notes || '')
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      updatedItems = [...currentOrder.items, newItem];
    }

    // Recalculate total
    const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      total,
    });
  };

  const removeFromOrder = (index: number) => {
    if (!currentOrder) return;

    const updatedItems = [...currentOrder.items];
    updatedItems.splice(index, 1);

    // Recalculate total
    const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      total,
    });
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (!currentOrder) return;

    const updatedItems = [...currentOrder.items];
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      updatedItems.splice(index, 1);
    } else {
      updatedItems[index].quantity = quantity;
    }

    // Recalculate total
    const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      total,
    });
  };

  const updateItemNotes = (index: number, notes: string) => {
    if (!currentOrder) return;

    const updatedItems = [...currentOrder.items];
    updatedItems[index].notes = notes;

    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
    });
  };

  const clearOrder = () => {
    if (selectedTable) {
      setCurrentOrder({
        tableId: selectedTable.id,
        status: 'pending',
        items: [],
        total: 0,
      });
    } else {
      setCurrentOrder(null);
    }
  };

  const setWaiter = (name: string) => {
    if (!currentOrder) return;

    setCurrentOrder({
      ...currentOrder,
      waiter: name,
    });
  };

  const setOrderNotes = (notes: string) => {
    if (!currentOrder) return;

    setCurrentOrder({
      ...currentOrder,
      notes,
    });
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        selectedRoom,
        selectedTable,
        selectedCategory,
        selectRoom,
        selectTable,
        selectCategory,
        addToOrder,
        removeFromOrder,
        updateItemQuantity,
        updateItemNotes,
        clearOrder,
        setWaiter,
        setOrderNotes,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};