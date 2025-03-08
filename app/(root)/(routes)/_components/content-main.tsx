"use client";
import { useEffect, useRef, useState } from "react";
import { Utensils, Users, BarChart3, Clock } from "lucide-react";
import Navbar from "@/components/navbar";
import SideBar from "@/components/sidebar";

const ContentMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        buttonRef={buttonRef}
      />
      <SideBar isOpen={isSidebarOpen} ref={sidebarRef} />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="inicio" className="relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Gestiona tu restaurante</span>
                <span className="block text-indigo-600">
                  de manera inteligente
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                La plataforma todo en uno para administrar pedidos, inventario,
                personal y más. Diseñada específicamente para restaurantes
                modernos.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Comenzar prueba gratuita
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="nosotros" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Todo lo que necesitas para tu restaurante
              </h2>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <Utensils className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Gestión de Pedidos
                </h3>
                <p className="mt-2 text-gray-500">
                  Control total de pedidos en tiempo real, tanto presenciales
                  como online.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Personal</h3>
                <p className="mt-2 text-gray-500">
                  Administra turnos, roles y rendimiento de tu equipo
                  fácilmente.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Análisis</h3>
                <p className="mt-2 text-gray-500">
                  Reportes detallados y métricas para tomar mejores decisiones.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Reservaciones
                </h3>
                <p className="mt-2 text-gray-500">
                  Sistema de reservas online integrado con tu calendario.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precios" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Planes que se adaptan a tu negocio
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Elige el plan que mejor se ajuste a las necesidades de tu
                restaurante
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="bg-gray-50 rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-900">Básico</h3>
                <p className="mt-4 text-gray-500">Para restaurantes pequeños</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $29
                  </span>
                  <span className="text-gray-500">/mes</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Hasta 100 pedidos/mes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Gestión básica de inventario</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Soporte por email</span>
                  </li>
                </ul>
                <button className="mt-8 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Comenzar ahora
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-indigo-600">
                <h3 className="text-xl font-semibold text-gray-900">
                  Profesional
                </h3>
                <p className="mt-4 text-gray-500">Para restaurantes medianos</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $79
                  </span>
                  <span className="text-gray-500">/mes</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Pedidos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Gestión avanzada de inventario</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Soporte prioritario 24/7</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Análisis avanzado</span>
                  </li>
                </ul>
                <button className="mt-8 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Comenzar ahora
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-gray-50 rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  Empresarial
                </h3>
                <p className="mt-4 text-gray-500">
                  Para cadenas de restaurantes
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $199
                  </span>
                  <span className="text-gray-500">/mes</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Todo lo del plan Pro</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Gerente de cuenta dedicado</span>
                  </li>
                </ul>
                <button className="mt-8 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Contactar ventas
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContentMain;
