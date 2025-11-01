// import axios from "axios";

// export async function POST(req) {
//   try {
//     const body = await req.text();
//     const params = new URLSearchParams(body);

//     const message = params.get("message");
//     const mobile = params.get("mobile");
//     const ticketKey = params.get("ticketKey");
//     const source = params.get("source") || "Welcome";

//     if (!message || !mobile) {
//       return new Response(
//         JSON.stringify({ error: "Missing required fields" }),
//         { status: 400 },
//       );
//     }

//     // Build the same URL your VB backend used
//     const SMS_GATEWAY_URL = `http://prpsms.co.in/API/SendMsg.aspx`;

//     const username = process.env.SMS_USERNAME;
//     const password = process.env.SMS_PASSWORD;
//     const senderId = process.env.SMS_SENDER || "GICARE";

//     console.log(
//       `🔴 api, username: ${username}, password: ${password}, senderID: ${senderId}`,
//     );

//     const fullUrl = `${SMS_GATEWAY_URL}?uname=${username}&pass=${password}&send=${senderId}&dest=${mobile}&msg=${encodeURIComponent(
//       message,
//     )}`;

//     // Call the SMS provider
//     const response = await axios.post(fullUrl, null, {
//       headers: { "User-Agent": "NextJS SMS Client" },
//       timeout: 10000,
//     });

//     // Ideally log to DB here — skipped for now
//     console.log(`SMS Sent [${mobile}]: ${message}`);

//     return new Response(
//       JSON.stringify({
//         success: true,
//         reference: response.data,
//         ticketKey,
//         source,
//       }),
//       { status: 200 },
//     );
//   } catch (err) {
//     console.error("SMS send failed:", err.message);
//     return new Response(
//       JSON.stringify({ success: false, error: err.message }),
//       { status: 500 },
//     );
//   }
// }
