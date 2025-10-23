import { NextResponse } from "next/server";
import fetch from "node-fetch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const jwtToken = req.headers.get("authorization");

    if (!jwtToken) {
      console.error("JWT token missing in headers");
      return new NextResponse("Authorization header missing", { status: 400 });
    }

    console.log("Request body:", body);
    console.log("JWT token received:", jwtToken.slice(0, 10) + "...");

    const backendRes = await fetch(`${BASE_URL}/reports/downloadreports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      console.error("Backend responded with error:", backendRes.status, text);
      return new NextResponse(`Backend error: ${backendRes.status}`, {
        status: backendRes.status,
      });
    }

    const arrayBuffer = await backendRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          backendRes.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition":
          backendRes.headers.get("content-disposition") ||
          'attachment; filename="report.csv"',
      },
    });
  } catch (error) {
    console.error("Proxy streaming error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
