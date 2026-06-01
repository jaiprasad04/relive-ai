import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const fileBuffer = await response.arrayBuffer();
    
    // Generate standard filename
    const urlPath = new URL(fileUrl).pathname;
    const filename = urlPath.substring(urlPath.lastIndexOf("/") + 1) || "relive-video.mp4";

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Content-Type", response.headers.get("Content-Type") || "video/mp4");
    headers.set("Content-Length", fileBuffer.byteLength.toString());

    return new Response(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[DOWNLOAD API] Download failed:", error);
    return new Response(`Failed to download file: ${error.message}`, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
