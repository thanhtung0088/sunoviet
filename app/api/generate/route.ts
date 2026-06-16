import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, style, title, bpm, vocal } = body;

    // Ở đây sẽ là nơi tích hợp logic gọi API thực tế tới Suno
    // Thầy/Cô sử dụng process.env.SUNO_COOKIE để xác thực
    console.log("Nhận yêu cầu tạo nhạc từ giao diện:", { title, prompt, style });

    // Giả lập phản hồi thành công từ Server
    return NextResponse.json({ 
      success: true, 
      message: "Lệnh đã được nhận bởi Server!",
      data: { title, status: "queued" }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi Server" }, { status: 500 });
  }
}