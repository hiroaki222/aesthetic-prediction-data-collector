import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, subject, message } = body;
  try {
    /* const response = await resend.emails.send({
      from: "contact@apdc.ai",
      to: "hiroaki.takahara@jaist.ac.jp",
      subject: "contact: " + subject,
      text: `name: ${name}\nAddress: ${email}\n\nmessage:\n${message}`,
    }); */

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "hiroaki.takahara.222@gmail.com",
      subject: "contact: " + subject,
      text: `name: ${name}\nAddress: ${email}\n\nmessage:\n${message}`,
    });
    if (response.error) {
      throw new Error(response.error.message);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send email failed", error);
    return NextResponse.json({
      success: false,
      error: "Failed to send email",
    });
  }
}
