import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/backend"; //"@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Clerk webhook request could not be verified");
    return;
  }
};

// define the webhook handler
const handlerClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);
  if (!event) return new Response("Could not validate Clerk payload", { status: 400 });

  switch (event.type) {
    case "user.created": {
      const user = await ctx.runQuery(internal.user.get, { clerkId: event.data.id });
      if (user) console.log(`Overwriting user ${event.data.id} with ${event.data}`);
      // intentional fallthrough
    }
    case "user.updated": {
      console.log("Creating/Updating User:", event.data.id);
      await ctx.runMutation(internal.user.crate, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        //username: event.data.username!,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });
      break;
    }
    case "user.deleted": {
      // Clerk docs say this is required, but the types say optional?
      await ctx.runMutation(internal.user.deleteUser, { clerkId: event.data.id! });
      break;
    }
    default: {
      console.log("Clerk webhook event not supported:", event.type);
    }
  }
  return new Response(null, { status: 200 });
});

// define the http router
const http = httpRouter();

// define the webhook route
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handlerClerkWebhook,
});

export default http;
