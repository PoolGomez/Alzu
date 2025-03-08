"use client"
import { forwardRef } from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 md:hidden`}
    >
      <div className="flex flex-col h-full pt-20">
        <a
          href="#inicio"
          className="px-6 py-4 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          Inicio
        </a>
        <a
          href="#nosotros"
          className="px-6 py-4 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          Nosotros
        </a>
        <a
          href="#precios"
          className="px-6 py-4 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          Precios
        </a>
        <div className="px-6 py-4">
          <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
            Comenzar Prueba Gratis
          </button>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;