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
      let database = "not connected";

      if (env.DB) {
        try {
          await env.DB
            .prepare("SELECT 1 AS connected")
            .first();

          database = "connected";
        } catch {
          database = "error";
        }
      }

      return json({
        success: true,
        message: "API is working",
        project: "BUNER-FF",
        database,
        timestamp: new Date().toISOString()
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
        return json(
          {
            success: false,
            database: "not connected",
            error: "D1 binding DB not found."
          },
          500
        );
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
        return json(
          {
            success: false,
            database: "error",
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // CREATE KEY
    // =========================

    if (
      url.pathname === "/api/keys" &&
      request.method === "POST"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        const body = await request.json();

        const keyCode =
          String(body.key_code || "").trim();

        const expiresAt =
          body.expires_at || null;

        if (!keyCode) {
          return json(
            {
              success: false,
              error: "key_code is required."
            },
            400
          );
        }

        const result = await env.DB
          .prepare(`
            INSERT INTO keys
            (key_code, status, expires_at)
            VALUES (?, 'active', ?)
          `)
          .bind(keyCode, expiresAt)
          .run();

        return json({
          success: true,
          message: "Key created successfully.",
          key_id: result.meta.last_row_id
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
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
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
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
          keys: result.results
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // ACTIVATE KEY
    // =========================

    if (
      url.pathname === "/api/keys/activate" &&
      request.method === "POST"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        const body = await request.json();

        const keyCode =
          String(body.key_code || "").trim();

        const deviceId =
          String(body.device_id || "").trim();

        if (!keyCode || !deviceId) {
          return json(
            {
              success: false,
              error: "key_code and device_id are required."
            },
            400
          );
        }

        const key = await env.DB
          .prepare(`
            SELECT *
            FROM keys
            WHERE key_code = ?
            LIMIT 1
          `)
          .bind(keyCode)
          .first();

        if (!key) {
          return json(
            {
              success: false,
              error: "Invalid key."
            },
            401
          );
        }

        if (key.status !== "active") {
          return json(
            {
              success: false,
              error: "Key is not active.",
              status: key.status
            },
            403
          );
        }

        if (
          key.expires_at &&
          new Date(key.expires_at) <= new Date()
        ) {
          await env.DB
            .prepare(`
              UPDATE keys
              SET status = 'expired'
              WHERE id = ?
            `)
            .bind(key.id)
            .run();

          return json(
            {
              success: false,
              error: "Key has expired."
            },
            403
          );
        }

        if (
          key.device_id &&
          key.device_id !== deviceId
        ) {
          return json(
            {
              success: false,
              error: "Key is already activated on another device."
            },
            403
          );
        }

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

        await env.DB
          .prepare(`
            INSERT INTO activities
            (device_id, key_id, event, details)
            VALUES (?, ?, ?, ?)
          `)
          .bind(
            deviceId,
            key.id,
            "KEY_ACTIVATED",
            "Key activation successful"
          )
          .run();

        return json({
          success: true,
          message: "Key activated successfully.",
          key_id: key.id,
          expires_at: key.expires_at
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // VERIFY KEY
    // =========================

    if (
      url.pathname === "/api/keys/verify" &&
      request.method === "POST"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        const body = await request.json();

        const keyCode =
          String(body.key_code || "").trim();

        const deviceId =
          String(body.device_id || "").trim();

        if (!keyCode || !deviceId) {
          return json(
            {
              success: false,
              error: "key_code and device_id are required."
            },
            400
          );
        }

        const key = await env.DB
          .prepare(`
            SELECT *
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
          });
        }

        if (key.status !== "active") {
          return json({
            success: false,
            valid: false,
            error: "Key is not active.",
            status: key.status
          });
        }

        if (
          key.expires_at &&
          new Date(key.expires_at) <= new Date()
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
            error: "Key has expired."
          });
        }

        if (
          key.device_id &&
          key.device_id !== deviceId
        ) {
          return json({
            success: false,
            valid: false,
            error: "Device does not match."
          });
        }

        await env.DB
          .prepare(`
            UPDATE keys
            SET last_used_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `)
          .bind(key.id)
          .run();

        await env.DB
          .prepare(`
            INSERT INTO activities
            (device_id, key_id, event, details)
            VALUES (?, ?, ?, ?)
          `)
          .bind(
            deviceId,
            key.id,
            "KEY_VERIFIED",
            "Key verification successful"
          )
          .run();

        return json({
          success: true,
          valid: true,
          key_id: key.id,
          expires_at: key.expires_at
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // RESET DEVICE
    // =========================

    if (
      url.pathname === "/api/keys/reset-device" &&
      request.method === "POST"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        const body = await request.json();

        const keyCode =
          String(body.key_code || "").trim();

        if (!keyCode) {
          return json(
            {
              success: false,
              error: "key_code is required."
            },
            400
          );
        }

        const key = await env.DB
          .prepare(`
            SELECT id, device_id
            FROM keys
            WHERE key_code = ?
            LIMIT 1
          `)
          .bind(keyCode)
          .first();

        if (!key) {
          return json(
            {
              success: false,
              error: "Key not found."
            },
            404
          );
        }

        await env.DB
          .prepare(`
            UPDATE keys
            SET
              device_id = NULL,
              last_used_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `)
          .bind(key.id)
          .run();

        await env.DB
          .prepare(`
            INSERT INTO activities
            (device_id, key_id, event, details)
            VALUES (?, ?, ?, ?)
          `)
          .bind(
            key.device_id,
            key.id,
            "DEVICE_RESET",
            "Device binding reset"
          )
          .run();

        return json({
          success: true,
          message: "Device binding reset successfully."
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // UPDATE KEY
    // =========================

    const keyMatch =
      url.pathname.match(
        /^\/api\/keys\/(\d+)$/
      );

    if (
      keyMatch &&
      request.method === "PUT"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        const keyId =
          Number(keyMatch[1]);

        const body =
          await request.json();

        const allowedStatuses = [
          "active",
          "disabled",
          "expired",
          "revoked"
        ];

        const status =
          body.status;

        const expiresAt =
          body.expires_at;

        if (
          status &&
          !allowedStatuses.includes(status)
        ) {
          return json(
            {
              success: false,
              error: "Invalid status."
            },
            400
          );
        }

        if (
          status &&
          expiresAt !== undefined
        ) {
          await env.DB
            .prepare(`
              UPDATE keys
              SET
                status = ?,
                expires_at = ?
              WHERE id = ?
            `)
            .bind(
              status,
              expiresAt || null,
              keyId
            )
            .run();
        }
        else if (status) {
          await env.DB
            .prepare(`
              UPDATE keys
              SET status = ?
              WHERE id = ?
            `)
            .bind(status, keyId)
            .run();
        }
        else if (
          expiresAt !== undefined
        ) {
          await env.DB
            .prepare(`
              UPDATE keys
              SET expires_at = ?
              WHERE id = ?
            `)
            .bind(
              expiresAt || null,
              keyId
            )
            .run();
        }
        else {
          return json(
            {
              success: false,
              error: "Nothing to update."
            },
            400
          );
        }

        return json({
          success: true,
          message: "Key updated successfully."
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // DELETE KEY
    // =========================

    if (
      keyMatch &&
      request.method === "DELETE"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        const keyId =
          Number(keyMatch[1]);

        await env.DB
          .prepare(`
            DELETE FROM keys
            WHERE id = ?
          `)
          .bind(keyId)
          .run();

        return json({
          success: true,
          message: "Key deleted successfully."
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // ACTIVITIES
    // =========================

    if (
      url.pathname === "/api/activities" &&
      request.method === "GET"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        const result = await env.DB
          .prepare(`
            SELECT
              id,
              device_id,
              key_id,
              event,
              details,
              created_at
            FROM activities
            ORDER BY id DESC
            LIMIT 200
          `)
          .all();

        return json({
          success: true,
          activities: result.results
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // CLEAR ACTIVITIES
    // =========================

    if (
      url.pathname === "/api/activities" &&
      request.method === "DELETE"
    ) {
      if (!env.DB) {
        return json(
          {
            success: false,
            error: "Database not connected."
          },
          500
        );
      }

      try {
        await env.DB
          .prepare("DELETE FROM activities")
          .run();

        return json({
          success: true,
          message: "Activities cleared."
        });
      } catch (error) {
        return json(
          {
            success: false,
            error: error.message
          },
          500
        );
      }
    }

    // =========================
    // UNKNOWN API
    // =========================

    if (url.pathname.startsWith("/api/")) {
      return json(
        {
          success: false,
          error: "API route not found."
        },
        404
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
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );
  }
};