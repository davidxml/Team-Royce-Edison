import { supabase } from "@/lib/supabase";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const headerList = await headers();
  const payload = await req.text();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: WebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": headerList.get("svix-id")!,
      "svix-timestamp": headerList.get("svix-timestamp")!,
      "svix-signature": headerList.get("svix-signature")!,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }

  console.log(event)

  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    const { error, data:x } = await supabase.from("profiles").upsert({
      clerk_id: data.id,
      email: data.email_addresses[0].email_address,
      full_name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
      avatar_url: data.image_url
    });

    console.log(error,x)
  }

  if (type === "user.deleted") {
    await supabase
      .from("profiles")
      .delete()
      .eq("clerk_id", data.id);
  }

  return new Response("OK");
}