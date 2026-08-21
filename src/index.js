export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    const json = (data, status = 200) =>
      Response.json(data, {
        status,
        headers: corsHeaders
      });

    // =====================================================
    // CORS
    // =====================================================

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // =====================================================
    // ADMIN AUTH
    // =====================================================

    function isAdmin(request) {
      const auth = request.headers.get("Authorization") || "";

      if (!env.ADMIN_TOKEN) {
        return false;
      }

      return auth === `Bearer ${env.ADMIN_TOKEN}`;
    }

    function requireAdmin() {
      if (!env.ADMIN_TOKEN) {
        return json({
          success: false,
          error: "ADMIN_TOKEN is not configured in Worker secrets."
        }, 500);
      }

      return null;
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
        project: "LAWANGEN",
        service: "INJECTOR"
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
        project: "LAWANGEN",
        timestamp: new Date().toISOString()
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

    // =====================================================
    // USER: ACTIVATE KEY
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

        const keyCode = String(
          body.key_code ||
          body.key ||
          ""
        ).trim();

        const deviceId = String(
          body.device_id ||
          ""
        ).trim();

        if (!keyCode || !deviceId) {
          return json({
            success: false,
            status: "invalid_request",
            error: "key_code and device_id are required."
          }, 400);
        }

        const key = await env.DB
          .prepare(`
            SELECT
              id,
              key_code,
              device_id,
              status,
              role,
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
            error: "Invalid activation key."
          }, 404);
        }

        if (key.status !== "active") {
          return json({
            success: false,
            status: key.status,
            error: `This key is ${key.status}.`
          }, 403);
        }

        // =================================================
        // EXPIRY
        // =================================================

        if (key.expires_at) {
          const expiry = new Date(
            key.expires_at
          ).getTime();

          if (
            Number.isFinite(expiry) &&
            expiry <= Date.now()
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
              error: "This key has expired."
            }, 403);
          }
        }

        // =================================================
        // DEVICE CHECK
        // =================================================

        if (
          key.device_id &&
          key.device_id !== deviceId
        ) {
          return json({
            success: false,
            status: "device_mismatch",
            error: "This key is already activated on another device."
          }, 403);
        }

        // =================================================
        // BIND DEVICE
        // =================================================

        await env.DB
          .prepare(`
            UPDATE keys
            SET
              device_id = ?,
              last_used_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `)
          .bind(
            deviceId,
            key.id
          )
          .run();

        return json({
          success: true,
          status: "active",

          message: "Key activated successfully.",

          account: {
            role: key.role || "user"
          },

          key: {
            id: key.id,
            key_code: key.key_code,
            status: "active",
            role: key.role || "user",
            device_id: deviceId,
            expires_at: key.expires_at
          },

          expires_at: key.expires_at
        });

      } catch (error) {
        return json({
          success: false,
          status: "server_error",
          error: error.message
        }, 500);
      }
    }

    // =====================================================
    // USER: KEY STATUS
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

        const keyCode = String(
          body.key_code ||
          body.key ||
          ""
        ).trim();

        const deviceId = String(
          body.device_id ||
          ""
        ).trim();

        if (!keyCode || !deviceId) {
          return json({
            success: false,
            error: "key_code and device_id are required."
          }, 400);
        }

        const key = await env.DB
          .prepare(`
            SELECT
              id,
              key_code,
              device_id,
              status,
              role,
              expires_at
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
            error: "Key not found."
          }, 404);
        }

        if (
          key.device_id &&
          key.device_id !== deviceId
        ) {
          return json({
            success: false,
            status: "device_mismatch",
            error: "Key belongs to another device."
          }, 403);
        }

        // =================================================
        // EXPIRY
        // =================================================

        if (key.expires_at) {
          const expiry = new Date(
            key.expires_at
          ).getTime();

          if (
            Number.isFinite(expiry) &&
            expiry <= Date.now()
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
              success: true,
              status: "expired",
              role: key.role || "user",
              expires_at: key.expires_at
            });
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
          status: key.status,
          role: key.role || "user",
          expires_at: key.expires_at,
          device_id: key.device_id
        });

      } catch (error) {
        return json({
          success: false,
          error: error.message
        }, 500);
      }
    }

    // =====================================================
    // ADMIN: LIST KEYS
    // GET /api/admin/keys
    // =====================================================

    if (
      url.pathname === "/api/admin/keys" &&
      request.method === "GET"
    ) {
      const configError = requireAdmin();

      if (configError) return configError;

      if (!isAdmin(request)) {
        return json({
          success: false,
          error: "Unauthorized."
        }, 401);
      }

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
              role,
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
    // ADMIN: GENERATE KEY
    // POST /api/admin/keys/generate
    // =====================================================

    if (
      url.pathname === "/api/admin/keys/generate" &&
      request.method === "POST"
    ) {
      const configError = requireAdmin();

      if (configError) return configError;

      if (!isAdmin(request)) {
        return json({
          success: false,
          error: "Unauthorized."
        }, 401);
      }

      if (!env.DB) {
        return json({
          success: false,
          error: "Database not connected."
        }, 500);
      }

      try {
        const body = await request
          .json()
          .catch(() => ({}));

        const days = Number(
          body.days || 30
        );

        // Only these two roles are allowed.
        const role =
          body.role === "developer"
            ? "developer"
            : "user";

        if (
          !Number.isFinite(days) ||
          days < 1 ||
          days > 3650
        ) {
          return json({
            success: false,
            error: "days must be between 1 and 3650."
          }, 400);
        }

        // =================================================
        // RANDOM KEY
        // =================================================

        const bytes = new Uint8Array(12);

        crypto.getRandomValues(bytes);

        const randomPart = Array.from(bytes)
          .map(
            byte =>
              byte
                .toString(16)
                .padStart(2, "0")
          )
          .join("")
          .toUpperCase();

        const prefix =
          role === "developer"
            ? "LAWANGEN-DEV"
            : "LAWANGEN";

        const keyCode =
          `${prefix}-${randomPart}`;

        // =================================================
        // EXPIRY
        // =================================================

        const expiresAt = new Date(
          Date.now() +
          days *
          24 *
          60 *
          60 *
          1000
        ).toISOString();

        // =================================================
        // INSERT
        // =================================================

        const result = await env.DB
          .prepare(`
            INSERT INTO keys
            (
              key_code,
              device_id,
              status,
              role,
              expires_at
            )
            VALUES
            (?, NULL, 'active', ?, ?)
          `)
          .bind(
            keyCode,
            role,
            expiresAt
          )
          .run();

        return json({
          success: true,

          message:
            `${role} activation key generated.`,

          key: {
            id:
              result.meta?.last_row_id ||
              null,

            key_code:
              keyCode,

            role:
              role,

            status:
              "active",

            expires_at:
              expiresAt
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
    // ADMIN: ENABLE / DISABLE KEY
    // =====================================================

    const adminStatusMatch =
      url.pathname.match(
        /^\/api\/admin\/keys\/(\d+)\/status$/
      );

    if (
      adminStatusMatch &&
      request.method === "PUT"
    ) {
      const configError = requireAdmin();

      if (configError) return configError;

      if (!isAdmin(request)) {
        return json({
          success: false,
          error: "Unauthorized."
        }, 401);
      }

      if (!env.DB) {
        return json({
          success: false,
          error: "Database not connected."
        }, 500);
      }

      try {
        const id = adminStatusMatch[1];

        const body =
          await request.json();

        const status =
          body.status;

        if (
          status !== "active" &&
          status !== "disabled"
        ) {
          return json({
            success: false,
            error:
              "status must be active or disabled."
          }, 400);
        }

        const result =
          await env.DB
            .prepare(`
              UPDATE keys
              SET status = ?
              WHERE id = ?
            `)
            .bind(
              status,
              id
            )
            .run();

        if (
          !result.meta ||
          !result.meta.changes
        ) {
          return json({
            success: false,
            error: "Key not found."
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

    // =====================================================
    // ADMIN: RESET DEVICE
    // =====================================================

    const adminResetMatch =
      url.pathname.match(
        /^\/api\/admin\/keys\/(\d+)\/reset$/
      );

    if (
      adminResetMatch &&
      request.method === "POST"
    ) {
      const configError = requireAdmin();

      if (configError) return configError;

      if (!isAdmin(request)) {
        return json({
          success: false,
          error: "Unauthorized."
        }, 401);
      }

      if (!env.DB) {
        return json({
          success: false,
          error: "Database not connected."
        }, 500);
      }

      try {
        const id =
          adminResetMatch[1];

        const result =
          await env.DB
            .prepare(`
              UPDATE keys
              SET
                device_id = NULL,
                last_used_at = NULL
              WHERE id = ?
            `)
            .bind(id)
            .run();

        if (
          !result.meta ||
          !result.meta.changes
        ) {
          return json({
            success: false,
            error: "Key not found."
          }, 404);
        }

        return json({
          success: true,
          status: "reset",
          message:
            "Device binding has been reset."
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

    if (
      url.pathname.startsWith("/api/")
    ) {
      return json({
        success: false,
        error: "API route not found."
      }, 404);
    }

    // =====================================================
    // STATIC ASSETS
    // =====================================================

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response(
      "LAWANGEN Worker is running, but Assets are not configured.",
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );
  }
};