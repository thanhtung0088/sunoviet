import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    // Gọi mô hình tạo nhạc trên Replicate (Ví dụ dùng MusicGen)
    const output = await replicate.run(
      "meta/musicgen:7be0f12c54a8d0336d07cd454655507340051756536066265715891319207851",
      {
        input: {
          prompt_a: prompt + " " + style,
          duration: 10
        }
      }
    );

    return NextResponse.json({ audioUrl: output });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi AI: " + error }, { status: 500 });
  }
}