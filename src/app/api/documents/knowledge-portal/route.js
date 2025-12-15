import { NextResponse } from "next/server";

export async function POST() {
  try {
    const payload = {
      UserName: process.env.DOC_USERNAME,
      Password: process.env.DOC_PASSWORD,
      AccessCode: process.env.DOC_ACCESSCODE,
      DocumentType: "knowledge-portal",
    };

    const apiUrl = `${process.env.DOC_BASE_URL}/DocumentUpload/get-documents-by-type`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch documents error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
