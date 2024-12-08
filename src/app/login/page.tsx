"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Debes de ingresar un email valido.").required("Debes de ingresar tu email."),
      password: Yup.string()
        .required("Debes de ingresar tu contraseña.")
        .min(8, "Tu contraseña debe de tener minimo 8 caracteres")
        .max(75, "Tu contraseña debe de tener maximo 75 caracteres")
        .matches(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
        .matches(/[0-9]/, "La contraseña debe tener al menos un número")
        .matches(/[@$!%*?&]/, "La contraseña debe tener al menos un carácter especial"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      try {
        signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: true,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inicio de sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@ejemplo.com"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {formik.touched.email && formik.errors.email ? (
              <AlertDescription>
                <span className="text-sm text-red-500">*</span> {formik.errors.email}
              </AlertDescription>
            ) : null}
            {formik.touched.password && formik.errors.password ? (
              <AlertDescription>
                <span className="text-sm text-red-500">*</span> {formik.errors.password}
              </AlertDescription>
            ) : null}
            {!loading ? (
              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
            ) : (
              <Button className="w-full" disabled>
                <Loader2 className="animate-spin" />
                Iniciando sesion
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Todavía no tienes una cuenta?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Crear cuenta
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
