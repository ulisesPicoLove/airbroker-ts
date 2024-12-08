"use server";
import { connectMongo } from "@/lib/db/mongoose";
import User from "@/lib/models/user";
import { apiAirsite } from "@/lib/api";

type SignUpData = {
  name: string;
  confirmPassword: string;
  password: string;
  email: string;
  username: string;
};

const signUp = async ({ name, confirmPassword, password, email, username }: SignUpData) => {
  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: "Todos los campos son obligatorios." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Las contraseñas no coinciden." };
  }
  try {
    await connectMongo();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return { success: false, message: "El usuario ya existe." };
    }

    const user = new User({
      email: email,
      name: name,
      password: password,
      username: username,
    });

    await user.save();

    const response = await apiAirsite.post("/signup", {
      username: username,
      password: password,
      company_name: "Company Inc.",
      profile_image_url: "https://example.com/image.jpg",
      banner_image_url: "https://example.com/image.jpg",
      email: email,
    });

    if (response.status !== 201 && response.status !== 200) {
      User.findOneAndDelete({
        email: "email",
      });
    }

    return { success: true, message: "Usuario creado con éxito" };
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return { success: false, message: "Error al crear el usuario. Inténtalo de nuevo." };
  }
};

export default signUp;
