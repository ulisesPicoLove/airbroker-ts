import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function MainHero() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-primary to-primary-foreground text-primary-foreground">
      <div className="mx-auto min-h-[100dvh] content-around px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Automatiza tus tareas y multiplica tu productividad con Ai-rbroker
            </h1>
            <p className="text-xl">
              Simplifica tu trabajo, ahorra tiempo y aumenta tus ingresos con nuestra plataforma de
              automatización diseñada específicamente para brokers de seguros.
            </p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Características principales:</h2>
              <ul className="space-y-2">
                {[
                  "Gestión automatizada de pólizas",
                  "Seguimiento de reclamaciones en tiempo real",
                  "Generación de informes con un clic",
                  "Integración con múltiples aseguradoras",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Link href={"/signup"}>
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Comienza tu prueba gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="https://g-ber4sodlezp.vusercontent.net/placeholder.svg"
              alt="Dashboard de la aplicación"
              className="rounded-lg shadow-xl"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
