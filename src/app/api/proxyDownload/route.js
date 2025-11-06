import { NextResponse } from "next/server";
import https from "https";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const jwtToken = req.headers.get("authorization");

    if (!jwtToken) {
      return new NextResponse("Authorization header missing", { status: 400 });
    }

    const backendRes = await fetch(`${BASE_URL}/reports/downloadreports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
        "Accept-Encoding": "identity", // disable gzip to avoid chunk cutoff
      },
      agent: new https.Agent({ rejectUnauthorized: false }), // temporary
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text().catch(() => "");
      console.error("Backend error:", backendRes.status, errorText);
      return new NextResponse(`Backend error`, { status: backendRes.status });
    }

    // ✅ SAFE READ STREAM IN CHUNKS WITHOUT FAILING ON EARLY CLOSE
    const reader = backendRes.body.getReader();
    const chunks = [];

    while (true) {
      const { value, done } = await reader.read().catch(() => ({ done: true }));
      if (done) break;
      if (value) chunks.push(value);
    }

    // Merge chunks into one buffer
    const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));

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
    console.error("Fatal Proxy Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import fetch from "node-fetch";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const jwtToken = req.headers.get("authorization");

//     if (!jwtToken) {
//       console.error("JWT token missing in headers");
//       return new NextResponse("Authorization header missing", { status: 400 });
//     }

//     const backendRes = await fetch(`${BASE_URL}/reports/downloadreports`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: jwtToken,
//       },
//       body: JSON.stringify(body),
//     });

//     if (!backendRes.ok) {
//       const text = await backendRes.text();
//       console.error("Backend responded with error:", backendRes.status, text);
//       return new NextResponse(`Backend error: ${backendRes.status}`, {
//         status: backendRes.status,
//       });
//     }

//     const arrayBuffer = await backendRes.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     return new NextResponse(buffer, {
//       status: 200,
//       headers: {
//         "Content-Type":
//           backendRes.headers.get("content-type") || "application/octet-stream",
//         "Content-Disposition":
//           backendRes.headers.get("content-disposition") ||
//           'attachment; filename="report.csv"',
//       },
//     });
//   } catch (error) {
//     console.error("Proxy streaming error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
