import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { lyrics, style } = await req.json();

    // Gọi trực tiếp model MusicGen
    const output = await replicate.run(
      "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb4de93a4a88b7f3b07e5b5839218d6a894a974b9",
      {
        input: {
          prompt: `${style} ${lyrics}`,
          duration: 30,
        }
      }
    );

    return NextResponse.json({ url: output });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}