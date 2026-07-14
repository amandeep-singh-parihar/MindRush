"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/zod";

interface SingupData {
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
}

export async function signUpUser(data: SingupData) {
  try {
    // Validate inputs
    const parsedData = signUpSchema.safeParse(data);
    if (!parsedData.success) {
      return {
        success: false,
        message: parsedData.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { name, email, password } = parsedData.data;
    const formattedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: formattedEmail,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    // new user
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: formattedEmail,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.log("Error while signing up: ", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateProfileName(data: User) {
  try {
    const { name, email } = data;

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: name,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.log("Error while updating the profile", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
