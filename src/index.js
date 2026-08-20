export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // =========================
    // API TEST
    // =========================

    if (
      url.pathname === "/api/test" &&
      request.method === "GET"
    ) {
      return Response.json(
        {
          success: true,
          message: "API is working",
          project: "BUNER-FF",
          timestamp: new Date().toISOString()
        },
        { headers: corsHeaders }
      );
    }

    // =========================
    // HEALTH
    // =========================

    if (
      url.pathname === "/api/health" &&
      request.method === "GET"
    ) {
      return Response.json(
        {
          success: true,
          status: "online",
          project: "BUNER-FF"
        },
        { headers: corsHeaders }
      );
    }

    // =========================
    // DATABASE TEST
    // =========================

    if (
      url.pathname === "/api/db-test" &&
      request.method === "GET"
    ) {
      if (!env.DB) {
        return Response.json(
          {
            success: false,
            database: "not connected",
            error: "D1 binding DB not found."
          },
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }

      try {
        const result = await env.DB
          .prepare("SELECT 1 AS connected")
          .first();

        return Response.json(
          {
            success: true,
            database: "connected",
            result
          },
          { headers: corsHeaders }
        );

      } catch (error) {
        return Response.json(
          {
            success: false,
            database: "error",
            error: error.message
          },
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }
    }

    // =========================
    // UNKNOWN API
    // =========================

    if (url.pathname.startsWith("/api/")) {
      return Response.json(
        {
          success: false,
          error: "API route not found."
        },
        {
          status: 404,
          headers: corsHeaders
        }
      );
    }

    // =========================
    // STATIC WEBSITE
    // =========================

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response(
      "BUNER-FF Worker is running, but Assets are not configured.",
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=UTF-8"
        }
      }
    );
  }
};