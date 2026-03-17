export async function POST() {
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "alloy",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Realtime session error:", text);

      return Response.json(
        { error: "Failed to create realtime session." },
        { status: 500 }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Realtime route error:", error);
    return Response.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}