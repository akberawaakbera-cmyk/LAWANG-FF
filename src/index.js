export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const json = (data, status = 200) =>
      Response.json(data, {
        status,
        headers: corsHeaders
      });

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // =====================================================
    // API TEST
    // =====================================================

    if (
      url.pathname === "/api/test" &&
      request.method === "GET"
    ) {
      return json({
        success: true,
        message: "API is working",
        project: "BUNER-FF",
        timestamp: new Date().toISOString()
      });
    }

    // =====================================================
    // HEALTH
    // =====================================================

    if (
      url.pathname === "/api/health" &&
      request.method === "GET"
    ) {
      return json({
        success: true,
        status: "online",
        project: "BUNER-FF"
      });
    }

    // =====================================================
    // DATABASE TEST
    // =====================================================

    if (
      url.pathname === "/api/db-test" &&
      request.method === "GET"
    ) {
      if (!env.DB) {
        return json({
          success: false,
          database: "not connected",
          error: "D1 binding DB not found."
        }, 500);
      }

      try {
        const result = await env.DB
          .prepare("SELECT 1 AS connected")
          .first();

        return json({
          success: true,
          database: "connected",
          result
        });

      } catch (error) {
        return json({
          success: false,
          database: "error",
          error: error.message
        }, 500);
      }
    }

    // =====================================================
    // KEY ACTIVATION
    // =====================================================

    if (
      url.pathname === "/api/keys/activate" &&
      request.method === "POST"
    ) {
      if (!env.DB) {
        return json({
          success: false,
          error: "Database not connected."
        }, 500);
      }

      try {
        const body = await request.json();

        const keyCode =
          typeof body.key_code === "string"
            ? body.key_code.trim()
            : "";

        const deviceId =
          typeof body.device_id === "string"
            ? body.device_id.trim()
            : "";

        if (!keyCode) {
          return json({
            success: false,
            error: "Key is required."
          }, 400);
        }

        if (!deviceId) {
          return json({
            success: false,
            error: "Device ID is required."
          }, 400);
        }

        // Find key
        const key = await env.DB
          .prepare(`
            SELECT
              id,
              key_code,
              device_id,
              status,
              expires_at,
              created_at,
              last_used_at
            FROM keys
            WHERE key_code = ?
            LIMIT 1
          `)
          .bind(keyCode)
          .first();

        if (!key) {
          return json({
            success: false,
            error: "Invalid key."
          }, 401);
        }

        // Check status
        if (key.status !== "active") {
          return json({
            success: false,
            error: "This key is disabled."
          }, 403);
        }

        // Check expiry
        if (key.expires_at) {
          const expiry =
            new Date(key.expires_at);

          if (
            Number.isNaN(expiry.getTime()) ||
            expiry.getTime() <= Date.now()
          ) {
            await env.DB
              .prepare(`
                UPDATE keys
                SET status = 'expired'
                WHERE id = ?
              `)
              .bind(key.id)
              .run();

            return json({
              success: false,
              error: "This key has expired."
            }, 403);
          }
        }

        // Device binding check
        if (
          key.device_id &&
          key.device_id !== deviceId
        ) {
          return json({
            success: false,
            error: "This key is already activated on another device."
          }, 403);
        }

        // First activation = bind device
        if (!key.device_id) {
          await env.DB
            .prepare(`
              UPDATE keys
              SET
                device_id = ?,
                last_used_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `)
            .bind(deviceId, key.id)
            .run();
        } else {
          await env.DB
            .prepare(`
              UPDATE keys
              SET last_used_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `)
            .bind(key.id)
            .run();
        }

        return json({
          success: true,
          message: "Key activated successfully.",
          key: {
            id: key.id,
            status: "active",
            expires_at: key.expires_at,
            device_bound: true
          }
        });

      } catch (error) {
        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =====================================================
    // KEY STATUS
    // =====================================================

    if (
      url.pathname === "/api/keys/status" &&
      request.method === "POST"
    ) {
      if (!env.DB) {
        return json({
          success: false,
          error: "Database not connected."
        }, 500);
      }

      try {
        const body = await request.json();

        const keyCode =
          typeof body.key_code === "string"
            ? body.key_code.trim()
            : "";

        const deviceId =
          typeof body.device_id === "string"
            ? body.device_id.trim()
            : "";

        if (!keyCode || !deviceId) {
          return json({
            success: false,
            error: "Key and device ID are required."
          }, 400);
        }

        const key = await env.DB
          .prepare(`
            SELECT
              id,
              key_code,
              device_id,
              status,
              expires_at,
              created_at,
              last_used_at
            FROM keys
            WHERE key_code = ?
            LIMIT 1
          `)
          .bind(keyCode)
          .first();

        if (!key) {
          return json({
            success: false,
            valid: false,
            error: "Invalid key."
          }, 401);
        }

        if (key.status !== "active") {
          return json({
            success: false,
            valid: false,
            error: "Key is not active.",
            status: key.status
          }, 403);
        }

        if (
          key.device_id &&
          key.device_id !== deviceId
        ) {
          return json({
            success: false,
            valid: false,
            error: "Device mismatch."
          }, 403);
        }

        if (key.expires_at) {
          const expiry =
            new Date(key.expires_at);

          if (
            Number.isNaN(expiry.getTime()) ||
            expiry.getTime() <= Date.now()
          ) {
            await env.DB
              .prepare(`
                UPDATE keys
                SET status = 'expired'
                WHERE id = ?
              `)
              .bind(key.id)
              .run();

            return json({
              success: false,
              valid: false,
              error: "Key expired."
            }, 403);
          }
        }

        await env.DB
          .prepare(`
            UPDATE keys
            SET last_used_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `)
          .bind(key.id)
          .run();

        return json({
          success: true,
          valid: true,
          status: "active",
          expires_at: key.expires_at
        });

      } catch (error) {
        return json({
          success: false,
          valid: false,
          error: error.message
        }, 500);
      }
    }

    // =====================================================
    // LIST KEYS
    // =====================================================

    if (
      url.pathname === "/api/keys" &&
      request.method === "GET"
    ) {
      if (!env.DB) {
        return json({
          success: false,
          error: "Database not connected."
        }, 500);
      }

      try {
        const result = await env.DB
          .prepare(`
            SELECT
              id,
              key_code,
              device_id,
              status,
              expires_at,
              created_at,
              last_used_at
            FROM keys
            ORDER BY id DESC
          `)
          .all();

        return json({
          success: true,
          keys: result.results || []
        });

      } catch (error) {
        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =====================================================
    // UNKNOWN API
    // =====================================================

    if (url.pathname.startsWith("/api/")) {
      return json({
        success: false,
        error: "API route not found."
      }, 404);
    }

    // =====================================================
    // STATIC WEBSITE
    // =====================================================

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