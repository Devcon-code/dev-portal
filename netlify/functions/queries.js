// netlify/functions/queries.js

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Log for debugging in Netlify function logs
    console.log('Query received:', formData);

    // You can add any non-email logic here later (logging, forwarding to a DB, etc.)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Query received by backend',
      }),
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }
};
