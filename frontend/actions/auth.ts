"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/zod";
import { auth } from "@/auth";

interface SingupData {
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
}

interface PasswordFormInput {
  currentPassword: string;
  newPassword: string;
  verifyPassword: string;
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

export async function updatePassword(data: PasswordFormInput) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { currentPassword, newPassword, verifyPassword } = data;

    if (!currentPassword || !newPassword || !verifyPassword) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    if (newPassword !== verifyPassword) {
      return {
        success: false,
        message: "New passwords do not match",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters long",
      };
    }

    // Get user to check current password
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return {
        success: false,
        message: "User not found or credentials not configured",
      };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Incorrect current password",
      };
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.log("Error while updating password:", error);
    return {
      success: false,
      message: "Something went wrong while updating password",
    };
  }
}
