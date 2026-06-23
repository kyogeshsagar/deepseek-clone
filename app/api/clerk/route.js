import { Webhook } from "svix";
import connectDB from "@/app/config/db";
import User from "@/app/models/User";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req) {
    const wh = new Webhook(process.env.SIGNING_SECRET)
    const headerPayload = await headers()
    const svixHeaders = {
        "svix-id":headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-Signature":headerPayload.get("svix-Signature"),
    };

    // Get the payload and verify it

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const {data ,type} = wh.verify(body, svixHeaders)

    // Prepare the user data to be saved in the database

    const userData = {
        _id: data.id,
        email:data.email_addresses[0].email_addresses,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
    };

    await connectDB();

    switch (type) {
        case 'user.created':
            await User.create(userData)
        break;

         case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData)
        break;

         case 'user.deleted':
            await User.findByIdAndDelete(data.id)
        break;

        default:
            break;
    }

    return NextRequest.json({message: "Event received"});

}