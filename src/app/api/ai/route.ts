import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );

    return NextResponse.json({ suggestion: response.data.candidates[0].content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI suggestion" }, { status: 500 });
  }
}
