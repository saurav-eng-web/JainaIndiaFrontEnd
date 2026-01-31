import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();

    // Add server-side secrets
    form.append("accessCode", process.env.DOC_ACCESSCODE);
    form.append("username", process.env.DOC_USERNAME);
    form.append("password", process.env.DOC_PASSWORD);
    const apiUrl = `${process.env.DOC_BASE_URL}/DocumentUpload/upload`;

    const res = await fetch(apiUrl, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Upload API Error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
