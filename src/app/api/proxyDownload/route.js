import https from "https";

import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const jwtToken = req.headers.get("authorization");

    if (!jwtToken) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BASE_URL}/reports/downloadreports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
        "Accept-Encoding": "identity",
      },
      agent: new https.Agent({ rejectUnauthorized: false }),
      body: JSON.stringify(body),
    });

    // ❌ Handle HTTP error codes directly
    if (!backendRes.ok) {
      const text = await backendRes.text().catch(() => "");
      return NextResponse.json(
        { error: "Failed to fetch report", detail: text },
        { status: backendRes.status }
      );
    }

    //  If backend sends JSON => treat as error
    const backendContentType = backendRes.headers.get("content-type");
    if (backendContentType?.includes("application/json")) {
      const json = await backendRes.json().catch(() => null);
      return NextResponse.json(
        {
          error: "Unable to download report",
          detail: json || "Backend returned JSON instead of file",
        },
        { status: 400 }
      );
    }

    //  Backend may return 200 but empty/no file
    if (!backendRes.body) {
      return NextResponse.json({ error: "No data available" }, { status: 400 });
    }

    //  Stream download safely
    const reader = backendRes.body.getReader();
    const chunks = [];

    while (true) {
      const { value, done } = await reader.read().catch(() => ({ done: true }));
      if (done) break;
      if (value) chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    const contentDisposition =
      backendRes.headers.get("content-disposition") ||
      'attachment; filename="report.xlsx"';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          backendRes.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("Fatal Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ---------------------------------v1----------------

// import https from "https";

// import { NextResponse } from "next/server";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const jwtToken = req.headers.get("authorization");

//     if (!jwtToken) {
//       return new NextResponse("Authorization header missing", { status: 400 });
//     }

//     const backendRes = await fetch(`${BASE_URL}/reports/downloadreports`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: jwtToken,
//         "Accept-Encoding": "identity", // disable gzip to avoid chunk cutoff
//       },
//       agent: new https.Agent({ rejectUnauthorized: false }), // temporary
//       body: JSON.stringify(body),
//     });

//     if (!backendRes.ok) {
//       const errorText = await backendRes.text().catch(() => "");
//       console.error("Backend error:", backendRes.status, errorText);
//       return new NextResponse(`Backend error`, { status: backendRes.status });
//     }

//     // ✅ SAFE READ STREAM IN CHUNKS WITHOUT FAILING ON EARLY CLOSE
//     const reader = backendRes.body.getReader();
//     const chunks = [];

//     while (true) {
//       const { value, done } = await reader.read().catch(() => ({ done: true }));
//       if (done) break;
//       if (value) chunks.push(value);
//     }

//     // Merge chunks into one buffer
//     const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));

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
//     console.error("Fatal Proxy Error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// ----------------------------------------------------------------------------

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
