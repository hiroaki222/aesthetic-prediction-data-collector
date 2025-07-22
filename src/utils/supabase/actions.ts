"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "./server";
import { ProfileData } from "@/types/profile";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const code = error.status?.toString() || "400";
    const message = encodeURIComponent(error.message || "Failed to sign up");
    const description = encodeURIComponent(
      "The email address or password is incorrect."
    );

    redirect(`/error/${code}?message=${message}&description=${description}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    const code = error.status?.toString() || "401";
    const message = encodeURIComponent(error.message || "Failed to login");
    const description = encodeURIComponent(error.message.replace(/_/g, " "));

    redirect(`/error/${code}?message=${message}&description=${description}`);
  }

  // Revalidate home page cache
  revalidatePath("/");
  // Redirect to email verification page with correct type
  redirect(
    "/verify-email?email=" + encodeURIComponent(data.email) + "&type=signup"
  );
}

export async function signout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    const code = error.status?.toString() || "400";
    const message = encodeURIComponent(error.message || "Failed to sign out");
    const description = encodeURIComponent(error.message.replace(/_/g, " "));

    redirect(`/error/${code}?message=${message}&description=${description}`);
  }
  redirect("/");
}

export async function passwordResetEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/reset-password`,
  });

  if (error) {
    const code = error.status?.toString() || "400";
    const message = encodeURIComponent(
      error.message || "Failed to send reset email"
    );
    const description = encodeURIComponent(error.message.replace(/_/g, " "));

    redirect(`/error/${code}?message=${message}&description=${description}`);
  }

  revalidatePath("/", "layout");
  redirect(
    "/verify-email?email=" + encodeURIComponent(email) + "&type=password-reset"
  );
}

export async function resendVerificationEmail(
  email: string,
  type: "signup" | "password-reset"
) {
  if (!email || !type) {
    redirect(
      "/error/400?message=" +
        encodeURIComponent("Email is required") +
        "&description=" +
        encodeURIComponent(
          "Please provide an email address to resend the verification link."
        )
    );
  }

  const supabase = await createClient();

  switch (type) {
    case "signup": {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) {
        const code = error.status?.toString() || "400";
        const message = encodeURIComponent(
          error.message || "Failed to resend verification email"
        );
        const description = encodeURIComponent(
          error.message.replace(/_/g, " ")
        );
        redirect(
          `/error/${code}?message=${message}&description=${description}`
        );
      }
      break;
    }
    case "password-reset": {
      const formData = new FormData();
      formData.append("email", email);
      await passwordResetEmail(formData);
      break;
    }
  }
  return;
}

export async function saveUserProfile(ProfileData: ProfileData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user-data")
    .insert(ProfileData)
    .select();

  if (error) {
    const code = "400";
    const message = encodeURIComponent("Failed to save profile");
    const description = encodeURIComponent(error.message.replace(/_/g, " "));
    redirect(`/error/${code}?message=${message}&description=${description}`);
  }
}

export async function fetchUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    const code = "401";
    const message = encodeURIComponent("User not authenticated");
    const description = encodeURIComponent(error.message.replace(/_/g, " "));
    redirect(`/error/${code}?message=${message}&description=${description}`);
  }

  return user;
}

export async function fetchRole(uuid: string | undefined) {
  const supabase = await createClient();
  if (!uuid) {
    console.error("UUID is required to fetch user role");
    return false;
  }

  const { data, error } = await supabase
    .from("user-data")
    .select("role")
    .eq("uuid", uuid)
    .single();

  if (error) {
    console.error("Error fetching user role:", error);
    return false;
  }

  return data;
}

export async function fetchTasks() {
  const sampleTasks = [
    {
      id: "1",
      title: "Complete Project Setup",
      description:
        "Set up the initial project structure, configure development environment, and establish coding standards for the team.",
      image: "https://picsum.photos/300/200",
      progress: 0,
    },
    {
      id: "2",
      title: "Design System Implementation",
      description:
        "Create and implement a comprehensive design system including components, colors, typography, and spacing guidelines.",
      image: "https://picsum.photos/300/200?random=2",
      progress: 65,
    },
    {
      id: "3",
      title: "User Authentication Flow",
      description:
        "Implement secure user authentication including login, signup, password reset, and email verification features.",
      image: "https://picsum.photos/300/200?random=3",
      progress: 100,
    },
    {
      id: "4",
      title: "Database Schema Design",
      description:
        "Design and implement the database schema with proper relationships, indexes, and data validation rules.",
      image: "https://picsum.photos/300/200?random=4",
      progress: 0,
    },
    {
      id: "5",
      title: "API Development",
      description:
        "Build RESTful APIs with proper error handling, authentication, and documentation for frontend integration.",
      image: "https://picsum.photos/300/200?random=5",
      progress: 30,
    },
    {
      id: "6",
      title: "Mobile App Testing",
      description:
        "Comprehensive testing of mobile application across different devices and operating systems to ensure quality.",
      image: "https://picsum.photos/300/200?random=6",
      progress: 0,
    },
  ];

  const data = sampleTasks;
  return data;
}
