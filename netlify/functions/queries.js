exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { name, email, product, category, details } = data;

    // 🔹 Log a readable entry
    console.log("QUERY:", JSON.stringify({name, email, product, category, details: details.substring(0,100)}));
    console.log("New query received:", {
      name,
      email,
      product,
      category,
      details: details?.slice(0, 200) // truncate long text
    });

    if (!name || !email || !product || !details) {
      console.log("Validation failed for:", data);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing required fields" })
      };
    }
    const response = {
      success: true,
      message: "Query received! Check Netlify logs.",
      data: {name, email, product, category}  // ← See this in browser dev tools
    };
    const response = {
      success: true,
      message: "Query submitted successfully! We'll respond within 24h.",
      timestamp: new Date().toISOString()
    };

    console.log("Query accepted:", { email, product, category });

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server error" })
    };
  }
};
