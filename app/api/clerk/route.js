import { Webhook } from "svix";
import connectDB from "@/app/config/db";
import User from "@/app/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Test route
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Webhook route working",
  });
}

export async function POST(req) {
  try {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      return NextResponse.json(
        { success: false, error: "SIGNING_SECRET is missing" },
        { status: 500 }
      );
    }

    const wh = new Webhook(SIGNING_SECRET);

    const headerPayload = await headers();

    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    if (
      !svixHeaders["svix-id"] ||
      !svixHeaders["svix-timestamp"] ||
      !svixHeaders["svix-signature"]
    ) {
      return NextResponse.json(
        { success: false, error: "Missing Svix headers" },
        { status: 400 }
      );
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const evt = wh.verify(body, svixHeaders);

    const { data, type } = evt;

    console.log("Webhook Event:", type);
    console.log("User ID:", data?.id);

    await connectDB();

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email:
            data.email_addresses?.[0]?.email_address ||
            "no-email@clerk.dev",
          image: data.image_url || "",
        };

        await User.findByIdAndUpdate(
          data.id,
          userData,
          { upsert: true, new: true }
        );

        console.log("User created:", userData);
        break;
      }

      case "user.updated": {
        const userData = {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email:
            data.email_addresses?.[0]?.email_address ||
            "no-email@clerk.dev",
          image: data.image_url || "",
        };

        await User.findByIdAndUpdate(
          data.id,
          userData,
          { new: true }
        );

        console.log("User updated:", data.id);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);

        console.log("User deleted:", data.id);
        break;
      }

      default:
        console.log("Unhandled event:", type);
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}