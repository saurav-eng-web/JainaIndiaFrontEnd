import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const documentUrl = searchParams.get("url");

    if (!documentUrl) {
      return NextResponse.json({ error: "Document URL missing" }, { status: 400 });
    }

    const backendUrl =
      `${process.env.DOC_BASE_URL}/DocumentUpload/download` +
      `?documentUrl=${encodeURIComponent(documentUrl)}`;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // If BE later adds auth, add it here
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "Download failed", detail: text },
        { status: res.status }
      );
    }

    // Pass file stream directly
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition":
          res.headers.get("content-disposition") || 'attachment; filename="file"',
      },
    });
  } catch (err) {
    console.error("Proxy download error:", err);
    return NextResponse.json({ error: "Internal download error" }, { status: 500 });
  }
}
