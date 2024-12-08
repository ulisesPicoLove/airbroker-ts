"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import signUp from "./action";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Debes de ingresar tu nombre completo."),
      email: Yup.string().email("Debes de ingresar un email valido.").required("Debes de ingresar tu email."),
      password: Yup.string()
        .required("Debes de ingresar tu contraseña.")
        .min(8, "Tu contraseña debe de tener minimo 8 caracteres")
        .max(75, "Tu contraseña debe de tener maximo 75 caracteres")
        .matches(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
        .matches(/[0-9]/, "La contraseña debe tener al menos un número")
        .matches(/[@$!%*?&]/, "La contraseña debe tener al menos un carácter especial"),
      confirmPassword: Yup.string().required("Debes de ingresar la confirmación de tu contraseña."),
      username: Yup.string().required("Debes de ingresar un username."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      if (values.password !== values.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        setLoading(false);
        return null;
      }
      try {
        const response = await signUp(values);

        if (!response.success) {
          setError(response.message);
        } else {
          router.push("login");
        }
      } catch (error) {
        console.error(error);
        setError("Ha ocurrido un error inesperado.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro de Usuario</CardTitle>
          <CardDescription>Crea tu cuenta para comenzar a usar nuestra plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Juan Pérez"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="example123"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
              />
            </div>
            {error !== null ? (
              <AlertDescription>
                <span className="text-sm text-red-500">*</span> {error}
              </AlertDescription>
            ) : null}
            {formik.touched.name && formik.errors.name ? (
              <AlertDescription>
                <span className="text-sm text-red-500">*</span> {formik.errors.name}
              </AlertDescription>
            ) : null}
            {formik.touched.username && formik.errors.username ? (
              <AlertDescription>
                <span className="text-sm text-red-500">*</span> {formik.errors.username}
              </AlertDescription>
            ) : null}
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
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <AlertDescription>
                <span className="text-sm text-red-500">*</span> {formik.errors.confirmPassword}
              </AlertDescription>
            ) : null}
            {!loading ? (
              <Button type="submit" className="w-full">
                Registrarse
              </Button>
            ) : (
              <Button className="w-full" disabled>
                <Loader2 className="animate-spin" />
                Creando cuenta
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
