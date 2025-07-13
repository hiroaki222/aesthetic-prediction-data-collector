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
  redirect("/");
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
