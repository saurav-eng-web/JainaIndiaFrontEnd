// app/api/logs/route.js
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();

    const logs = body.logs || [body];

    if (!logs || logs.length === 0) {
      return Response.json({ error: "No logs found" }, { status: 400 });
    }

    // 2. Convert ALL incoming logs into Loki "streams" format
    const lokiStreams = logs.map((log) => {
      const { level, message, action, user, meta = {}, ts } = log;

      // Generate nanosecond timestamp (Use the client timestamp 'ts' if available, else Date.now())
      const timestampTime = ts || Date.now();
      const nanoTimestamp = `${timestampTime}${String(
        Math.floor(Math.random() * 1000000)
      ).padStart(6, "0")}`;

      // Create the JSON content string
      const logContent = JSON.stringify({
        message,
        action,
        user: user || "anonymous",
        meta,
      });

      return {
        stream: {
          job: "crm-full",
          level: level.toLowerCase(), // Loki likes lowercase levels
          action_type: action || "unknown",
        },
        values: [[nanoTimestamp, logContent]],
      };
    });

    // 3. Send ONE request to Loki containing ALL log streams
    const response = await axios.post(
      "${LOKI_URL}/v1/push",
      // "http://192.168.47.24:3100/loki/api/v1/push",
      {
        streams: lokiStreams,
      },
      {
        timeout: 5000,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 204) {
      return Response.json({ success: true, count: logs.length }, { status: 200 });
    } else {
      console.error("Loki Error", response.data);
      return Response.json({ error: "Loki rejected" }, { status: 500 });
    }
  } catch (err) {
    console.error("Loki Push Failed:", err.message);
    return Response.json(
      { error: "Server Error", details: err.message },
      { status: 500 }
    );
  }
}

// // app/api/logs/route.js
// import axios from "axios";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { level, message, action, user, meta = {} } = body;

//     // Validate required fields
//     if (!level || !message || !action) {
//       return Response.json(
//         { error: "Missing required fields: level, message, action" },
//         { status: 400 }
//       );
//     }

//     // Generate nanosecond timestamp
//     const nanoTimestamp = `${Date.now()}${String(
//       Math.floor(Math.random() * 1000000)
//     ).padStart(6, "0")}`;

//     // 1. Prepare the actual log content (The dynamic data)
//     const logContent = JSON.stringify({
//       message,
//       action,
//       user: user || "anonymous",
//       meta,
//     });

//     const response = await axios.post(
//       "http://192.168.47.24:3100/loki/api/v1/push",
//       {
//         streams: [
//           {
//             // 2. Labels: KEEP THESE STATIC (Low Cardinality)
//             // Do not put unique IDs, messages, or user names here.
//             stream: {
//               job: "crm-full",
//               level: level.toLowerCase(),
//               action_type: action, // Only if 'action' has few variations (login, logout, etc)
//             },
//             // 3. Values: Must be [ "timestamp", "log line string" ]
//             values: [[nanoTimestamp, logContent]],
//           },
//         ],
//       },
//       {
//         timeout: 5000,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.status === 204) {
//       return Response.json({ success: true }, { status: 200 });
//     } else {
//       return Response.json(
//         { error: "Loki rejected log", status: response.status },
//         { status: 500 }
//       );
//     }
//   } catch (err) {
//     console.error("Loki push failed:", {
//       message: err.message,
//       status: err.response?.status,
//       data: err.response?.data,
//     });

//     return Response.json(
//       {
//         error: "Failed to send log",
//         details: err.message,
//       },
//       { status: 500 }
//     );
//   }
// }
