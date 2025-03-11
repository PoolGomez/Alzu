import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function TimerButton({funcion}:{funcion: ()=>void}) {
  const [disabled, setDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleClick = () => {
    funcion()
    setDisabled(true);
    setTimeLeft(90); // Tiempo en segundos
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setDisabled(false);
    }
  }, [timeLeft]);

  return (
    <Button 
      onClick={handleClick} 
      disabled={disabled} 
      className={`px-4 py-2 rounded ${disabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
    >
      {disabled ? `Espera ${timeLeft}s` : "Hacer algo"}
    </Button>
  );
}
