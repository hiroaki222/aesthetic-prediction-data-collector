import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const supabase_url = process.env.SUPABASE_URL as string;
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabase = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const generateSecurePassword = (length: number = 12): string => {
  const lowercase = "abcdefghijkmnpqrstuvwxyz";
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const allChars = lowercase + uppercase + numbers;

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += allChars.charAt(array[i] % allChars.length);
  }

  return password;
};

for (let i = 0; i <= 30; i++) {
  const mail: string = "guest" + i + "@apdc.invalid";
  const pw: string = generateSecurePassword(12);

  const { error } = await supabase.auth.admin.createUser({
    email: mail,
    password: pw,
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating user:", error.message);
  }

  try {
    const csvLine = `${mail},${pw}\n`;

    if (i === 0) {
      fs.writeFileSync("user_credentials.csv", "email,password\n");
    }

    fs.appendFileSync("user_credentials.csv", csvLine);
  } catch (err) {
    console.error("Error writing to CSV:", err);
  }
}
