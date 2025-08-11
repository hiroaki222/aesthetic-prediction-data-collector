"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "./server";
import { ProfileData } from "@/types/profile";
import { AnnotationTasks, UserTasks } from "@/types/annotation";
import { AuthUser } from "@/types/auth";

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

export async function fetchUser(key?: keyof AuthUser): Promise<string> {
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
    return "error: User not authenticated";
  }

  if (!user) {
    return "error: userdata is null";
  }

  if (!key) {
    return "error: key is required";
  }

  const value = user[key];
  if (value === undefined || value === null) {
    return "error: value is undefined or null";
  }

  return String(value);
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

export async function fetchUserTasks(uuid: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user-annotation-data")
    .select("*")
    .eq("uuid", uuid);

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  const reload = await makeUserAnnotationTasks(uuid, data);
  if (reload) {
    return fetchUserTasks(uuid);
  }

  return data;
}

export async function fetchTasks() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("annotation-tasks").select("*");

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data;
}

export async function makeUserAnnotationTasks(
  uuid: string,
  userTasks: UserTasks[]
): Promise<boolean> {
  const annotationTasks: AnnotationTasks[] = await fetchTasks();

  const userTaskIds = new Set(userTasks.map((task) => task.task_id));
  const deficiencyAnnotationTasks = annotationTasks.filter(
    (task) => !userTaskIds.has(task.task_id)
  );
  if (deficiencyAnnotationTasks.length === 0) {
    return false;
  }

  const insertTasks = [];
  for (const task of deficiencyAnnotationTasks) {
    insertTasks.push({
      uuid: uuid,
      task_id: task.task_id,
      data: task.data,
      step: 0,
    });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user-annotation-data")
    .insert(insertTasks)
    .select();

  if (error) {
    console.error("Error inserting user annotation tasks:", error);
    return false;
  }
  return false;
}
