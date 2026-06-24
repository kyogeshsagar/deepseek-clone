import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";

    if (!client) {
      return NextResponse.json({
        reply: `I am running in fallback mode. You said: ${lastUserMessage}`,
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are DeepSeek, a concise and helpful AI assistant.",
        },
        ...messages,
      ],
    });

    return NextResponse.json({
      reply: completion.choices?.[0]?.message?.content || "No response generated.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || "Failed to generate a response.",
      },
      { status: 500 }
    );
  }
}