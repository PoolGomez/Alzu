

import { Menu, X, ChefHat } from 'lucide-react';
import ButtonIn from './button-in';
// import { useSession } from "next-auth/react"

interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}
const Navbar = ({ isSidebarOpen, toggleSidebar,buttonRef }: NavbarProps) => {

  // const { data: session } = useSession()
  // if(session){
  //   return (
  //     <h1>Si hay usuario</h1>
  //   )
  // }else{
  //   return (<h1>No hay usuario</h1>)
  // }

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Alzu</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                ref={buttonRef}
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
  
            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <a href="#inicio" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Inicio
              </a>
              <a href="#nosotros" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Nosotros
              </a>
              <a href="#precios" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Precios
              </a>
              {/* <a href='/register' className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Comenzar Prueba Gratis
              </a> */}
              {/* {session ? (
                <a href='/login' className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Ingresar
              </a>
              ):(
              <a href='/register' className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Comenzar Prueba Gratis
              </a>
              )} */}

              <ButtonIn />
            </div>
          </div>
        </div>
      </nav>
      );
}

export default Navbar
