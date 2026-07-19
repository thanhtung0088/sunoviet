import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { prompt, style, title, bpm } = await req.json();

    // Ghép mô tả nhạc: MusicGen chỉ hiểu mô tả phong cách/nhạc cụ bằng tiếng Anh,
    // không tạo được giọng hát theo lời — xem ghi chú ở cuối file.
    const musicDescription = [style, title, bpm ? `${bpm} bpm` : null]
      .filter(Boolean)
      .join(', ');

    const output = await replicate.run(
      "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
      {
        input: {
          prompt: musicDescription || prompt,
          model_version: "stereo-large",
          duration: 30,
          output_format: "mp3",
        }
      }
    );

    return NextResponse.json({ audioUrl: output });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi AI: " + error }, { status: 500 });
  }
}