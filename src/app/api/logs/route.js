// app/api/logs/route.js
import axios from "axios";

export async function POST(request) {
  const LOKI_URL = process.env.LOKI_URL;
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
          job: "nra",
          level: level.toLowerCase(), // Loki likes lowercase levels
          // action_type: action || "unknown",
        },
        values: [[nanoTimestamp, logContent]],
      };
    });

    // 3. Send ONE request to Loki containing ALL log streams
    const response = await axios.post(
      `${LOKI_URL}/v1/push`,

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
