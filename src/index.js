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

    // =========================
    // HEALTH
    // =========================

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

    // =========================
    // DATABASE TEST
    // =========================

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
        await env.DB
          .prepare("SELECT 1 AS connected")
          .first();

        return json({
          success: true,
          database: "connected"
        });

      } catch (error) {
        return json({
          success: false,
          database: "error",
          error: error.message
        }, 500);
      }
    }

    // =========================
    // API TEST
    // =========================

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

    // =========================
    // KEY ACTIVATION
    // =========================

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
          String(body.key_code || "").trim();

        const deviceId =
          String(body.device_id || "").trim();

        if (!keyCode || !deviceId) {
          return json({
            success: false,
            status: "invalid_request",
            message: "key_code and device_id are required."
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
            status: "invalid_key",
            message: "Invalid key."
          }, 404);
        }

        if (key.status !== "active") {
          return json({
            success: false,
            status: "disabled",
            message: "This key is disabled."
          }, 403);
        }

        if (key.expires_at) {
          const expiresAt =
            new Date(key.expires_at).getTime();

          if (
            Number.isFinite(expiresAt) &&
            expiresAt <= Date.now()
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
              status: "expired",
              message: "This key has expired."
            }, 403);
          }
        }

        // Existing device binding
        if (
          key.device_id &&
          key.device_id !== deviceId
        ) {
          return json({
            success: false,
            status: "device_mismatch",
            message: "This key is already bound to another device."
          }, 403);
        }

        // First activation / same device
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

        return json({
          success: true,
          status: "activated",
          message: "Key activated successfully.",
          key: {
            id: key.id,
            key_code: key.key_code,
            status: "active",
            device_id: deviceId,
            expires_at: key.expires_at
          }
        });

      } catch (error) {
        return json({
          success: false,
          status: "server_error",
          error: error.message
        }, 500);
      }
    }

    // =========================
    // LIST KEYS
    // =========================

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

    // =========================
    // RESET KEY DEVICE
    // =========================

    if (
      url.pathname === "/api/keys/reset" &&
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
          String(body.key_code || "").trim();

        if (!keyCode) {
          return json({
            success: false,
            message: "key_code is required."
          }, 400);
        }

        const result = await env.DB
          .prepare(`
            UPDATE keys
            SET
              device_id = NULL,
              last_used_at = NULL
            WHERE key_code = ?
          `)
          .bind(keyCode)
          .run();

        if (!result.meta.changes) {
          return json({
            success: false,
            message: "Key not found."
          }, 404);
        }

        return json({
          success: true,
          status: "reset",
          message: "Device binding has been reset."
        });

      } catch (error) {
        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================
    // ENABLE / DISABLE KEY
    // =========================

    if (
      url.pathname.match(/^\/api\/keys\/\d+\/status$/) &&
      request.method === "PUT"
    ) {
      if (!env.DB) {
        return json({
          success: false,
          error: "Database not connected."
        }, 500);
      }

      try {
        const id =
          url.pathname.split("/")[3];

        const body = await request.json();

        const status =
          body.status === "active"
            ? "active"
            : body.status === "disabled"
              ? "disabled"
              : null;

        if (!status) {
          return json({
            success: false,
            message: "status must be active or disabled."
          }, 400);
        }

        const result = await env.DB
          .prepare(`
            UPDATE keys
            SET status = ?
            WHERE id = ?
          `)
          .bind(status, id)
          .run();

        if (!result.meta.changes) {
          return json({
            success: false,
            message: "Key not found."
          }, 404);
        }

        return json({
          success: true,
          status,
          message:
            status === "active"
              ? "Key enabled."
              : "Key disabled."
        });

      } catch (error) {
        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =========================
    // UNKNOWN API
    // =========================

    if (url.pathname.startsWith("/api/")) {
      return json({
        success: false,
        error: "API route not found."
      }, 404);
    }

    // =========================
    // STATIC ASSETS
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