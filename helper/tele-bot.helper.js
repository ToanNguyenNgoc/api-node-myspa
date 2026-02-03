const moment = require('moment');

class TeleBotHelper {
  TELE_MAX = 4096;
  escapeHTML(s = "") {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  };

  truncate(text, max = this.TELE_MAX - 200) {
    const s = String(text);
    if (s.length <= max) return s;
    return s.slice(0, max) + "\n...<i>(truncated)</i>";
  };

  safeJson(value) {
    try {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
          return JSON.parse(trimmed);
        }
        return value;
      }
      return value;
    } catch {
      return value;
    }
  };

  redactObject(obj, extraKeys = []) {
    const SENSITIVE_KEYS = new Set([
      // "authorization",
      "cookie",
      "set-cookie",
      // "password",
      "pass",
      "token",
      "access_token",
      "refresh_token",
      "api_key",
      "apikey",
      "secret",
      "client_secret",
      "otp",
      ...extraKeys.map(k => String(k).toLowerCase()),
    ]);
    const walk = (v) => {
      if (v == null) return v;
      if (Array.isArray(v)) return v.map(walk);
      if (typeof v === "object") {
        const out = {};
        for (const [k, val] of Object.entries(v)) {
          const keyLower = String(k).toLowerCase();
          if (SENSITIVE_KEYS.has(keyLower)) {
            out[k] = "***REDACTED***";
          } else {
            out[k] = walk(val);
          }
        }
        return out;
      }
      return v;
    };
    return walk(obj);
  };

  pretty(obj) {
    return this.escapeHTML(JSON.stringify(obj, null, 2));
  };
  /**
   * { status, config:{ headers, baseURL, params, method, url, data }, ip_address, device_info }
  */
  buildTeleText(body, meta = {}, ip_address = null) {
    const status = body?.status ?? "unknown";
    const cfg = body?.config ?? {};
    const method = (cfg?.method ?? "unknown").toUpperCase();
    const baseURL = cfg?.baseURL ?? "";
    const url = cfg?.url ?? "";
    const params = cfg?.params ?? {};
    const headers = cfg?.headers ?? {};
    const data = this.safeJson(cfg?.data);

    const env = meta.env ?? process.env.NODE_ENV ?? "unknown";

    const cleanHeaders = this.redactObject(headers);
    const cleanData = this.redactObject(data);

    const lines = [
      `<b>🚨 APP ERROR</b>`,
      `<b>IP Address:</b> <code>${this.escapeHTML(body.ip_address)}</code>`,
      `<b>Status:</b> <code>${this.escapeHTML(status)}</code>    <b>Env:</b> <code>${this.escapeHTML(env)}</code>`,
      `<b>Time:</b> <code>${this.escapeHTML(moment().format('YYYY-MM-DD HH:mm:ss'))}</code>`,
      `<b>Device Info:</b> <code>${this.escapeHTML(body.device_info)}</code>`,
      ``,
      `<b>Request</b>`,
      `<b>Endpoint:</b> <code>${this.escapeHTML(method)} ${this.escapeHTML(baseURL)}${this.escapeHTML(url)}</code>`,
      ``,
      `<b>Params</b>`,
      `<pre>${this.pretty(params)}</pre>`,
      `<b>Headers</b>`,
      `<pre>${this.pretty(cleanHeaders)}</pre>`,
      `<b>Data</b>`,
      `<pre>${this.pretty(cleanData)}</pre>`,
    ];
    if (meta.requestId) {
      lines.splice(3, 0, `<b>RequestId:</b> <code>${this.escapeHTML(meta.requestId)}</code>`);
    }
    return this.truncate(lines.join("\n"));
  };
}

module.exports = TeleBotHelper;