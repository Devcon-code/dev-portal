exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { name, email, product, category, details } = data;

    // Basic validation
    if (!name || !email || !product || !details) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing required fields" })
      };
    }

    // In a real app you might store to a DB or send an email here.
    // For now, just echo back a success message with a timestamp.
    const response = {
      success: true,
      message: "Query submitted successfully! We'll respond within 24h.",
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    console.error("Function error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" })
    };
  }
};
