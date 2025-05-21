"use client"
import { getAllCategoriesByCompanyIdAction } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/lib/providers";
import { Category } from "@prisma/client";
import { ChevronLeft, Coffee } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CategorySelector = ({companyId}:{companyId:string}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { selectCategory, selectTable } = useOrder();

    useEffect(() => {
        const fetchRooms = async () => {
          try {
            // const response = await getRoomsByCompanyIdAction("cm8q9d6060004wtcwg91gu9zx");
            const response = await getAllCategoriesByCompanyIdAction(companyId);
            setCategories(response);
            // if(response){
            //     setRooms(response);
            // }
            
          } catch (error) {
            console.error('Error fetching rooms:', error);
            toast.error('Failed to load categories. Please try again.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchRooms();
    }, [companyId]);

      const handleBackClick = () => {
        selectTable(null);
      };

      const handleSelectCategory = (category: Category) => {
          selectCategory(category);
        };


    if (loading) {
        return (
            <div className="space-y-4">
            <h2 className="text-2xl font-bold">Seleccione Categoria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-32 rounded-lg" />
                ))}
            </div>
            </div>
        );
        }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
        <div className='flex items-center gap-2'>
        <Button variant="outline" size="icon" 
        onClick={handleBackClick}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
            <h2 className="text-2xl font-bold">Seleccione Categoria</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category)=>(
                <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ring-2 ring-primary hover:border-green-500/50`}
                    // opacity-60 cursor-not-allowed
                    onClick={() => handleSelectCategory(category)}
                >
                    <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                    
                        <Coffee className="h-8 w-8 mb-2 text-green-500"/>    
                        
                        <p className="font-semibold text-lg">{category.name}</p>
                        <span className={`text-xs capitalize mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                        99 Productos
                    </span>
                    </CardContent>
            </Card>
            ))}
      </div>
    </div>
  )
}

export default CategorySelector
