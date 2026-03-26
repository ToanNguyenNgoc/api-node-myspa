class PageBase64Images {
  /**
   * Lấy danh sách data:image/...;base64,... từ <img src> và <img srcset>
   * @param {string} url
   * @param {number} limit
   * @returns {Promise<string[]>}
   */
  async extract(url, limit = 50) {
    const out = [];
    try {
      this.assertSafeUrl(url);
      const html = await this.fetchHtml(url);
      const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];

      for (const tag of imgTags) {
        if (out.length >= limit) break;

        const src = this.getAttr(tag, "src");
        if (this.isDataImage(src)) {
          out.push(src.trim());
          continue;
        }

        const srcset = this.getAttr(tag, "srcset");
        if (srcset) {
          for (const candidate of this.parseSrcset(srcset)) {
            if (out.length >= limit) break;
            if (this.isDataImage(candidate)) out.push(candidate.trim());
          }
        }
      }
    } catch (_) {
    }

    return [...new Set(out)];
  }

  isDataImage(s) {
    return typeof s === "string" && s.startsWith("data:image/");
  }

  parseSrcset(srcset) {
    return srcset
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((part) => part.split(/\s+/)[0]) // token đầu tiên là URL
      .filter(Boolean);
  }

  /**
   * Lấy attribute từ tag string: src="..." hoặc src='...' hoặc src=...
   */
  getAttr(tag, attrName) {
    const re = new RegExp(
      `${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
      "i"
    );
    const m = tag.match(re);
    return (m && (m[1] ?? m[2] ?? m[3])) || "";
  }

  async fetchHtml(url) {
    // Node >= 18 có fetch sẵn
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Node.js)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP status ${res.status}`);
    }
    return await res.text();
  }

  assertSafeUrl(url) {
    let u;
    try {
      u = new URL(url);
    } catch {
      throw new Error("Invalid URL");
    }

    if (!["http:", "https:"].includes(u.protocol)) {
      throw new Error("Only http/https allowed");
    }

    // Chặn localhost/loopback cơ bản (bạn có thể mở rộng thêm private IP ranges nếu cần)
    const host = u.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") {
      throw new Error("Localhost is not allowed");
    }
  }
}

module.exports = new PageBase64Images();