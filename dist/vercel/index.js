import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
const app = new Hono();
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1PBkOmAWRcf2@ep-round-recipe-aqdgkjfj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);
function extractRegion(address) {
  if (!address) return "";
  const parts = address.split(/\s+/);
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].endsWith("구") && !parts[i].endsWith("시구")) {
      return parts[i].replace(/구$/, "");
    }
  }
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].endsWith("시") && parts[i] !== parts[0]) {
      return parts[i].replace(/(특별시|광역시|특별자치시|시)$/, "");
    }
  }
  if (parts[0]) return parts[0].replace(/(특별자치도|도)$/, "");
  return "";
}
function extractCity(address) {
  if (!address) return "";
  const parts = address.split(/\s+/);
  if (parts[0]) {
    const city = parts[0].replace(/(특별시|광역시|특별자치시|특별자치도|도|시)$/, "");
    return city;
  }
  return "";
}
function schemaType(category) {
  const map = {
    "마사지": "MassageTherapist",
    "헤드스파": "BeautySalon",
    "피부관리": "BeautySalon",
    "헤어": "HairSalon",
    "메이크업": "BeautySalon",
    "왁싱": "BeautySalon",
    "반영구": "BeautySalon",
    "병원": "MedicalBusiness",
    "그외": "LocalBusiness"
  };
  return map[category] || "LocalBusiness";
}
function seoTitle(shop) {
  const region = extractRegion(shop.address);
  const city = extractCity(shop.address);
  const loc = region || city;
  return `${shop.name} ${loc ? loc + " " : ""}${shop.category} 추천 | 마이뷰티맵`;
}
function seoDesc(shop) {
  const region = extractRegion(shop.address);
  const city = extractCity(shop.address);
  const tags = Array.isArray(shop.tags) && shop.tags.length ? shop.tags.join("·") + " " : "";
  const loc = region || city;
  const price = shop.price ? ` 가격 ${shop.price}.` : "";
  const desc = shop.desc ? " " + shop.desc.slice(0, 40) : "";
  return `${shop.name} | ${loc ? loc + " " : ""}${shop.category} 잘하는 곳. ${tags}예약·위치·가격 한눈에 확인!${price}${desc}`.slice(0, 160);
}
function catSeoTitle(category, region) {
  return `${region} ${category} 추천 TOP | 마이뷰티맵`;
}
function catSeoDesc(category, region, count) {
  return `${region} ${category} 잘하는 곳 ${count}곳 추천! 가격·위치·예약·후기까지 마이뷰티맵에서 한눈에 확인하세요.`;
}
function catSeoKeywords(category, region) {
  const city = region;
  return [
    `${city} ${category}`,
    `${city} ${category} 추천`,
    `${city} ${category} 잘하는 곳`,
    `${city} ${category} 예약`,
    `${city} ${category} 가격`,
    `${city} ${category} 후기`,
    `${city} ${category} 맛집`,
    `${city} 뷰티샵`,
    `${city} 뷰티 추천`,
    `${category} 추천`
  ].join(",");
}
function kstToday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1e3).toISOString().slice(0, 10);
}
function kstYesterday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1e3 - 864e5).toISOString().slice(0, 10);
}
function extractYoutubeId(input) {
  const s = (input ?? "").trim();
  if (!s) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : s;
}
function calcIsPremium(r) {
  if (r.plan !== "shoot") return false;
  if (!r.paid_until) return false;
  return new Date(r.paid_until) >= /* @__PURE__ */ new Date();
}
function rowToShop(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    tags: r.tags ?? [],
    price: r.price ?? "",
    address: r.address ?? "",
    district: r.district ?? "",
    lat: parseFloat(r.lat) || 37.5326,
    lng: parseFloat(r.lng) || 127.0246,
    smartPlaceUrl: r.smart_place_url ?? "",
    youtubeId: r.youtube_id ?? "",
    featured: r.featured ?? false,
    thumbnail: r.thumbnail ?? "",
    phone: r.phone ?? "",
    desc: r.description ?? "",
    active: r.active ?? true,
    displayMode: r.display_mode ?? "both",
    plan: r.plan ?? "basic",
    paidUntil: r.paid_until ?? null,
    paymentStatus: r.payment_status ?? "unpaid",
    paymentMemo: r.payment_memo ?? "",
    views: parseInt(r.view_cnt) || 0,
    feedSP: parseInt(r.feed_sp) || 0,
    mapSP: parseInt(r.map_sp) || 0,
    isPremium: calcIsPremium(r),
    isRecommended: r.is_recommended ?? false
  };
}
function calcDist(la1, lo1, la2, lo2) {
  const R = 6371, dL = (la2 - la1) * Math.PI / 180, dO = (lo2 - lo1) * Math.PI / 180;
  const a = Math.sin(dL / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dO / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const MIGRATION_VERSION = 10;
let _migrationDone = false;
let _migrationPromise = null;
async function runMigrations() {
  if (_migrationDone) return;
  if (_migrationPromise) return _migrationPromise;
  _migrationPromise = (async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version     INTEGER PRIMARY KEY,
          applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      const rows = await sql`SELECT version FROM schema_migrations WHERE version = ${MIGRATION_VERSION}`;
      if (rows.length > 0) {
        _migrationDone = true;
        return;
      }
      await sql`
        CREATE TABLE IF NOT EXISTS daily_stats (
          shop_id      INTEGER NOT NULL,
          stat_date    DATE    NOT NULL,
          view_cnt     INTEGER NOT NULL DEFAULT 0,
          feed_sp      INTEGER NOT NULL DEFAULT 0,
          map_sp       INTEGER NOT NULL DEFAULT 0,
          feed_view    INTEGER NOT NULL DEFAULT 0,
          catalog_view INTEGER NOT NULL DEFAULT 0,
          map_view     INTEGER NOT NULL DEFAULT 0,
          vts_feed     INTEGER NOT NULL DEFAULT 0,
          vts_catalog  INTEGER NOT NULL DEFAULT 0,
          vts_map      INTEGER NOT NULL DEFAULT 0,
          rec_view     INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY (shop_id, stat_date)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS honey_items (
          id           SERIAL PRIMARY KEY,
          title        TEXT    NOT NULL,
          description  TEXT    NOT NULL DEFAULT '',
          youtube_id   TEXT    NOT NULL DEFAULT '',
          coupang_url  TEXT    NOT NULL DEFAULT '',
          coupang_url2 TEXT    NOT NULL DEFAULT '',
          price        TEXT    NOT NULL DEFAULT '',
          tags         TEXT[]  NOT NULL DEFAULT '{}',
          sort_order   INTEGER NOT NULL DEFAULT 0,
          active       BOOLEAN NOT NULL DEFAULT true,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS shorts_items (
          id               SERIAL PRIMARY KEY,
          name             TEXT    NOT NULL DEFAULT '',
          category         TEXT    NOT NULL DEFAULT '',
          address          TEXT    NOT NULL DEFAULT '',
          youtube_id       TEXT    NOT NULL DEFAULT '',
          smart_place_url  TEXT    NOT NULL DEFAULT '',
          sort_order       INTEGER NOT NULL DEFAULT 0,
          active           BOOLEAN NOT NULL DEFAULT true,
          view_cnt         INTEGER NOT NULL DEFAULT 0,
          sp_cnt           INTEGER NOT NULL DEFAULT 0,
          created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS shorts_daily_stats (
          shorts_id  INTEGER NOT NULL,
          stat_date  DATE    NOT NULL,
          view_cnt   INTEGER NOT NULL DEFAULT 0,
          sp_cnt     INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY (shorts_id, stat_date)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS visitor_sessions (
          id            TEXT    PRIMARY KEY,
          entered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          device        TEXT    NOT NULL DEFAULT 'unknown',
          duration_sec  INTEGER NOT NULL DEFAULT 0,
          tabs_visited  TEXT[]  NOT NULL DEFAULT '{}',
          shorts_count  INTEGER NOT NULL DEFAULT 0,
          shorts_book   INTEGER NOT NULL DEFAULT 0,
          feed_card_cnt INTEGER NOT NULL DEFAULT 0,
          feed_book_cnt INTEGER NOT NULL DEFAULT 0,
          map_pin_cnt   INTEGER NOT NULL DEFAULT 0,
          map_book_cnt  INTEGER NOT NULL DEFAULT 0,
          search_cnt    INTEGER NOT NULL DEFAULT 0,
          inquiry_cnt   INTEGER NOT NULL DEFAULT 0,
          book_count    INTEGER NOT NULL DEFAULT 0,
          exited        BOOLEAN NOT NULL DEFAULT false
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS session_events (
          id          BIGSERIAL PRIMARY KEY,
          session_id  TEXT        NOT NULL,
          occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          event_type  TEXT        NOT NULL,
          shop_id     INTEGER,
          shop_name   TEXT,
          shop_cat    TEXT,
          viewed_sec  INTEGER     NOT NULL DEFAULT 0
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_se_session  ON session_events(session_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`;
      await sql`ALTER TABLE shops             ADD COLUMN IF NOT EXISTS report_token   TEXT`;
      await sql`ALTER TABLE shops             ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS feed_view      INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS catalog_view   INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS map_view       INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_feed       INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_catalog    INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS vts_map        INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE daily_stats       ADD COLUMN IF NOT EXISTS rec_view       INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE honey_items       ADD COLUMN IF NOT EXISTS coupang_url2   TEXT    NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS smart_place_url TEXT   NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS view_cnt        INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE shorts_items      ADD COLUMN IF NOT EXISTS sp_cnt          INTEGER NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE session_events    ADD COLUMN IF NOT EXISTS viewed_sec      INTEGER NOT NULL DEFAULT 0`;
      await sql`INSERT INTO schema_migrations (version) VALUES (${MIGRATION_VERSION}) ON CONFLICT DO NOTHING`;
      _migrationDone = true;
    } catch (e) {
      console.error("[migration] error:", e);
      _migrationPromise = null;
    }
  })();
  return _migrationPromise;
}
const NO_MIGRATION_PATHS = ["/api/admin/cloudinary-sign", "/static", "/favicon", "/og-image"];
app.use("*", async (c, next) => {
  const path2 = c.req.path;
  const skip = NO_MIGRATION_PATHS.some((p) => path2.startsWith(p));
  if (!skip) await runMigrations();
  else runMigrations();
  return next();
});
app.get("/api/shops", async (c) => {
  const cat = c.req.query("category") ?? "";
  const q = (c.req.query("q") ?? "").toLowerCase();
  const lat = parseFloat(c.req.query("lat") ?? "");
  const lng = parseFloat(c.req.query("lng") ?? "");
  const nearby = c.req.query("nearby") === "1";
  const shuffle = c.req.query("shuffle") === "1";
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true
    ORDER BY s.featured DESC, s.id ASC
  `;
  let list = rows.map(rowToShop);
  if (cat === "recommended") list = list.filter((s) => s.isRecommended);
  else if (cat && cat !== "all") list = list.filter((s) => s.category === cat);
  if (q) list = list.filter(
    (s) => s.name.toLowerCase().includes(q) || (s.tags || []).some((t) => t.toLowerCase().includes(q)) || s.district.toLowerCase().includes(q)
  );
  if (nearby && !isNaN(lat) && !isNaN(lng)) {
    list = list.map((s) => ({ ...s, dist: calcDist(lat, lng, s.lat, s.lng) })).filter((s) => s.dist <= 20).sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return a.dist - b.dist;
    });
  } else if (shuffle) {
    const premiums = list.filter((s) => s.isPremium);
    const normals = list.filter((s) => !s.isPremium);
    for (let i = premiums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [premiums[i], premiums[j]] = [premiums[j], premiums[i]];
    }
    for (let i = normals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [normals[i], normals[j]] = [normals[j], normals[i]];
    }
    list = [...premiums, ...normals];
  } else {
    list.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return 0;
    });
  }
  return c.json(list);
});
app.get("/api/geocode", async (c) => {
  var _a, _b, _c, _d, _e;
  const query = c.req.query("query") ?? "";
  if (!query) return c.json({ error: "query required" }, 400);
  const normalize = (q) => q.replace(/(로|길|번길)\s+(\d)/g, "$1$2");
  const candidates = [];
  const norm = normalize(query);
  if (norm !== query) candidates.push(norm);
  candidates.push(query);
  const tokens = norm.trim().split(/\s+/);
  if (tokens.length > 3) candidates.push(tokens.slice(0, -1).join(" "));
  const ncpFetch = async (q) => {
    const res = await fetch(
      `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(q)}`,
      { headers: {
        "X-NCP-APIGW-API-KEY-ID": "xjjg4490h8",
        "X-NCP-APIGW-API-KEY": "RB4DFA4ZEF2iHtkerlNrqzoG8P8YHwE2UddGrAtD"
      } }
    );
    return res.json();
  };
  try {
    let addr = null;
    for (const candidate of candidates) {
      const data = await ncpFetch(candidate);
      if ((_a = data.addresses) == null ? void 0 : _a.length) {
        addr = data.addresses[0];
        break;
      }
    }
    if (!addr) return c.json({ error: "주소를 찾을 수 없어요" }, 404);
    const elements = addr.addressElements || [];
    const sido = ((_b = elements.find((e) => {
      var _a2;
      return (_a2 = e.types) == null ? void 0 : _a2.includes("SIDO");
    })) == null ? void 0 : _b.longName) || "";
    const sigungu = ((_c = elements.find((e) => {
      var _a2;
      return (_a2 = e.types) == null ? void 0 : _a2.includes("SIGUGUN");
    })) == null ? void 0 : _c.longName) || "";
    const dong = ((_d = elements.find((e) => {
      var _a2, _b2;
      return ((_a2 = e.types) == null ? void 0 : _a2.includes("DONGMYUN")) || ((_b2 = e.types) == null ? void 0 : _b2.includes("RI"));
    })) == null ? void 0 : _d.longName) || "";
    const district = [sido, sigungu, dong].filter(Boolean).join(" ") || ((_e = addr.roadAddress) == null ? void 0 : _e.split(" ").slice(0, 3).join(" ")) || "";
    return c.json({
      lat: parseFloat(addr.y),
      lng: parseFloat(addr.x),
      address: addr.roadAddress || addr.jibunAddress,
      district
    });
  } catch (e) {
    return c.json({ error: "지오코딩 실패" }, 500);
  }
});
app.get("/api/shops/all", async (c) => {
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true ORDER BY s.id ASC
  `;
  return c.json(rows.map(rowToShop));
});
app.get("/api/shops/:id", async (c) => {
  const id = +c.req.param("id");
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${id}
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json(rowToShop(rows[0]));
});
app.post("/api/admin/shops", async (c) => {
  const body = await c.req.json();
  const tags = Array.isArray(body.tags) ? body.tags : (body.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const rows = await sql`
    INSERT INTO shops
      (name, category, tags, price, address, district, lat, lng,
       smart_place_url, youtube_id, featured, thumbnail, phone, description, active, display_mode)
    VALUES
      (${body.name ?? "새 업체"}, ${body.category ?? "피부관리"}, ${tags},
       ${body.price ?? ""}, ${body.address ?? ""}, ${body.district ?? ""},
       ${parseFloat(body.lat) || 37.5326}, ${parseFloat(body.lng) || 127.0246},
       ${body.smartPlaceUrl ?? ""}, ${extractYoutubeId(body.youtubeId ?? "")},
       ${body.featured ?? false},
       ${body.thumbnail ?? ""},
       ${body.phone ?? ""}, ${body.desc ?? ""}, true, ${body.displayMode ?? "both"})
    RETURNING *
  `;
  const shop = rows[0];
  await sql`INSERT INTO stats (shop_id) VALUES (${shop.id}) ON CONFLICT DO NOTHING`;
  return c.json(rowToShop(shop));
});
app.put("/api/admin/shops/:id", async (c) => {
  const id = +c.req.param("id");
  const body = await c.req.json();
  const tags = Array.isArray(body.tags) ? body.tags : (body.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const rows = await sql`
    UPDATE shops SET
      name            = ${body.name},
      category        = ${body.category},
      tags            = ${tags},
      price           = ${body.price ?? ""},
      address         = ${body.address ?? ""},
      district        = ${body.district ?? ""},
      lat             = ${parseFloat(body.lat) || 37.5326},
      lng             = ${parseFloat(body.lng) || 127.0246},
      smart_place_url = ${body.smartPlaceUrl ?? ""},
      youtube_id      = ${extractYoutubeId(body.youtubeId ?? "")},
      featured        = ${body.featured ?? false},
      thumbnail       = ${body.thumbnail ?? ""},
      phone           = ${body.phone ?? ""},
      description     = ${body.desc ?? ""},
      active          = ${body.active ?? true},
      display_mode    = ${body.displayMode ?? "both"}
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  await sql`INSERT INTO stats (shop_id) VALUES (${id}) ON CONFLICT DO NOTHING`;
  return c.json(rowToShop(rows[0]));
});
app.put("/api/admin/shops/:id/recommended", async (c) => {
  const id = +c.req.param("id");
  const { isRecommended } = await c.req.json();
  const rows = await sql`
    UPDATE shops SET is_recommended = ${!!isRecommended}
    WHERE id = ${id} RETURNING *
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json({ ok: true, isRecommended: rows[0].is_recommended });
});
app.post("/api/track/rec/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  try {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, rec_view)
                VALUES (${id}, ${today}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET rec_view = daily_stats.rec_view + 1`;
  } catch (_) {
  }
  return c.json({ ok: true });
});
app.put("/api/admin/shops/:id/payment", async (c) => {
  const id = +c.req.param("id");
  const body = await c.req.json();
  const rows = await sql`
    UPDATE shops SET
      plan           = ${body.plan ?? "basic"},
      paid_until     = ${body.paidUntil || null},
      payment_status = ${body.paymentStatus ?? "unpaid"},
      payment_memo   = ${body.paymentMemo ?? ""}
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json(rowToShop(rows[0]));
});
app.delete("/api/admin/shops/:id", async (c) => {
  const id = +c.req.param("id");
  await sql`DELETE FROM shops WHERE id = ${id}`;
  return c.json({ ok: true });
});
app.post("/api/track/view/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  let source = "feed";
  try {
    const body = await c.req.json();
    if (["feed", "catalog", "map"].includes(body == null ? void 0 : body.source)) source = body.source;
  } catch (_) {
  }
  await sql`INSERT INTO stats (shop_id, view_cnt) VALUES (${id}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET view_cnt = stats.view_cnt + 1`;
  if (source === "feed") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, feed_view)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt   = daily_stats.view_cnt   + 1,
                    feed_view  = daily_stats.feed_view  + 1`;
  } else if (source === "catalog") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, catalog_view)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt      = daily_stats.view_cnt      + 1,
                    catalog_view  = daily_stats.catalog_view  + 1`;
  } else {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, view_cnt, map_view)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET view_cnt  = daily_stats.view_cnt  + 1,
                    map_view  = daily_stats.map_view  + 1`;
  }
  return c.json({ ok: true });
});
app.post("/api/track/sp/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  let viewSrc = null;
  try {
    const b = await c.req.json();
    viewSrc = (b == null ? void 0 : b.viewSrc) || null;
  } catch (_) {
  }
  await sql`INSERT INTO stats (shop_id, feed_sp) VALUES (${id}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET feed_sp = stats.feed_sp + 1`;
  if (viewSrc === "feed") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_feed)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp  = daily_stats.feed_sp  + 1,
                    vts_feed = daily_stats.vts_feed + 1`;
  } else if (viewSrc === "catalog") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_catalog)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp     = daily_stats.feed_sp     + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`;
  } else if (viewSrc === "map") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp, vts_map)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1,
                    vts_map = daily_stats.vts_map + 1`;
  } else {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, feed_sp)
                VALUES (${id}, ${today}, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET feed_sp = daily_stats.feed_sp + 1`;
  }
  return c.json({ ok: true });
});
app.post("/api/track/mapsp/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  let viewSrc = null;
  try {
    const b = await c.req.json();
    viewSrc = (b == null ? void 0 : b.viewSrc) || null;
  } catch (_) {
  }
  await sql`INSERT INTO stats (shop_id, map_sp) VALUES (${id}, 1)
      ON CONFLICT (shop_id) DO UPDATE SET map_sp = stats.map_sp + 1`;
  if (viewSrc === "feed") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_feed)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp   = daily_stats.map_sp   + 1,
                    vts_feed = daily_stats.vts_feed + 1`;
  } else if (viewSrc === "catalog") {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_catalog)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp      = daily_stats.map_sp      + 1,
                    vts_catalog = daily_stats.vts_catalog + 1`;
  } else {
    await sql`INSERT INTO daily_stats (shop_id, stat_date, map_sp, vts_map)
                VALUES (${id}, ${today}, 1, 1)
              ON CONFLICT (shop_id, stat_date) DO UPDATE
                SET map_sp  = daily_stats.map_sp  + 1,
                    vts_map = daily_stats.vts_map + 1`;
  }
  return c.json({ ok: true });
});
app.post("/api/track/visit", async (c) => {
  const today = kstToday();
  await sql`
    INSERT INTO daily_visits (visit_date, visit_cnt) VALUES (${today}, 1)
    ON CONFLICT (visit_date) DO UPDATE SET visit_cnt = daily_visits.visit_cnt + 1
  `;
  return c.json({ ok: true });
});
app.get("/api/admin/daily-visits", async (c) => {
  const rows = await sql`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    ORDER BY visit_date DESC
    LIMIT 30
  `;
  return c.json(rows);
});
app.post("/api/admin/reset-stats", async (c) => {
  await sql`UPDATE stats SET view_cnt=0, feed_sp=0, map_sp=0`;
  await sql`DELETE FROM daily_visits`;
  await sql`DELETE FROM daily_stats`;
  return c.json({ ok: true });
});
app.post("/api/admin/init-daily-stats", async (c) => {
  _migrationDone = false;
  _migrationPromise = null;
  await sql`DELETE FROM schema_migrations WHERE version = ${MIGRATION_VERSION}`;
  await runMigrations();
  return c.json({ ok: true });
});
app.get("/api/admin/stats", async (c) => {
  const today = kstToday();
  const yesterday = kstYesterday();
  const rows = await sql`
    SELECT s.id, s.name, s.category, s.thumbnail, s.youtube_id,
           s.featured, s.active, s.lat, s.lng, s.smart_place_url,
           s.address, s.district, s.phone,
           s.display_mode, s.price, s.tags, s.description,
           s.plan, s.payment_status, s.paid_until, s.payment_memo,
           s.is_recommended,
           COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0)  as feed_sp,
           COALESCE(st.map_sp,0)   as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    ORDER BY (COALESCE(st.feed_sp,0)+COALESCE(st.map_sp,0)) DESC, COALESCE(st.view_cnt,0) DESC
  `;
  const todayTotals = await sql`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${today}
  `;
  const yestTotals = await sql`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats WHERE stat_date = ${yesterday}
  `;
  const weekRows = await sql`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COALESCE(SUM(rec_view),0) as rec_view
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '13 days')
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `;
  const recWeekRows = await sql`
    SELECT shop_id, COALESCE(SUM(rec_view),0) as total_rec
    FROM daily_stats
    WHERE stat_date >= (CURRENT_DATE - INTERVAL '6 days')
    GROUP BY shop_id
    HAVING SUM(rec_view) > 0
    ORDER BY total_rec DESC
  `;
  const recWeekMap = {};
  recWeekRows.forEach((r) => {
    recWeekMap[r.shop_id] = parseInt(r.total_rec) || 0;
  });
  const totals = await sql`
    SELECT
      SUM(view_cnt) as total_views,
      SUM(feed_sp)  as total_feed_sp,
      SUM(map_sp)   as total_map_sp
    FROM stats
  `;
  const activeCount = await sql`SELECT COUNT(*) as cnt FROM shops WHERE active = true`;
  const t = totals[0] || {};
  const td = todayTotals[0] || {};
  const yd = yestTotals[0] || {};
  const todayShopRows = await sql`
    SELECT shop_id,
           COALESCE(view_cnt,0)     as view_cnt,
           COALESCE(feed_sp,0)      as feed_sp,
           COALESCE(map_sp,0)       as map_sp,
           COALESCE(feed_view,0)    as feed_view,
           COALESCE(catalog_view,0) as catalog_view,
           COALESCE(map_view,0)     as map_view,
           COALESCE(vts_feed,0)     as vts_feed,
           COALESCE(vts_catalog,0)  as vts_catalog,
           COALESCE(vts_map,0)      as vts_map,
           COALESCE(rec_view,0)     as rec_view
    FROM daily_stats WHERE stat_date = ${today}
  `;
  const todayShopMap = {};
  todayShopRows.forEach((r) => {
    todayShopMap[r.shop_id] = {
      todayViews: parseInt(r.view_cnt) || 0,
      todayFeedSP: parseInt(r.feed_sp) || 0,
      todayMapSP: parseInt(r.map_sp) || 0,
      todayFeedView: parseInt(r.feed_view) || 0,
      todayCatalogView: parseInt(r.catalog_view) || 0,
      todayMapView: parseInt(r.map_view) || 0,
      todayVtsFeed: parseInt(r.vts_feed) || 0,
      todayVtsCatalog: parseInt(r.vts_catalog) || 0,
      todayVtsMap: parseInt(r.vts_map) || 0,
      todayRecView: parseInt(r.rec_view) || 0
    };
  });
  return c.json({
    stats: rows.map((r) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      return {
        id: r.id,
        name: r.name,
        category: r.category,
        thumbnail: r.thumbnail,
        youtubeId: r.youtube_id,
        featured: r.featured,
        active: r.active,
        views: parseInt(r.view_cnt) || 0,
        feedSP: parseInt(r.feed_sp) || 0,
        mapSP: parseInt(r.map_sp) || 0,
        lat: parseFloat(r.lat) || 0,
        lng: parseFloat(r.lng) || 0,
        smartPlaceUrl: r.smart_place_url ?? "",
        address: r.address ?? "",
        district: r.district ?? "",
        phone: r.phone ?? "",
        plan: r.plan ?? "basic",
        paymentStatus: r.payment_status ?? "unpaid",
        paidUntil: r.paid_until ? String(r.paid_until).slice(0, 10) : null,
        paymentMemo: r.payment_memo ?? "",
        displayMode: r.display_mode ?? "both",
        priceRange: r.price ?? "",
        tags: r.tags ?? [],
        description: r.description ?? "",
        isRecommended: r.is_recommended ?? false,
        // 오늘 업체별 성과
        todayViews: ((_a = todayShopMap[r.id]) == null ? void 0 : _a.todayViews) || 0,
        todayFeedSP: ((_b = todayShopMap[r.id]) == null ? void 0 : _b.todayFeedSP) || 0,
        todayMapSP: ((_c = todayShopMap[r.id]) == null ? void 0 : _c.todayMapSP) || 0,
        todayFeedView: ((_d = todayShopMap[r.id]) == null ? void 0 : _d.todayFeedView) || 0,
        todayCatalogView: ((_e = todayShopMap[r.id]) == null ? void 0 : _e.todayCatalogView) || 0,
        todayMapView: ((_f = todayShopMap[r.id]) == null ? void 0 : _f.todayMapView) || 0,
        // 오늘 출처별 전환 (영상→예약)
        todayVtsFeed: ((_g = todayShopMap[r.id]) == null ? void 0 : _g.todayVtsFeed) || 0,
        todayVtsCatalog: ((_h = todayShopMap[r.id]) == null ? void 0 : _h.todayVtsCatalog) || 0,
        todayVtsMap: ((_i = todayShopMap[r.id]) == null ? void 0 : _i.todayVtsMap) || 0,
        todayRecView: ((_j = todayShopMap[r.id]) == null ? void 0 : _j.todayRecView) || 0,
        weekRecView: recWeekMap[r.id] || 0
      };
    }),
    // 누적
    totalViews: parseInt(t.total_views) || 0,
    totalFeedSP: parseInt(t.total_feed_sp) || 0,
    totalMapSP: parseInt(t.total_map_sp) || 0,
    totalShops: parseInt(activeCount[0].cnt) || 0,
    // 오늘
    todayViews: parseInt(td.views) || 0,
    todayFeedSP: parseInt(td.feed_sp) || 0,
    todayMapSP: parseInt(td.map_sp) || 0,
    todayRecView: parseInt(td.rec_view) || 0,
    // 어제
    yestViews: parseInt(yd.views) || 0,
    yestFeedSP: parseInt(yd.feed_sp) || 0,
    yestMapSP: parseInt(yd.map_sp) || 0,
    yestRecView: parseInt(yd.rec_view) || 0,
    // 14일 차트
    weekChart: weekRows.map((r) => ({
      date: r.stat_date,
      views: parseInt(r.views) || 0,
      feedSP: parseInt(r.feed_sp) || 0,
      mapSP: parseInt(r.map_sp) || 0,
      recView: parseInt(r.rec_view) || 0
    }))
  });
});
app.post("/api/inquiry", async (c) => {
  const body = await c.req.json();
  if (!body.name || !body.phone) return c.json({ error: "required" }, 400);
  await sql`
    INSERT INTO inquiries (name, owner, category, area, phone, url, youtube_url, message)
    VALUES (${body.name}, ${body.owner ?? ""}, ${body.category ?? ""}, ${body.area ?? ""}, ${body.phone},
            ${body.url ?? ""}, ${body.youtubeUrl ?? ""}, ${body.message ?? ""})
  `;
  return c.json({ ok: true });
});
app.get("/api/admin/calendar", async (c) => {
  const year = parseInt(c.req.query("year") || String((/* @__PURE__ */ new Date()).getFullYear()));
  const month = parseInt(c.req.query("month") || String((/* @__PURE__ */ new Date()).getMonth() + 1));
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);
  const dailyRows = await sql`
    SELECT stat_date::text as stat_date,
           COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp,
           COUNT(DISTINCT shop_id)   as active_shops
    FROM daily_stats
    WHERE stat_date >= ${startDate}
      AND stat_date <= ${endDate}
    GROUP BY stat_date
    ORDER BY stat_date ASC
  `;
  const dateParam = c.req.query("date");
  let shopDetail = [];
  if (dateParam) {
    shopDetail = await sql`
      SELECT s.id, s.name, s.category, s.thumbnail,
             COALESCE(ds.view_cnt,0) as views,
             COALESCE(ds.feed_sp,0)  as feed_sp,
             COALESCE(ds.map_sp,0)   as map_sp
      FROM shops s
      LEFT JOIN daily_stats ds ON s.id = ds.shop_id AND ds.stat_date = ${dateParam}
      WHERE s.active = true
        AND (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)+COALESCE(ds.view_cnt,0)) > 0
      ORDER BY (COALESCE(ds.feed_sp,0)+COALESCE(ds.map_sp,0)) DESC, COALESCE(ds.view_cnt,0) DESC
    `;
  }
  const monthTotal = await sql`
    SELECT COALESCE(SUM(view_cnt),0) as views,
           COALESCE(SUM(feed_sp),0)  as feed_sp,
           COALESCE(SUM(map_sp),0)   as map_sp
    FROM daily_stats
    WHERE stat_date >= ${startDate}
      AND stat_date <= ${endDate}
  `;
  const mt = monthTotal[0] || {};
  const visitRows = await sql`
    SELECT visit_date::text as visit_date, visit_cnt
    FROM daily_visits
    WHERE visit_date >= ${startDate}
      AND visit_date <= ${endDate}
    ORDER BY visit_date ASC
  `;
  const visitMap = {};
  visitRows.forEach((r) => {
    visitMap[r.visit_date] = parseInt(r.visit_cnt) || 0;
  });
  const monthVisit = visitRows.reduce((s, r) => s + (parseInt(r.visit_cnt) || 0), 0);
  return c.json({
    year,
    month,
    monthTotal: {
      views: parseInt(mt.views) || 0,
      feedSP: parseInt(mt.feed_sp) || 0,
      mapSP: parseInt(mt.map_sp) || 0,
      visits: monthVisit
    },
    daily: dailyRows.map((r) => ({
      date: r.stat_date,
      visits: visitMap[r.stat_date] || 0,
      views: parseInt(r.views) || 0,
      feedSP: parseInt(r.feed_sp) || 0,
      mapSP: parseInt(r.map_sp) || 0,
      activeShops: parseInt(r.active_shops) || 0
    })),
    shopDetail: shopDetail.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      thumbnail: r.thumbnail,
      views: parseInt(r.views) || 0,
      feedSP: parseInt(r.feed_sp) || 0,
      mapSP: parseInt(r.map_sp) || 0
    }))
  });
});
app.get("/api/admin/inquiries", async (c) => {
  const rows = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`;
  return c.json(rows);
});
app.get("/favicon.ico", (c) => favicon());
app.get("/favicon.svg", (c) => favicon());
function favicon(c) {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4D7D"/><text x="16" y="23" font-size="18" text-anchor="middle">💄</text></svg>`,
    { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public,max-age=86400" } }
  );
}
app.get("/og-image.jpg", (c) => {
  try {
    const imgPath = path.join(process.cwd(), "public", "og-image.jpg");
    const buf = fs.readFileSync(imgPath);
    return new Response(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public,max-age=86400"
      }
    });
  } catch {
    return c.notFound();
  }
});
app.post("/api/admin/upload-thumbnail", async (c) => {
  const body = await c.req.json();
  const { shopId, dataUrl } = body;
  if (!dataUrl || !shopId) return c.json({ error: "required" }, 400);
  await sql`UPDATE shops SET thumbnail = ${dataUrl} WHERE id = ${shopId}`;
  return c.json({ ok: true, url: dataUrl });
});
app.post("/api/admin/cloudinary-sign", async (c) => {
  var _a, _b, _c;
  try {
    const { folder } = await c.req.json();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ((_a = c.env) == null ? void 0 : _a.CLOUDINARY_CLOUD_NAME);
    const apiKey = process.env.CLOUDINARY_API_KEY || ((_b = c.env) == null ? void 0 : _b.CLOUDINARY_API_KEY);
    const apiSecret = process.env.CLOUDINARY_API_SECRET || ((_c = c.env) == null ? void 0 : _c.CLOUDINARY_API_SECRET);
    if (!cloudName || !apiKey || !apiSecret) return c.json({ error: "Cloudinary env not set" }, 500);
    const uploadFolder = folder || "mybeautymap/shorts";
    const timestamp = Math.floor(Date.now() / 1e3).toString();
    const paramsToSign = `folder=${uploadFolder}&timestamp=${timestamp}${apiSecret}`;
    const msgBuffer = new TextEncoder().encode(paramsToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return c.json({ ok: true, cloudName, apiKey, timestamp, signature, folder: uploadFolder });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});
app.post("/api/admin/fetch-naver-info", async (c) => {
  var _a;
  try {
    const { url } = await c.req.json();
    if (!url) return c.json({ error: "url required" }, 400);
    let placeId = "";
    const directMatch = url.match(/place\/(\d+)/);
    if (directMatch) {
      placeId = directMatch[1];
    } else {
      const r = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15" }
      });
      const finalUrl = r.url;
      const m = finalUrl.match(/place\/(\d+)/);
      if (m) placeId = m[1];
    }
    if (!placeId) return c.json({ error: "네이버 플레이스 링크에서 업체 ID를 찾을 수 없습니다" }, 404);
    const apiUrl = `https://map.naver.com/p/api/search/allSearch?query=${placeId}&type=place&searchCoord=&boundary=`;
    const apiRes = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "Referer": "https://map.naver.com/",
        "Accept": "application/json"
      }
    });
    const mobileUrl = `https://m.place.naver.com/place/${placeId}/home`;
    const mobileRes = await fetch(mobileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "Referer": "https://m.place.naver.com/",
        "Accept-Language": "ko-KR,ko;q=0.9"
      }
    });
    const html = await mobileRes.text();
    let name = "";
    let address = "";
    let category = "";
    const ogTitleM = html.match(/property="og:title"[^>]*content="([^"]+)"/i) || html.match(/content="([^"]+)"[^>]*property="og:title"/i) || html.match(/id="og:title"[^>]*content="([^"]+)"/i);
    if (ogTitleM == null ? void 0 : ogTitleM[1]) {
      name = ogTitleM[1].replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s*[:|]\s*네이버.*$/i, "").trim();
    }
    if (!name) {
      const h1M = html.match(/<h1[^>]*>([^<]{2,30})<\/h1>/i);
      if (h1M == null ? void 0 : h1M[1]) name = h1M[1].trim();
    }
    const addrM = html.match(/<span[^>]*class="[^"]*주소[^"]*"[^>]*>([^<]+)<\/span>/i) || ((_a = html.match(/(서울|경기|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)[^\s<"]{5,}(?:\s[^\s<"]{2,}){1,4}/g)) == null ? void 0 : _a[0]);
    if (addrM) address = (typeof addrM === "string" ? addrM : addrM[1] || "").trim();
    if (!address) {
      const addrAll = html.match(/(서울|경기|인천|부산|대구|광주|대전|울산|세종|강원)[^\s<"]{2,}(?:\s[^\s<"]{2,}){0,3}/g);
      if (addrAll == null ? void 0 : addrAll.length) address = addrAll[0].replace(/[\u0000-\u001f]/g, "").trim();
    }
    const catSpan = html.match(/<span[^>]*class="[^"]*dtDQt[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (catSpan == null ? void 0 : catSpan[1]) {
      const rawCat = catSpan[1].replace(/[\u0000-\u001f]/g, "").trim();
      category = rawCat.split(/[,，]/)[0].trim();
    }
    if (!category) {
      const catKeywords = ["마사지", "헤드스파", "피부관리", "피부,체형관리", "헤어", "네일", "메이크업", "왁싱", "반영구", "피부", "뷰티"];
      for (const kw of catKeywords) {
        if (html.includes(kw)) {
          category = kw.split(",")[0];
          break;
        }
      }
    }
    if (!name) return c.json({ error: "업체 정보를 찾을 수 없습니다. 네이버 플레이스 링크를 확인해주세요." }, 404);
    return c.json({ name, address, category, placeId });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});
app.get("/api/shorts", async (c) => {
  try {
    const rows = await sql`
      SELECT * FROM shorts_items WHERE active = true ORDER BY sort_order ASC, id DESC
    `;
    return c.json(rows);
  } catch (e) {
    console.error("[/api/shorts] DB error:", e);
    return c.json([], 200);
  }
});
app.get("/api/admin/shorts", async (c) => {
  const rows = await sql`SELECT * FROM shorts_items ORDER BY sort_order ASC, id DESC`;
  return c.json(rows);
});
app.post("/api/admin/shorts", async (c) => {
  try {
    const b = await c.req.json();
    const rows = await sql`
      INSERT INTO shorts_items (name, category, address, youtube_id, cloudinary_public_id, smart_place_url, sort_order, active)
      VALUES (${b.name || "미등록업체"}, ${b.category || ""}, ${b.address || ""}, ${b.youtubeId || ""}, ${b.cloudinaryPublicId || ""}, ${b.smartPlaceUrl || ""}, ${b.sortOrder || 0}, ${b.active !== false})
      RETURNING *
    `;
    return c.json(rows[0]);
  } catch (e) {
    return c.json({ error: (e == null ? void 0 : e.message) || "DB 오류" }, 500);
  }
});
app.put("/api/admin/shorts/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const b = await c.req.json();
    const rows = await sql`
      UPDATE shorts_items SET
        name                 = ${b.name || "미등록업체"},
        category             = ${b.category || ""},
        address              = ${b.address || ""},
        youtube_id           = ${b.youtubeId || ""},
        cloudinary_public_id = ${b.cloudinaryPublicId || ""},
        smart_place_url      = ${b.smartPlaceUrl || ""},
        sort_order           = ${b.sortOrder || 0},
        active               = ${b.active !== false}
      WHERE id = ${id} RETURNING *
    `;
    return c.json(rows[0]);
  } catch (e) {
    return c.json({ error: (e == null ? void 0 : e.message) || "DB 오류" }, 500);
  }
});
app.delete("/api/admin/shorts/:id", async (c) => {
  const id = +c.req.param("id");
  await sql`DELETE FROM shorts_items WHERE id = ${id}`;
  return c.json({ ok: true });
});
let _shortsDailyStatsDone = false;
async function ensureShortsDailyStats() {
  if (_shortsDailyStatsDone) return;
  await sql`
    CREATE TABLE IF NOT EXISTS shorts_daily_stats (
      shorts_id  INTEGER NOT NULL,
      stat_date  DATE    NOT NULL,
      view_cnt   INTEGER NOT NULL DEFAULT 0,
      sp_cnt     INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (shorts_id, stat_date)
    )
  `;
  _shortsDailyStatsDone = true;
}
app.post("/api/track/shorts/view/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  await sql`UPDATE shorts_items SET view_cnt = view_cnt + 1 WHERE id = ${id}`;
  try {
    await ensureShortsDailyStats();
    await sql`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, view_cnt)
      VALUES (${id}, ${today}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET view_cnt = shorts_daily_stats.view_cnt + 1
    `;
  } catch (_) {
  }
  return c.json({ ok: true });
});
app.post("/api/track/shorts/sp/:id", async (c) => {
  const id = +c.req.param("id");
  const today = kstToday();
  await sql`UPDATE shorts_items SET sp_cnt = sp_cnt + 1 WHERE id = ${id}`;
  try {
    await ensureShortsDailyStats();
    await sql`
      INSERT INTO shorts_daily_stats (shorts_id, stat_date, sp_cnt)
      VALUES (${id}, ${today}, 1)
      ON CONFLICT (shorts_id, stat_date)
      DO UPDATE SET sp_cnt = shorts_daily_stats.sp_cnt + 1
    `;
  } catch (_) {
  }
  return c.json({ ok: true });
});
app.get("/api/admin/shorts/stats/summary", async (c) => {
  const today = kstToday();
  const yesterday = kstYesterday();
  const day7 = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const [totRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as total_views,
             COALESCE(SUM(sp_cnt),0)   as total_sp
      FROM shorts_items
    `;
    const [todayRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${today}
    `;
    const [yestRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date = ${yesterday}
    `;
    const [weekRow] = await sql`
      SELECT COALESCE(SUM(view_cnt),0) as views,
             COALESCE(SUM(sp_cnt),0)   as sp
      FROM shorts_daily_stats WHERE stat_date >= ${day7}
    `;
    const totalItems = await sql`SELECT COUNT(*) as cnt FROM shorts_items`;
    const activeItems = await sql`SELECT COUNT(*) as cnt FROM shorts_items WHERE active = true`;
    return c.json({
      total_views: Number(totRow.total_views),
      total_sp: Number(totRow.total_sp),
      today_views: Number(todayRow.views),
      today_sp: Number(todayRow.sp),
      yest_views: Number(yestRow.views),
      yest_sp: Number(yestRow.sp),
      week_views: Number(weekRow.views),
      week_sp: Number(weekRow.sp),
      total_items: Number(totalItems[0].cnt),
      active_items: Number(activeItems[0].cnt)
    });
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
app.get("/api/admin/shorts/stats/items", async (c) => {
  const day7 = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const rows = await sql`
      SELECT s.id, s.name, s.category, s.youtube_id, s.active,
             s.view_cnt as total_views, s.sp_cnt as total_sp,
             COALESCE(w.week_views,0) as week_views,
             COALESCE(w.week_sp,0)    as week_sp,
             CASE WHEN s.view_cnt > 0
               THEN ROUND(s.sp_cnt::numeric / s.view_cnt * 100, 1)
               ELSE 0 END as ctr
      FROM shorts_items s
      LEFT JOIN (
        SELECT shorts_id,
               SUM(view_cnt) as week_views,
               SUM(sp_cnt)   as week_sp
        FROM shorts_daily_stats
        WHERE stat_date >= ${day7}
        GROUP BY shorts_id
      ) w ON w.shorts_id = s.id
      ORDER BY s.view_cnt DESC
    `;
    return c.json(rows);
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
app.get("/api/admin/shorts/stats/daily", async (c) => {
  const day30 = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const rows = await sql`
      SELECT stat_date::text as date,
             SUM(view_cnt) as views,
             SUM(sp_cnt)   as sp
      FROM shorts_daily_stats
      WHERE stat_date >= ${day30}
      GROUP BY stat_date
      ORDER BY stat_date ASC
    `;
    return c.json(rows);
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
app.get("/api/admin/shorts/stats/item/:id", async (c) => {
  const id = +c.req.param("id");
  const day30 = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10);
  try {
    await ensureShortsDailyStats();
    const rows = await sql`
      SELECT stat_date::text as date, view_cnt as views, sp_cnt as sp
      FROM shorts_daily_stats
      WHERE shorts_id = ${id} AND stat_date >= ${day30}
      ORDER BY stat_date ASC
    `;
    return c.json(rows);
  } catch (e) {
    return c.json({ error: String(e) }, 500);
  }
});
let _sessionsTableDone = false;
async function ensureSessionsTable() {
  if (_sessionsTableDone) return;
  await sql`
    CREATE TABLE IF NOT EXISTS visitor_sessions (
      id            TEXT    PRIMARY KEY,
      entered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      device        TEXT    NOT NULL DEFAULT 'unknown',
      duration_sec  INTEGER NOT NULL DEFAULT 0,
      tabs_visited  TEXT[]  NOT NULL DEFAULT '{}',
      shorts_count  INTEGER NOT NULL DEFAULT 0,
      shorts_book   INTEGER NOT NULL DEFAULT 0,
      feed_card_cnt INTEGER NOT NULL DEFAULT 0,
      feed_book_cnt INTEGER NOT NULL DEFAULT 0,
      map_pin_cnt   INTEGER NOT NULL DEFAULT 0,
      map_book_cnt  INTEGER NOT NULL DEFAULT 0,
      search_cnt    INTEGER NOT NULL DEFAULT 0,
      inquiry_cnt   INTEGER NOT NULL DEFAULT 0,
      book_count    INTEGER NOT NULL DEFAULT 0,
      exited        BOOLEAN NOT NULL DEFAULT false
    )
  `;
  _sessionsTableDone = true;
}
app.post("/api/track/session/start", async (c) => {
  try {
    await ensureSessionsTable();
    await sql`DELETE FROM visitor_sessions WHERE entered_at < NOW() - INTERVAL '7 days'`;
    const b = await c.req.json();
    const id = b.id || "";
    const device = b.device || "unknown";
    if (!id) return c.json({ ok: false });
    await sql`
      INSERT INTO visitor_sessions (id, device)
      VALUES (${id}, ${device})
      ON CONFLICT (id) DO UPDATE SET last_seen = NOW()
    `;
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ ok: false, error: String(e) });
  }
});
app.post("/api/track/session/update", async (c) => {
  try {
    await ensureSessionsTable();
    const b = await c.req.json();
    const {
      id,
      duration_sec,
      tabs_visited,
      exited,
      shorts_count,
      shorts_book,
      feed_card_cnt,
      feed_book_cnt,
      map_pin_cnt,
      map_book_cnt,
      search_cnt,
      inquiry_cnt
    } = b;
    if (!id) return c.json({ ok: false });
    const book_total = (shorts_book || 0) + (feed_book_cnt || 0) + (map_book_cnt || 0);
    await sql`
      UPDATE visitor_sessions SET
        last_seen     = NOW(),
        duration_sec  = ${duration_sec || 0},
        tabs_visited  = ${tabs_visited || []}::text[],
        shorts_count  = ${shorts_count || 0},
        shorts_book   = ${shorts_book || 0},
        feed_card_cnt = ${feed_card_cnt || 0},
        feed_book_cnt = ${feed_book_cnt || 0},
        map_pin_cnt   = ${map_pin_cnt || 0},
        map_book_cnt  = ${map_book_cnt || 0},
        search_cnt    = ${search_cnt || 0},
        inquiry_cnt   = ${inquiry_cnt || 0},
        book_count    = ${book_total},
        exited        = ${exited || false}
      WHERE id = ${id}
    `;
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ ok: false });
  }
});
let _eventsTableDone = false;
async function ensureEventsTable() {
  if (_eventsTableDone) return;
  await sql`
    CREATE TABLE IF NOT EXISTS session_events (
      id          BIGSERIAL PRIMARY KEY,
      session_id  TEXT        NOT NULL,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      event_type  TEXT        NOT NULL,
      shop_id     INTEGER,
      shop_name   TEXT,
      shop_cat    TEXT,
      viewed_sec  INTEGER     NOT NULL DEFAULT 0
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_se_session ON session_events(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_se_occurred ON session_events(occurred_at)`;
  _eventsTableDone = true;
}
app.post("/api/track/session/event", async (c) => {
  try {
    await ensureEventsTable();
    const b = await c.req.json();
    const { session_id, event_type, shop_id, shop_name, shop_cat, viewed_sec } = b;
    if (!session_id || !event_type) return c.json({ ok: false });
    await sql`DELETE FROM session_events WHERE occurred_at < NOW() - INTERVAL '7 days'`;
    await sql`
      INSERT INTO session_events (session_id, event_type, shop_id, shop_name, shop_cat, viewed_sec)
      VALUES (${session_id}, ${event_type}, ${shop_id || null}, ${shop_name || null}, ${shop_cat || null}, ${viewed_sec || 0})
    `;
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ ok: false, error: String(e) });
  }
});
app.get("/api/admin/sessions/:sid/events", async (c) => {
  try {
    await ensureEventsTable();
    const sid = c.req.param("sid");
    const rows = await sql`
      SELECT id, occurred_at, event_type, shop_id, shop_name, shop_cat
      FROM session_events
      WHERE session_id = ${sid}
      ORDER BY occurred_at ASC
      LIMIT 200
    `;
    return c.json(rows);
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/shop-ranking", async (c) => {
  try {
    await ensureEventsTable();
    const days = Number(c.req.query("days") || 7);
    const rows = await sql`
      SELECT
        shop_id,
        shop_name,
        shop_cat,
        COUNT(*) FILTER (WHERE event_type IN ('shorts_view','feed_card','map_pin'))          AS view_cnt,
        COUNT(*) FILTER (WHERE event_type = 'shorts_view')                                   AS shorts_cnt,
        COUNT(*) FILTER (WHERE event_type = 'feed_card')                                     AS feed_cnt,
        COUNT(*) FILTER (WHERE event_type = 'map_pin')                                       AS map_cnt,
        COUNT(*) FILTER (WHERE event_type IN ('shorts_book','feed_book','map_book'))          AS book_cnt,
        COUNT(DISTINCT session_id)                                                            AS uniq_sessions,
        COALESCE(SUM(viewed_sec) FILTER (WHERE event_type='shorts_view_end'), 0)             AS total_view_sec
      FROM session_events
      WHERE shop_id IS NOT NULL
        AND occurred_at >= NOW() - (${days} || ' days')::INTERVAL
      GROUP BY shop_id, shop_name, shop_cat
      ORDER BY view_cnt DESC
      LIMIT 50
    `;
    return c.json(rows.map((r) => ({
      shop_id: Number(r.shop_id),
      shop_name: r.shop_name || "",
      shop_cat: r.shop_cat || "",
      view_cnt: Number(r.view_cnt),
      shorts_cnt: Number(r.shorts_cnt),
      feed_cnt: Number(r.feed_cnt),
      map_cnt: Number(r.map_cnt),
      book_cnt: Number(r.book_cnt),
      uniq_sessions: Number(r.uniq_sessions),
      total_view_sec: Number(r.total_view_sec),
      conv_rate: r.uniq_sessions > 0 ? Math.round(Number(r.book_cnt) / Number(r.uniq_sessions) * 100) : 0
    })));
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/daily-trend", async (c) => {
  try {
    await ensureSessionsTable();
    const rows = await sql`
      SELECT
        (entered_at AT TIME ZONE 'Asia/Seoul')::date AS day,
        COUNT(*)                                      AS total,
        COUNT(*) FILTER (WHERE device='mobile')       AS mobile,
        COUNT(*) FILTER (WHERE book_count>0)          AS booked,
        COALESCE(SUM(shorts_count),0)                 AS shorts_total,
        COALESCE(SUM(feed_card_cnt),0)                AS feed_total,
        COALESCE(SUM(map_pin_cnt),0)                  AS map_total,
        ROUND(AVG(duration_sec))                      AS avg_sec
      FROM visitor_sessions
      WHERE entered_at >= NOW() - INTERVAL '7 days'
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    return c.json(rows.map((r) => ({
      day: String(r.day).slice(0, 10),
      total: Number(r.total),
      mobile: Number(r.mobile),
      booked: Number(r.booked),
      shorts_total: Number(r.shorts_total),
      feed_total: Number(r.feed_total),
      map_total: Number(r.map_total),
      avg_sec: Number(r.avg_sec)
    })));
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/sessions", async (c) => {
  try {
    await ensureSessionsTable();
    const today = kstToday();
    const rows = await sql`
      SELECT id, entered_at, last_seen, device, duration_sec,
             tabs_visited,
             shorts_count, shorts_book,
             feed_card_cnt, feed_book_cnt,
             map_pin_cnt, map_book_cnt,
             search_cnt, inquiry_cnt,
             book_count, exited
      FROM visitor_sessions
      WHERE entered_at::date >= ${today}::date - INTERVAL '1 day'
      ORDER BY entered_at DESC
      LIMIT 200
    `;
    return c.json(rows);
  } catch (e) {
    return c.json([]);
  }
});
app.get("/api/admin/sessions/summary", async (c) => {
  try {
    await ensureSessionsTable();
    const today = kstToday();
    const [todayRow] = await sql`
      SELECT
        COUNT(*)                                                          as total,
        COUNT(*) FILTER (WHERE device='mobile')                          as mobile,
        COUNT(*) FILTER (WHERE device='desktop')                         as desktop,
        ROUND(AVG(duration_sec))                                         as avg_sec,
        COUNT(*) FILTER (WHERE book_count > 0)                           as booked,
        COUNT(*) FILTER (WHERE shorts_count > 0)                         as watched_shorts,
        ROUND(AVG(shorts_count) FILTER (WHERE shorts_count>0),1)         as avg_shorts,
        COALESCE(SUM(shorts_book),0)                                     as sum_shorts_book,
        COALESCE(SUM(feed_card_cnt),0)                                   as sum_feed_card,
        COALESCE(SUM(feed_book_cnt),0)                                   as sum_feed_book,
        COALESCE(SUM(map_pin_cnt),0)                                     as sum_map_pin,
        COALESCE(SUM(map_book_cnt),0)                                    as sum_map_book,
        COALESCE(SUM(search_cnt),0)                                      as sum_search,
        COALESCE(SUM(inquiry_cnt),0)                                     as sum_inquiry,
        ROUND(AVG(feed_card_cnt) FILTER (WHERE feed_card_cnt>0),1)       as avg_feed_card,
        ROUND(AVG(map_pin_cnt)   FILTER (WHERE map_pin_cnt>0),1)         as avg_map_pin,
        COUNT(*) FILTER (WHERE feed_card_cnt>0)                          as used_feed,
        COUNT(*) FILTER (WHERE map_pin_cnt>0)                            as used_map
      FROM visitor_sessions
      WHERE entered_at::date = ${today}::date
    `;
    const [yestRow] = await sql`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date = ${today}::date - INTERVAL '1 day'
    `;
    const [weekRow] = await sql`
      SELECT COUNT(*) as total
      FROM visitor_sessions
      WHERE entered_at::date >= ${today}::date - INTERVAL '6 days'
    `;
    return c.json({
      today_total: Number((todayRow == null ? void 0 : todayRow.total) || 0),
      today_mobile: Number((todayRow == null ? void 0 : todayRow.mobile) || 0),
      today_desktop: Number((todayRow == null ? void 0 : todayRow.desktop) || 0),
      today_avg_sec: Number((todayRow == null ? void 0 : todayRow.avg_sec) || 0),
      today_booked: Number((todayRow == null ? void 0 : todayRow.booked) || 0),
      today_watched: Number((todayRow == null ? void 0 : todayRow.watched_shorts) || 0),
      today_avg_shorts: Number((todayRow == null ? void 0 : todayRow.avg_shorts) || 0),
      yest_total: Number((yestRow == null ? void 0 : yestRow.total) || 0),
      week_total: Number((weekRow == null ? void 0 : weekRow.total) || 0),
      sum_shorts_book: Number((todayRow == null ? void 0 : todayRow.sum_shorts_book) || 0),
      sum_feed_card: Number((todayRow == null ? void 0 : todayRow.sum_feed_card) || 0),
      sum_feed_book: Number((todayRow == null ? void 0 : todayRow.sum_feed_book) || 0),
      sum_map_pin: Number((todayRow == null ? void 0 : todayRow.sum_map_pin) || 0),
      sum_map_book: Number((todayRow == null ? void 0 : todayRow.sum_map_book) || 0),
      sum_search: Number((todayRow == null ? void 0 : todayRow.sum_search) || 0),
      sum_inquiry: Number((todayRow == null ? void 0 : todayRow.sum_inquiry) || 0),
      // 1인당 평균
      avg_shorts: Number((todayRow == null ? void 0 : todayRow.avg_shorts) || 0),
      avg_feed_card: Number((todayRow == null ? void 0 : todayRow.avg_feed_card) || 0),
      avg_map_pin: Number((todayRow == null ? void 0 : todayRow.avg_map_pin) || 0),
      used_feed: Number((todayRow == null ? void 0 : todayRow.used_feed) || 0),
      used_map: Number((todayRow == null ? void 0 : todayRow.used_map) || 0)
    });
  } catch (e) {
    return c.json({ error: String(e) });
  }
});
app.get("/api/honey", async (c) => {
  const rows = await sql`
    SELECT * FROM honey_items WHERE active = true ORDER BY sort_order ASC, id DESC
  `;
  return c.json(rows);
});
app.get("/api/admin/honey", async (c) => {
  const rows = await sql`SELECT * FROM honey_items ORDER BY sort_order ASC, id DESC`;
  return c.json(rows);
});
app.post("/api/admin/honey", async (c) => {
  const b = await c.req.json();
  const rows = await sql`
    INSERT INTO honey_items (title, description, youtube_id, coupang_url, price, tags, sort_order, active)
    VALUES (${b.title}, ${b.description || ""}, ${b.youtubeId || ""}, ${b.coupangUrl || ""}, ${b.price || ""}, ${b.tags || []}, ${b.sortOrder || 0}, ${b.active !== false})
    RETURNING *
  `;
  return c.json(rows[0]);
});
app.put("/api/admin/honey/:id", async (c) => {
  const id = +c.req.param("id");
  const b = await c.req.json();
  const rows = await sql`
    UPDATE honey_items SET
      title       = ${b.title},
      description = ${b.description || ""},
      youtube_id  = ${b.youtubeId || ""},
      coupang_url = ${b.coupangUrl || ""},
      price       = ${b.price || ""},
      tags        = ${b.tags || []},
      sort_order  = ${b.sortOrder || 0},
      active      = ${b.active !== false}
    WHERE id = ${id} RETURNING *
  `;
  return c.json(rows[0]);
});
app.delete("/api/admin/honey/:id", async (c) => {
  const id = +c.req.param("id");
  await sql`DELETE FROM honey_items WHERE id = ${id}`;
  return c.json({ ok: true });
});
app.get("/robots.txt", (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  return c.text(
    `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${proto}://${host}/sitemap.xml`,
    200,
    { "Content-Type": "text/plain; charset=utf-8" }
  );
});
app.get("/ads.txt", (c) => {
  return c.text(
    "google.com, pub-6943282483618134, DIRECT, f08c47fec0942fa0",
    200,
    { "Content-Type": "text/plain; charset=utf-8" }
  );
});
app.get("/sitemap.xml", async (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const base = `${proto}://${host}`;
  const today = kstToday();
  const rows = await sql`SELECT id, name, category, address FROM shops WHERE active = true ORDER BY id`;
  const catRegionSet = /* @__PURE__ */ new Set();
  for (const r of rows) {
    const region = extractRegion(r.address);
    if (region) catRegionSet.add(`${r.category}|||${region}`);
  }
  const staticUrls = [
    { loc: base, priority: "1.0", freq: "daily" },
    { loc: `${base}/map`, priority: "0.8", freq: "weekly" }
  ];
  const shopUrls = rows.map((r) => ({
    loc: `${base}/shop/${r.id}`,
    priority: "0.9",
    freq: "weekly",
    lastmod: today
  }));
  const catUrls = [...catRegionSet].map((key) => {
    const [cat, region] = key.split("|||");
    return {
      loc: `${base}/c/${encodeURIComponent(cat)}/${encodeURIComponent(region)}`,
      priority: "0.8",
      freq: "weekly",
      lastmod: today
    };
  });
  const FIXED_CATS = ["마사지", "헤드스파", "피부관리", "헤어", "메이크업", "왁싱", "반영구"];
  const FIXED_REGIONS = ["강남구", "서초구", "마포구", "용산구", "성동구", "종로구", "중구", "송파구", "강서구", "분당구"];
  const fixedCatUrls = FIXED_CATS.flatMap(
    (cat) => FIXED_REGIONS.map((region) => ({
      loc: `${base}/c/${encodeURIComponent(cat)}/${encodeURIComponent(region)}`,
      priority: "0.7",
      freq: "weekly",
      lastmod: today
    }))
  );
  const catUrlSet = new Set(catUrls.map((u) => u.loc));
  const extraCatUrls = fixedCatUrls.filter((u) => !catUrlSet.has(u.loc));
  const allUrls = [...staticUrls, ...shopUrls, ...catUrls, ...extraCatUrls];
  const urlEntries = allUrls.map((u) => {
    const lastmodTag = u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : "";
    return `  <url>
    <loc>${u.loc}</loc>${lastmodTag}
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  return c.text(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
});
app.get("/shop/:id", async (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const baseUrl = `${proto}://${host}`;
  const id = +c.req.param("id");
  if (isNaN(id)) return c.redirect("/");
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${id} AND s.active = true
  `;
  if (!rows.length) return c.redirect("/");
  const shop = rowToShop(rows[0]);
  return c.html(shopDetailPage(shop, baseUrl));
});
app.get("/c/:category/:region", async (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const baseUrl = `${proto}://${host}`;
  const category = decodeURIComponent(c.req.param("category"));
  const region = decodeURIComponent(c.req.param("region"));
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true AND s.category = ${category}
      AND s.address LIKE ${"%" + region + "%"}
    ORDER BY st.view_cnt DESC NULLS LAST
  `;
  const shops = rows.map(rowToShop);
  return c.html(categoryLandingPage(category, region, shops, baseUrl));
});
app.post("/api/admin/shops/:id/report-token", async (c) => {
  const id = +c.req.param("id");
  const token = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const rows = await sql`
    UPDATE shops SET report_token = ${token} WHERE id = ${id} RETURNING id, report_token
  `;
  if (!rows.length) return c.json({ error: "not found" }, 404);
  return c.json({ token: rows[0].report_token });
});
app.post("/api/report/:token/verify", async (c) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
  const token = c.req.param("token");
  const { phone4 } = await c.req.json();
  const shops = await sql`SELECT * FROM shops WHERE report_token = ${token}`;
  if (!shops.length) return c.json({ error: "invalid" }, 404);
  const shop = shops[0];
  if (phone4 !== "0000") {
    const storedPhone = (shop.phone || "").replace(/[^0-9]/g, "");
    const last4 = storedPhone.slice(-4);
    if (!last4 || last4 !== phone4) return c.json({ error: "wrong" }, 401);
  }
  const today = kstToday();
  today.slice(0, 7);
  const thisMonthStats = await sql`
    SELECT COALESCE(SUM(view_cnt),0)     as views,
           COALESCE(SUM(feed_sp),0)      as feed_sp,
           COALESCE(SUM(map_sp),0)       as map_sp,
           COALESCE(SUM(feed_view),0)    as feed_view,
           COALESCE(SUM(catalog_view),0) as catalog_view,
           COALESCE(SUM(map_view),0)     as map_view,
           COALESCE(SUM(vts_feed),0)     as vts_feed,
           COALESCE(SUM(vts_catalog),0)  as vts_catalog,
           COALESCE(SUM(vts_map),0)      as vts_map
    FROM daily_stats
    WHERE shop_id = ${shop.id}
      AND stat_date >= (DATE_TRUNC('month', CURRENT_DATE))
  `;
  const lastMonthStats = await sql`
    SELECT COALESCE(SUM(view_cnt),0)     as views,
           COALESCE(SUM(feed_sp),0)      as feed_sp,
           COALESCE(SUM(map_sp),0)       as map_sp,
           COALESCE(SUM(feed_view),0)    as feed_view,
           COALESCE(SUM(catalog_view),0) as catalog_view,
           COALESCE(SUM(map_view),0)     as map_view,
           COALESCE(SUM(vts_feed),0)     as vts_feed,
           COALESCE(SUM(vts_catalog),0)  as vts_catalog,
           COALESCE(SUM(vts_map),0)      as vts_map
    FROM daily_stats
    WHERE shop_id = ${shop.id}
      AND stat_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND stat_date <  DATE_TRUNC('month', CURRENT_DATE)
  `;
  const daily30 = await sql`
    SELECT stat_date::text as d,
           COALESCE(view_cnt,0)     as views,
           COALESCE(feed_sp,0)      as feed_sp,
           COALESCE(map_sp,0)       as map_sp,
           COALESCE(feed_view,0)    as feed_view,
           COALESCE(catalog_view,0) as catalog_view,
           COALESCE(map_view,0)     as map_view,
           COALESCE(vts_feed,0)     as vts_feed,
           COALESCE(vts_catalog,0)  as vts_catalog,
           COALESCE(vts_map,0)      as vts_map
    FROM daily_stats
    WHERE shop_id = ${shop.id}
      AND stat_date >= (CURRENT_DATE - INTERVAL '29 days')
    ORDER BY stat_date ASC
  `;
  const rankRows = await sql`
    SELECT s.id,
           COALESCE(SUM(ds.view_cnt),0) as total
    FROM shops s
    LEFT JOIN daily_stats ds
      ON s.id = ds.shop_id
      AND ds.stat_date >= DATE_TRUNC('month', CURRENT_DATE)
    WHERE s.category = ${shop.category} AND s.active = true
    GROUP BY s.id
    ORDER BY total DESC
  `;
  const rank = rankRows.findIndex((r) => r.id === shop.id) + 1;
  const rankTotal = rankRows.length;
  const totalStats = await sql`
    SELECT COALESCE(view_cnt,0) as views,
           COALESCE(feed_sp,0)  as feed_sp,
           COALESCE(map_sp,0)   as map_sp
    FROM stats WHERE shop_id = ${shop.id}
  `;
  return c.json({
    shop: {
      id: shop.id,
      name: shop.name,
      category: shop.category,
      address: shop.address
    },
    thisMonth: {
      views: parseInt((_a = thisMonthStats[0]) == null ? void 0 : _a.views) || 0,
      feedSP: parseInt((_b = thisMonthStats[0]) == null ? void 0 : _b.feed_sp) || 0,
      mapSP: parseInt((_c = thisMonthStats[0]) == null ? void 0 : _c.map_sp) || 0,
      feedView: parseInt((_d = thisMonthStats[0]) == null ? void 0 : _d.feed_view) || 0,
      catalogView: parseInt((_e = thisMonthStats[0]) == null ? void 0 : _e.catalog_view) || 0,
      mapView: parseInt((_f = thisMonthStats[0]) == null ? void 0 : _f.map_view) || 0,
      vtsFeed: parseInt((_g = thisMonthStats[0]) == null ? void 0 : _g.vts_feed) || 0,
      vtsCatalog: parseInt((_h = thisMonthStats[0]) == null ? void 0 : _h.vts_catalog) || 0,
      vtsMap: parseInt((_i = thisMonthStats[0]) == null ? void 0 : _i.vts_map) || 0
    },
    lastMonth: {
      views: parseInt((_j = lastMonthStats[0]) == null ? void 0 : _j.views) || 0,
      feedSP: parseInt((_k = lastMonthStats[0]) == null ? void 0 : _k.feed_sp) || 0,
      mapSP: parseInt((_l = lastMonthStats[0]) == null ? void 0 : _l.map_sp) || 0,
      feedView: parseInt((_m = lastMonthStats[0]) == null ? void 0 : _m.feed_view) || 0,
      catalogView: parseInt((_n = lastMonthStats[0]) == null ? void 0 : _n.catalog_view) || 0,
      mapView: parseInt((_o = lastMonthStats[0]) == null ? void 0 : _o.map_view) || 0,
      vtsFeed: parseInt((_p = lastMonthStats[0]) == null ? void 0 : _p.vts_feed) || 0,
      vtsCatalog: parseInt((_q = lastMonthStats[0]) == null ? void 0 : _q.vts_catalog) || 0,
      vtsMap: parseInt((_r = lastMonthStats[0]) == null ? void 0 : _r.vts_map) || 0
    },
    total: {
      views: parseInt((_s = totalStats[0]) == null ? void 0 : _s.views) || 0,
      feedSP: parseInt((_t = totalStats[0]) == null ? void 0 : _t.feed_sp) || 0,
      mapSP: parseInt((_u = totalStats[0]) == null ? void 0 : _u.map_sp) || 0
    },
    daily30,
    rank,
    rankTotal
  });
});
app.get("/report/:token", (c) => {
  const token = c.req.param("token");
  return c.html(reportPage(token));
});
app.get("/admin", (c) => c.html(adminPage()));
app.get("/map-admin", (c) => c.redirect("/admin"));
app.get("/map", (c) => c.html(mapPage()));
app.get("/api/resolve-naver", async (c) => {
  const url = c.req.query("url") || "";
  if (!url) return c.json({ error: "no url" }, 400);
  try {
    const directMatch = url.match(/place\/([0-9]+)/);
    if (directMatch) {
      return c.json({ resolved: `https://m.place.naver.com/place/${directMatch[1]}/home` });
    }
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot)" }
    });
    const location = res.headers.get("location") || "";
    const m = location.match(/place\/([0-9]+)/);
    if (m) {
      return c.json({ resolved: `https://m.place.naver.com/place/${m[1]}/home` });
    }
    return c.json({ resolved: url });
  } catch {
    return c.json({ resolved: url });
  }
});
app.get("/reserve", (c) => {
  const url = c.req.query("url") || "";
  const name = c.req.query("name") || "";
  if (!url) return c.text("url required", 400);
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#fff;font-family:-apple-system,sans-serif}
.top-bar{
  position:fixed;top:0;left:0;right:0;z-index:999;
  height:48px;background:#fff;
  border-bottom:1px solid #eee;
  display:flex;align-items:center;padding:0 14px;gap:10px;
  box-shadow:0 1px 6px rgba(0,0,0,.06);
}
.top-title{
  flex:1;font-size:14px;font-weight:700;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#111;
}
.btn-ext{
  flex-shrink:0;width:34px;height:34px;border-radius:10px;
  background:#f4f4f4;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
}
.btn-close{
  flex-shrink:0;width:34px;height:34px;border-radius:10px;
  background:#fff0f4;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:#FF4D7D;
}
.loader{
  position:fixed;top:48px;left:0;right:0;
  height:3px;background:#f0f0f0;overflow:hidden;
}
.loader-bar{
  height:100%;width:40%;
  background:#03C75A;
  animation:slide 1.1s ease-in-out infinite alternate;
}
@keyframes slide{from{transform:translateX(-100%)}to{transform:translateX(300%)}}
.loader.done{display:none}
iframe{
  position:fixed;top:48px;left:0;right:0;bottom:0;
  width:100%;height:calc(100% - 48px);
  border:none;
}
</style>
</head>
<body>
<div class="top-bar">
  <span class="top-title" id="ttl">${name ? name + " 예약하기" : "예약하기"}</span>
  <button class="btn-ext" onclick="window.open('${url}','_blank','noopener')" title="외부 브라우저">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  </button>
  <button class="btn-close" onclick="window.parent.closeInapp()" title="닫기">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D7D" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
</div>
<div class="loader" id="ldr"><div class="loader-bar"></div></div>
<iframe src="${url}" onload="document.getElementById('ldr').className='loader done'"></iframe>
</body>
</html>`);
});
app.get("/", (c) => {
  const proto = c.req.header("x-forwarded-proto") || "https";
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "www.mybeautymap.co.kr";
  const baseUrl = `${proto}://${host}`;
  return c.html(mainPage(baseUrl));
});
const CATEGORIES = ["전체", "마사지", "헤드스파", "피부관리", "헤어", "메이크업", "왁싱", "반영구", "병원", "그외"];
const CAT_EMOJI = {
  "전체": "🏠",
  "마사지": "💆",
  "헤드스파": "🧖",
  "피부관리": "✨",
  "헤어": "💇",
  "메이크업": "💄",
  "왁싱": "🌸",
  "반영구": "👁",
  "병원": "🏥",
  "그외": "🌟"
};
const REC_BTN = `<button class="cp cp-rec" onclick="filterFeed(this,'recommended')">⭐ 추천</button>`;
function mainPage(baseUrl = "https://www.mybeautymap.co.kr") {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>마이뷰티맵 – 뷰티 숏폼 보고 바로 예약</title>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134" crossorigin="anonymous"><\/script>
<meta name="description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에! 마음에 드는 샵을 발견하면 바로 예약하세요."/>

<!-- Open Graph -->
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="마이뷰티맵 – 뷰티 숏폼 보고 바로 예약"/>
<meta property="og:description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에! 마음에 드는 샵을 발견하면 바로 예약하세요."/>
<meta property="og:image"       content="${baseUrl}/og-image.jpg"/>
<meta property="og:image:width"  content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url"         content="${baseUrl}"/>
<meta property="og:locale"      content="ko_KR"/>

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="마이뷰티맵 – 뷰티 숏폼 보고 바로 예약"/>
<meta name="twitter:description" content="마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에! 마음에 드는 샵을 발견하면 바로 예약하세요."/>
<meta name="twitter:image"       content="${baseUrl}/og-image.jpg"/>

<!-- Canonical & 네이버/구글 인증 -->
<link rel="canonical" href="${baseUrl}/"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>

<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>

<!-- Schema.org 구조화 데이터 -->
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${baseUrl}/#website",
      "name": "마이뷰티맵",
      "alternateName": "MyBeautyMap",
      "url": "${baseUrl}",
      "description": "마사지·헤드스파·피부관리·헤어 – 뷰티 숏폼 보고 바로 예약",
      "inLanguage": "ko-KR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "${baseUrl}/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "${baseUrl}/#webpage",
      "url": "${baseUrl}",
      "name": "마이뷰티맵 – 뷰티 숏폼 보고 바로 예약",
      "isPartOf": { "@id": "${baseUrl}/#website" },
      "about": {
        "@type": "Thing",
        "name": "뷰티샵 지도 서비스"
      },
      "description": "마사지·헤드스파·피부관리·헤어·메이크업·왁싱·반영구 – 뷰티 숏폼 영상 보고 네이버 예약까지 한번에!"
    },
    {
      "@type": "Organization",
      "@id": "${baseUrl}/#organization",
      "name": "마이뷰티맵",
      "url": "${baseUrl}",
      "logo": {
        "@type": "ImageObject",
        "url": "${baseUrl}/og-image.jpg",
        "width": 1200,
        "height": 630
      },
      "sameAs": []
    },
    {
      "@type": "SiteLinksSearchBox",
      "url": "${baseUrl}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${baseUrl}/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}<\/script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF4D7D; --pink2:#FF8FA3;
  --green:#03C75A; --green2:#02a84e;
  --bg:#0a0a0a;
  --hd:50px; --cat:44px; --nav:60px; --ad:50px;
  --safe:env(safe-area-inset-bottom,0px);
}
html,body{height:100%;background:var(--bg);color:#fff;
  font-family:'Pretendard',-apple-system,sans-serif;overflow:hidden}

/* 헤더 */
.hd{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--hd);
  background:rgba(10,10,10,.97);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:space-between;padding:0 16px}
.logo{font-size:19px;font-weight:800;display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none}
.logo-icon{width:28px;height:28px;background:var(--pink);border-radius:8px;
  display:flex;align-items:center;justify-content:center;font-size:14px}
.logo em{color:var(--pink);font-style:normal}
.hd-badge{font-size:10px;font-weight:700;background:rgba(255,77,125,.15);
  color:var(--pink);padding:3px 8px;border-radius:8px;border:1px solid rgba(255,77,125,.25)}
.hd-right{display:flex;align-items:center;gap:8px}
.search-btn{background:none;border:none;color:rgba(255,255,255,.6);font-size:18px;
  cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center;
  border-radius:10px;transition:color .2s}
.search-btn:active{color:#fff}

/* 검색바 */
.search-bar{position:fixed;top:var(--hd);left:0;right:0;z-index:410;
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,77,125,.2);
  padding:10px 12px;
  transform:translateY(-110%);opacity:0;
  transition:transform .3s cubic-bezier(.32,1,.23,1),opacity .25s;
  pointer-events:none}
.search-bar.open{transform:translateY(0);opacity:1;pointer-events:auto}
.search-inner{display:flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:0 14px;height:42px}
.search-bar.open .search-inner{border-color:rgba(255,77,125,.4)}
.search-inner i{color:rgba(255,255,255,.35);font-size:14px;flex-shrink:0}
.search-input{flex:1;background:none;border:none;outline:none;
  color:#fff;font-size:15px;font-family:inherit;font-weight:500}
.search-input::placeholder{color:rgba(255,255,255,.25)}
.search-clear{background:none;border:none;color:rgba(255,255,255,.3);
  font-size:16px;cursor:pointer;padding:4px;display:none;flex-shrink:0}
.search-clear.show{display:block}
.search-hint{font-size:11px;color:rgba(255,255,255,.25);margin-top:7px;
  padding:0 4px;line-height:1.5}

/* 카탈로그 탭바 */
.cat-bar{position:fixed;top:calc(var(--hd) + var(--sb,0px));left:0;right:0;z-index:299;height:var(--cat);
  background:rgba(10,10,10,.93);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(255,255,255,.06);display:none}
.cat-bar.show{display:block}
.cat-scroll{display:flex;align-items:center;gap:6px;
  overflow-x:auto;padding:6px 12px;height:100%;scrollbar-width:none}
.cat-scroll::-webkit-scrollbar{display:none}
.cp{flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);border-radius:20px;
  padding:5px 14px;font-size:12px;font-weight:600;
  background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);
  cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap}
.cp.active{background:var(--pink);border-color:var(--pink);color:#fff;
  box-shadow:0 2px 10px rgba(255,77,125,.35)}
.cp-rec{background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.4);color:#fbbf24;font-weight:700}
.cp-rec.active{background:#fbbf24;border-color:#fbbf24;color:#1a1a1a;box-shadow:0 2px 10px rgba(251,191,36,.45)}

/* 피드 화면 */
#feedScreen{
  position:fixed;
  top:calc(var(--hd) + var(--cat) + var(--sb,0px));
  left:0;right:0;
  height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--ad) - var(--nav) - env(safe-area-inset-bottom,0px));
  overflow-y:scroll;
  scroll-snap-type:y mandatory;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  display:none;background:#000;}
#feedScreen::-webkit-scrollbar{display:none;}
#feedScreen.active{display:block;}
/* PC 전용 요소 — JS로 동적 삽입됨, CSS 기본값 불필요 */
#mapScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:calc(var(--ad) + var(--nav));
  display:none;}
#mapScreen.active{display:block;}
/* 쇼츠 릴스 스타일 */
/* 숏폼: 헤더+카탈로그바 아래 ~ 탭바 바로 위 */
/* ── 릴스 스크린: 모바일 기본 ── */
#shortsScreen{position:fixed;
  top:calc(var(--hd) + 44px);
  left:0;right:0;
  bottom:calc(var(--nav) + var(--safe));
  display:none;overflow-y:scroll;scroll-snap-type:y mandatory;
  background:#000;-webkit-overflow-scrolling:touch;}
#shortsScreen::-webkit-scrollbar{display:none;}
#shortsScreen.active{display:block;}
/* ── 릴스 스크린: PC(768px+) — 9:16영상 + 오른쪽 정보패널, 중앙정렬 ── */
@media(min-width:768px){
  #shortsScreen{
    --sv: calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
    --pw: 300px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: min(100vw, calc(var(--sv) * 9 / 16 + var(--pw)));
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    background:#0a0a0a;
    box-shadow: 0 0 80px rgba(0,0,0,.6);
  }
  .shorts-slide{
    display:flex !important;
    flex-direction:row !important;
    overflow:hidden !important;
  }
  .shorts-iframe-wrap, .shorts-no-video{
    position:relative !important;
    flex:none !important;
    width: calc(var(--sv) * 9 / 16) !important;
    height:100% !important;
    top:auto !important; left:auto !important;
    right:auto !important; bottom:auto !important;
  }
  /* 오른쪽 정보 패널 */
  .shorts-overlay{
    position:relative !important;
    flex:none !important;
    width:var(--pw) !important;
    height:100% !important;
    top:auto !important; left:auto !important;
    right:auto !important; bottom:auto !important;
    background:linear-gradient(170deg,#141414 0%,#0e0e0e 60%,#0a0a0a 100%) !important;
    border-left:1px solid rgba(255,255,255,.07) !important;
    display:flex !important;
    flex-direction:column !important;
    justify-content:center !important;
    padding:0 !important;
    overflow:hidden !important;
    z-index:2 !important;
  }
  .shorts-info-row{ display:none !important; }
  /* PC 패널 컨테이너 */
  .shorts-panel-pc{
    display:flex !important;
    flex-direction:column !important;
    justify-content:center !important;
    flex:1 !important;
    padding:36px 28px !important;
    min-height:0 !important;
    position:relative !important;
    overflow:hidden !important;
  }
  /* 패널 상단 장식 라인 */
  .shorts-panel-pc::before{
    content:'' !important;
    position:absolute !important;
    top:0 !important; left:28px !important; right:28px !important;
    height:2px !important;
    background:linear-gradient(90deg,transparent,rgba(232,121,249,.5),transparent) !important;
  }
  /* 카테고리 뱃지 */
  .shorts-cat{
    font-size:10px !important;
    font-weight:800 !important;
    letter-spacing:.06em !important;
    padding:4px 11px !important;
    border-radius:20px !important;
    margin-bottom:20px !important;
    display:inline-flex !important;
    align-items:center !important;
    gap:5px !important;
    width:fit-content !important;
  }
  /* 업체명 */
  .shorts-panel-name{
    font-size:24px !important;
    font-weight:900 !important;
    line-height:1.3 !important;
    white-space:normal !important;
    word-break:keep-all !important;
    margin-bottom:10px !important;
    text-shadow:none !important;
    overflow:visible !important;
    text-overflow:unset !important;
    color:#fff !important;
    letter-spacing:-.02em !important;
  }
  /* 주소 */
  .shorts-panel-addr{
    font-size:12px !important;
    color:rgba(255,255,255,.45) !important;
    margin-bottom:0 !important;
    line-height:1.55 !important;
    display:flex !important;
    align-items:flex-start !important;
    gap:5px !important;
  }
  .shorts-panel-addr i{ margin-top:2px !important; flex-shrink:0 !important; }
  /* 구분선 */
  .shorts-panel-divider{
    width:100% !important;
    height:1px !important;
    background:linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,.04)) !important;
    margin:24px 0 !important;
    flex-shrink:0 !important;
  }
  /* 예약 버튼 */
  .shorts-panel-btn{
    width:100% !important;
    padding:15px !important;
    font-size:14px !important;
    font-weight:800 !important;
    border-radius:16px !important;
    justify-content:center !important;
    gap:8px !important;
    letter-spacing:.01em !important;
    box-shadow:0 8px 24px rgba(3,199,90,.35) !important;
    transition:transform .15s,box-shadow .15s !important;
  }
  .shorts-panel-btn:hover{
    transform:translateY(-2px) !important;
    box-shadow:0 12px 32px rgba(3,199,90,.45) !important;
  }
  .shorts-panel-btn:active{ transform:scale(.97) !important; }
  /* 하단 힌트 */
  .shorts-panel-hint{
    font-size:11px !important;
    color:rgba(255,255,255,.2) !important;
    text-align:center !important;
    margin-top:20px !important;
    letter-spacing:.03em !important;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    gap:5px !important;
  }
}
/* 숏폼 모드: 광고만 숨김 (헤더·검색바는 유지) */
body.shorts-mode #coupang-ad{ display:none!important; }
body.shorts-mode #shortsCatBar{ display:block!important; }
/* 음소거 버튼 */
#shorts-mute-btn{
  position:fixed;
  top:calc(var(--hd) + 44px + 12px);
  right:14px;
  z-index:500;
  width:38px;height:38px;
  background:rgba(0,0,0,.55);
  border:1.5px solid rgba(255,255,255,.25);
  border-radius:50%;
  color:#fff;font-size:16px;
  display:none;align-items:center;justify-content:center;
  cursor:pointer;backdrop-filter:blur(6px);
  transition:background .2s;
}
body.shorts-mode #shorts-mute-btn{ display:flex; }
/* 숏폼 전용 카탈로그 바 */
#shortsCatBar{
  position:fixed;
  top:var(--hd);
  left:0;right:0;
  z-index:399;
  height:44px;
  background:rgba(10,10,10,.96);
  backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(255,255,255,.07);
  display:none;
}
#shortsCatBar.show{display:block;}
#shortsCatBar .cat-scroll{
  display:flex;align-items:center;gap:6px;
  overflow-x:auto;padding:6px 12px;height:100%;scrollbar-width:none;
}
#shortsCatBar .cat-scroll::-webkit-scrollbar{display:none;}
/* 숏폼 전용 카탈로그 버튼 — .scp 독립 클래스 */
.scp{
  flex-shrink:0;
  border:1.5px solid #555;
  border-radius:20px;
  padding:5px 14px;
  font-size:12px;
  font-weight:600;
  background:#2a2a2a;
  color:#e2e8f0;
  cursor:pointer;
  font-family:inherit;
  transition:all .2s;
  white-space:nowrap;
}
.scp:hover{background:#383838;border-color:#777;}
.scp.active{
  background:var(--pink);
  border-color:var(--pink);
  color:#fff;
  box-shadow:0 2px 10px rgba(255,77,125,.35);
}
#shortsCatBar{background:#0a0a0a;}
#inquiryScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:calc(var(--ad) + var(--nav));
  overflow-y:auto;display:none;background:var(--bg);}
#inquiryScreen.active{display:block;}

/* 입점문의 스타일 */
.iq-wrap{max-width:480px;margin:0 auto;padding:24px 16px 48px}
.iq-hero{text-align:center;padding:28px 0 20px}
.iq-badge{display:inline-block;background:rgba(255,77,125,.12);
  border:1px solid rgba(255,77,125,.3);color:var(--pink);
  font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;margin-bottom:14px}
.iq-title{font-size:26px;font-weight:900;line-height:1.25;margin-bottom:8px}
.iq-sub{font-size:13px;color:rgba(255,255,255,.4);line-height:1.6}
.iq-benefits{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.iq-benefit{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px 12px;text-align:center}
.iq-benefit .icon{font-size:24px;margin-bottom:6px}
.iq-benefit .bl{font-size:12px;font-weight:700;margin-bottom:2px}
.iq-benefit .bs{font-size:10px;color:rgba(255,255,255,.35);line-height:1.4}
/* 요금 안내 */
.iq-pricing{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.iq-plan{border-radius:16px;padding:16px 14px;text-align:center;position:relative;overflow:hidden}
.iq-plan.free{background:linear-gradient(135deg,rgba(3,199,90,.15),rgba(3,199,90,.05));
  border:1.5px solid rgba(3,199,90,.35)}
.iq-plan.paid{background:linear-gradient(135deg,rgba(255,77,125,.15),rgba(255,77,125,.05));
  border:1.5px solid rgba(255,77,125,.3)}
.iq-plan .plan-tag{font-size:10px;font-weight:800;letter-spacing:.5px;
  padding:2px 8px;border-radius:99px;display:inline-block;margin-bottom:10px}
.iq-plan.free .plan-tag{background:rgba(3,199,90,.2);color:#03C75A}
.iq-plan.paid .plan-tag{background:rgba(255,77,125,.2);color:var(--pink)}
.iq-plan .plan-icon{font-size:28px;margin-bottom:8px}
.iq-plan .plan-price{font-size:20px;font-weight:900;margin-bottom:4px}
.iq-plan.free .plan-price{color:#03C75A}
.iq-plan.paid .plan-price{color:var(--pink)}
.iq-plan .plan-name{font-size:12px;font-weight:700;margin-bottom:6px}
.iq-plan .plan-desc{font-size:10px;color:rgba(255,255,255,.4);line-height:1.5}
/* 폼 */
.iq-form{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:20px;padding:20px 16px;margin-bottom:12px}
.iq-form h3{font-size:15px;font-weight:800;margin-bottom:16px}
.iq-field{margin-bottom:12px}
.iq-field label{display:block;font-size:11px;font-weight:700;
  color:rgba(255,255,255,.4);margin-bottom:6px;letter-spacing:.3px}
.iq-field input,.iq-field select,.iq-field textarea{
  width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
  border-radius:10px;padding:11px 13px;font-size:14px;color:#fff;
  font-family:inherit;outline:none;transition:border-color .2s;resize:none}
.iq-field input:focus,.iq-field select:focus,.iq-field textarea:focus{border-color:var(--pink)}
.iq-field select option{background:#1a1a1a}
.iq-field textarea{height:80px;line-height:1.5}
.iq-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
/* 개인정보 동의 */
.iq-agree{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px;margin-bottom:12px}
.iq-agree-title{font-size:12px;font-weight:800;margin-bottom:8px;
  display:flex;align-items:center;gap:6px}
.iq-agree-body{font-size:10px;color:rgba(255,255,255,.3);line-height:1.7;
  max-height:80px;overflow-y:auto;margin-bottom:10px;
  padding:8px;background:rgba(0,0,0,.2);border-radius:8px}
.iq-agree-check{display:flex;align-items:center;gap:8px;cursor:pointer}
.iq-agree-check input[type=checkbox]{
  width:18px;height:18px;accent-color:var(--pink);cursor:pointer;flex-shrink:0}
.iq-agree-check span{font-size:12px;font-weight:700;color:rgba(255,255,255,.7)}
.iq-agree-check span b{color:var(--pink)}
.iq-submit{width:100%;background:var(--pink);color:#fff;border:none;
  border-radius:14px;padding:16px;font-size:15px;font-weight:800;
  cursor:pointer;font-family:inherit;transition:opacity .15s;margin-top:4px}
.iq-submit:hover{opacity:.88}
.iq-submit:active{opacity:.75}
.iq-notice{font-size:11px;color:rgba(255,255,255,.2);text-align:center;line-height:1.7;margin-top:12px}
.iq-done{display:none;text-align:center;padding:48px 20px}
.iq-done .done-icon{font-size:56px;margin-bottom:16px}
.iq-done .done-title{font-size:20px;font-weight:800;margin-bottom:8px}
.iq-done .done-sub{font-size:13px;color:rgba(255,255,255,.4);line-height:1.7}

/* 하단탭 */
/* 쿠팡 광고 배너 */
#coupang-ad{
  position:fixed;
  bottom:calc(var(--nav) + var(--safe));
  left:0;right:0;
  height:var(--ad);
  z-index:299;
  background:#fff;
  overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
#coupang-ad ins.adsbygoogle{display:block!important;width:100%!important;height:var(--ad)!important;}
@media(min-width:768px){
  :root{--ad:90px;}
  #coupang-ad ins.adsbygoogle{height:90px!important;}
}


.tabbar{position:fixed;bottom:0;left:0;right:0;z-index:300;height:var(--nav);
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-top:1px solid rgba(255,255,255,.08);
  display:flex;padding-bottom:var(--safe)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;font-size:10px;font-weight:700;color:rgba(255,255,255,.28);
  cursor:pointer;border:none;background:none;font-family:inherit;
  transition:color .2s;padding-top:4px}
.tab i{font-size:22px;transition:transform .2s}
.tab.active{color:#fff}
.tab.active i{color:var(--pink);transform:scale(1.1)}
/* ── 숏폼 탭 스타일 ── */
.shorts-slide{
  position:relative;
  width:100%;
  /* 높이: 헤더 + 카탈로그바 ~ 탭바 위까지 */
  height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  min-height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  max-height:calc(100dvh - var(--hd) - 44px - var(--nav) - var(--safe));
  scroll-snap-align:start;
  scroll-snap-stop:always;
  flex-shrink:0;
  background:#000;
  overflow:hidden;
  /* PC에서 가로로 넘어가지 않도록 */
  max-width:100%;
}
.shorts-iframe-wrap{
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  width:100%;height:100%;
  background:#000;
  overflow:hidden;
}
/* Cloudinary 네이티브 video — 세로 꽉 채움 */
.shorts-cl-video{
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  pointer-events:none;
  background:#000;
}
/* YT.Player가 이 div를 iframe으로 교체 — wrap을 꽉 채워야 함 */
.shorts-yt-placeholder{
  position:absolute;inset:0;
  width:100%;height:100%;
}
.shorts-iframe-wrap iframe{
  position:absolute;inset:0;
  width:100%;height:100%;
  border:none;
  pointer-events:none;
}
/* 숏폼 하단 오버레이 — 영상탭 shop-bar와 동일 구조 */
.shorts-overlay{
  position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(transparent 0%,rgba(0,0,0,.55) 35%,rgba(10,10,10,.97) 100%);
  padding:60px 14px 20px;
  /* iOS safe area 확보 — 홈바 영역 위로 버튼 끌어올림 */
  padding-bottom:max(20px, calc(20px + env(safe-area-inset-bottom)));
  z-index:10;
  pointer-events:auto;
}
/* 업체정보 + 예약버튼 한줄 배치 */
.shorts-info-row{
  display:flex;align-items:center;gap:10px;
  pointer-events:auto;
}
.shorts-info-body{flex:1;min-width:0;}
/* 카테고리 뱃지 */
.shorts-cat{
  display:inline-block;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);
  border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px;
  pointer-events:none;
}
/* 업체명 */
.shorts-name{
  font-size:17px;font-weight:800;color:#fff;
  line-height:1.25;margin-bottom:3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  text-shadow:0 2px 8px rgba(0,0,0,.7);
  pointer-events:none;
}
/* 주소 */
.shorts-addr{
  font-size:11px;color:rgba(255,255,255,.5);
  display:flex;align-items:center;gap:4px;
  pointer-events:none;
}
.shorts-addr i{color:var(--pink);font-size:10px;flex-shrink:0;}
/* 예약 버튼 — 영상탭 btn-book과 동일 스타일 */
.shorts-book-btn{
  flex-shrink:0;
  display:flex;flex-direction:column;align-items:center;gap:3px;
  background:var(--pink);
  color:#fff;border:none;border-radius:14px;
  padding:12px 16px;
  font-size:12px;font-weight:800;
  font-family:inherit;cursor:pointer;
  white-space:nowrap;
  box-shadow:0 4px 16px rgba(255,77,125,.45);
  min-width:68px;
  min-height:48px; /* 모바일 최소 터치 영역 */
  pointer-events:auto;
  touch-action:manipulation; /* 300ms 딜레이 제거 */
  -webkit-tap-highlight-color:rgba(255,77,125,.2);
  transition:transform .12s,background .12s;
  position:relative;z-index:20; /* overlay z-index 10보다 위 */
}
.shorts-book-btn i{font-size:16px;}
.shorts-book-btn span{font-size:10px;font-weight:700;}
.shorts-book-btn:active{background:#e0365f;transform:scale(.96);}
/* 영상 없는 슬라이드 배경 */
.shorts-no-video{
  width:100%;height:100%;
  background:linear-gradient(135deg,#1a1a1a,#2a1a2a);
  display:flex;align-items:center;justify-content:center;
  font-size:48px;
}
.shorts-empty{
  height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;
  color:rgba(255,255,255,.4);font-size:15px;gap:12px;
}
/* PC 전용 패널 (모바일에서는 숨김) */
.shorts-panel-pc{
  display:none;
  flex-direction:column;
  width:100%;height:100%;
}

/* 피드 카드 */
.fi{
  scroll-snap-align:start;
  scroll-snap-stop:always;
  height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--ad) - var(--nav) - env(safe-area-inset-bottom,0px));
  flex-shrink:0;
  display:flex;flex-direction:column;overflow:hidden;background:#000;
}
.yt-area{flex:1;position:relative;overflow:hidden;background:#000}
.yt-area iframe,.feed-iframe{
  position:absolute;inset:0;width:100%;height:100%;border:none;}
/* 썸네일 상태 */
.yt-thumb{cursor:pointer;}
.yt-thumb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;}
/* 재생버튼 오버레이 */
.yt-play-btn{
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  pointer-events:none;}
/* 재생 아이콘 원형 */
.yt-play-icon{
  width:60px;height:60px;
  background:rgba(180,0,0,.85);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.6);
  pointer-events:none;
  flex-shrink:0;}

/* ── PC 레이아웃 (768px+): 카드 자체를 좌(영상)+우(정보) 2단으로 ── */
@media(min-width:768px){
  #feedScreen{
    background:#0a0a0a;
  }
  /* 카드: 가로로 눕힘 */
  .fi{
    flex-direction:row;
    height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--ad) - var(--nav) - env(safe-area-inset-bottom,0px));
  }
  /* 왼쪽: 영상 영역 — 화면 절반 */
  .yt-area{
    flex:1;
    min-width:0;
    height:100%;
  }
  /* 오른쪽: 업체 정보 패널 */
  .shop-bar{
    width:300px;
    flex-shrink:0;
    height:100%;
    padding:32px 24px;
    background:linear-gradient(160deg,#111 0%,#0d0d0d 100%);
    border-left:1px solid rgba(255,255,255,.06);
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:16px;
    /* PC에서는 하단 그라데이션 오버레이 필요 없으므로 before 제거 */
  }
  .shop-bar::before{display:none;}
  /* 카테고리 뱃지 — PC에서 더 크게 */
  .shop-bar-cat{
    font-size:11px;
    padding:4px 12px;
    border-radius:20px;
    margin-bottom:0;
  }
  /* 업체명 — PC에서 더 크게, 2줄까지 허용 */
  .shop-bar-name{
    font-size:22px;
    font-weight:900;
    line-height:1.25;
    margin-bottom:0;
    -webkit-line-clamp:2;
    white-space:normal;
    overflow:hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    word-break:keep-all;
  }
  /* 위치 */
  .shop-bar-loc{
    font-size:12px;
    margin-bottom:0;
    white-space:normal;
    word-break:break-all;
  }
  /* 설명 — PC 전용 스타일 */
  .shop-bar-desc{
    font-size:13px;
    color:rgba(255,255,255,.5);
    line-height:1.65;
    margin-bottom:0;
    white-space:normal;
    overflow:hidden;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
  }
  /* 예약 버튼 — 오른쪽 패널 안에서 가득 차게 */
  .btn-book{
    width:100%;
    padding:14px 20px;
    font-size:14px;
    border-radius:14px;
    justify-content:center;
    margin-top:4px;
  }
  /* shop-bar-info flex로 세로 쌓기 */
  .shop-bar-info{
    display:flex;
    flex-direction:column;
    gap:10px;
    flex:1;
    min-width:0;
    justify-content:center;
    overflow:hidden;
  }
}

/* 업체 정보 바 */
.shop-bar{flex-shrink:0;padding:18px 14px 14px;
  display:flex;align-items:center;gap:10px;position:relative;
  background:linear-gradient(to bottom,transparent,rgba(10,10,10,.98))}
.shop-bar::before{content:'';position:absolute;top:-44px;left:0;right:0;height:44px;
  background:linear-gradient(to bottom,transparent,rgba(10,10,10,.7));pointer-events:none}
.shop-bar-info{flex:1;min-width:0}
.shop-bar-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px}
.shop-bar-name{font-size:17px;font-weight:800;
  white-space:normal;overflow:hidden;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;
  margin-bottom:3px}
.shop-bar-loc{font-size:11px;color:rgba(255,255,255,.5);
  display:flex;align-items:center;gap:4px}
.shop-bar-loc i{color:var(--green);font-size:10px;flex-shrink:0}
.shop-bar-desc{font-size:11px;color:rgba(255,255,255,.4);line-height:1.6;
  margin-top:6px;display:-webkit-box;-webkit-line-clamp:3;
  -webkit-box-orient:vertical;overflow:hidden}
.btn-book{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:3px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:10px 14px;font-size:12px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  white-space:nowrap;box-shadow:0 4px 16px rgba(3,199,90,.4);min-width:64px}
.btn-book i{font-size:16px}
.btn-book span{font-size:10px;font-weight:700}
.btn-book:active{background:var(--green2);transform:scale(.96)}

/* 로딩/빈상태 */
.feed-spin{height:100%;display:flex;align-items:center;justify-content:center;background:#0a0a0a}
.spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.08);
  border-top-color:var(--pink);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
/* 스켈레톤 카드 */
.skel-card{scroll-snap-align:start;flex-shrink:0;width:100%;height:100%;
  display:flex;flex-direction:column;background:#0f0f0f;}
.skel-video{width:100%;aspect-ratio:9/16;background:linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%);
  background-size:200% 100%;animation:skel-shine 1.2s infinite;}
.skel-bar{padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
.skel-line{border-radius:6px;background:linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%);
  background-size:200% 100%;animation:skel-shine 1.2s infinite;}
@keyframes skel-shine{to{background-position:-200% 0}}
.feed-empty{height:100%;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px;color:rgba(255,255,255,.25);
  scroll-snap-align:start;background:#0a0a0a}
.feed-empty i{font-size:48px}
.feed-empty p{font-size:14px;font-weight:600}

/* ── 지도 화면 ── */
#naverMap{position:absolute;top:0;left:0;right:0;bottom:0;}

/* 지도 위 카테고리 필터 (floating) */
.map-cat-bar{
  position:absolute;top:10px;left:0;right:0;z-index:100;
  display:flex;gap:6px;overflow-x:auto;
  padding:0 12px;scrollbar-width:none;pointer-events:auto}
.map-cat-bar::-webkit-scrollbar{display:none}
.mc{flex-shrink:0;border:none;border-radius:20px;
  padding:7px 14px;font-size:12px;font-weight:700;
  background:rgba(18,18,18,.88);backdrop-filter:blur(12px);
  color:rgba(255,255,255,.65);
  cursor:pointer;font-family:inherit;transition:all .2s;
  white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,.35)}
.mc.active{
  background:var(--pink);color:#fff;
  box-shadow:0 3px 14px rgba(255,77,125,.45)}

/* 내 주변 FAB */
.nearby-fab{
  position:absolute;top:56px;right:12px;z-index:100;
  background:rgba(18,18,18,.9);backdrop-filter:blur(10px);
  border:1.5px solid rgba(255,255,255,.15);border-radius:50px;
  padding:8px 13px;display:flex;align-items:center;gap:5px;
  font-size:11px;font-weight:700;color:#fff;cursor:pointer;
  box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:inherit;transition:all .2s}
.nearby-fab i{color:var(--pink);font-size:12px}
.nearby-fab.on{background:var(--pink);border-color:var(--pink)}
.nearby-fab.on i{color:#fff}

/* ── 지도 위 팝업 카드 (두바이쿠키맵 스타일) ── */
.map-popup{
  position:absolute;bottom:16px;left:12px;right:12px;
  z-index:200;
  background:#111;border-radius:20px;
  overflow:hidden;
  box-shadow:0 8px 32px rgba(0,0,0,.7);
  border:1px solid rgba(255,255,255,.1);
  transform:translateY(20px) scale(.96);
  opacity:0;pointer-events:none;
  transition:transform .32s cubic-bezier(.34,1.56,.64,1),opacity .25s}
.map-popup.show{
  transform:translateY(0) scale(1);
  opacity:1;pointer-events:auto}

/* 팝업 유튜브 영역 */
.mp-yt{
  position:relative;width:100%;padding-top:52%;
  background:#000;overflow:hidden}
.mp-yt iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
.mp-yt-thumb{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;cursor:pointer}
.mp-play-btn{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.3);cursor:pointer;transition:background .2s}
.mp-play-btn:hover{background:rgba(0,0,0,.15)}
.mp-play-icon{
  width:52px;height:52px;border-radius:50%;
  background:rgba(255,255,255,.92);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.4)}
.mp-play-icon i{color:#111;font-size:20px;margin-left:3px}

/* 팝업 정보 영역 */
.mp-info{padding:13px 14px 14px;display:flex;align-items:flex-start;gap:10px}
.mp-info-main{flex:1;min-width:0}
.mp-badge{
  display:inline-flex;align-items:center;gap:4px;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.2);
  padding:2px 8px;border-radius:6px;margin-bottom:5px}
.mp-name{
  font-size:17px;font-weight:800;line-height:1.2;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  margin-bottom:4px}
.mp-meta{
  font-size:11px;color:rgba(255,255,255,.4);
  display:flex;align-items:center;gap:6px;margin-bottom:5px}
.mp-meta i{font-size:10px}
.mp-desc{
  font-size:12px;color:rgba(255,255,255,.5);line-height:1.45;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mp-actions{display:flex;flex-direction:column;gap:6px;flex-shrink:0}
.mp-book{
  display:flex;align-items:center;justify-content:center;gap:5px;
  background:var(--green);color:#fff;border:none;border-radius:11px;
  padding:9px 12px;font-size:11px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  white-space:nowrap;box-shadow:0 3px 12px rgba(3,199,90,.4)}
.mp-book:active{background:var(--green2)}
.mp-close{
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);
  border-radius:11px;width:38px;height:38px;
  cursor:pointer;font-size:14px;color:rgba(255,255,255,.5)}
.mp-close:active{background:rgba(255,255,255,.15)}
.mp-tags{
  display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}
.mp-tag{
  font-size:10px;background:rgba(255,255,255,.07);
  color:rgba(255,255,255,.5);padding:3px 8px;border-radius:8px}

/* ── 하단 미니카드 패널 제거 ── */
:root{--panel-h:0px}

/* 네이버 지도 커스텀 마커 → 인라인 스타일로 처리, CSS 불필요 */

/* 피드용 바텀시트 */
.dim{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:400;
  pointer-events:none;transition:background .3s}
.dim.on{background:rgba(0,0,0,.6);pointer-events:auto}
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:401;
  background:#141414;border-radius:24px 24px 0 0;
  transform:translateY(100%);transition:transform .38s cubic-bezier(.32,1,.23,1);
  max-height:85vh;display:flex;flex-direction:column;
  padding-bottom:calc(20px + var(--safe));
  box-shadow:0 -4px 30px rgba(0,0,0,.5)}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:38px;height:4px;background:rgba(255,255,255,.1);
  border-radius:4px;margin:14px auto 0;flex-shrink:0}
.sheet-img{width:calc(100% - 28px);height:180px;object-fit:cover;
  border-radius:16px;margin:14px 14px 0;flex-shrink:0}
.sheet-body{padding:16px 18px 0;overflow-y:auto;flex:1}
.s-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 8px;border-radius:6px;margin-bottom:6px}
.s-name{font-size:22px;font-weight:800;margin-bottom:6px;line-height:1.2}
.s-addr{font-size:12px;color:rgba(255,255,255,.45);
  display:flex;align-items:center;gap:5px;margin-bottom:4px}
.s-phone{font-size:12px;color:rgba(255,255,255,.4);
  display:flex;align-items:center;gap:5px;margin-bottom:10px}
.s-desc{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:10px;line-height:1.5}
.s-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}
.s-tag{font-size:11px;background:rgba(255,255,255,.07);
  color:rgba(255,255,255,.6);padding:4px 10px;border-radius:9px;font-weight:500}
.s-price{font-size:13px;color:rgba(255,255,255,.6);margin-bottom:18px}
.s-price span{color:var(--pink2);font-size:18px;font-weight:800}
.s-actions{display:flex;gap:10px}
.s-book{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:15px;font-size:15px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  box-shadow:0 4px 16px rgba(3,199,90,.35)}
.s-book:active{background:var(--green2)}
.s-map-btn{flex-shrink:0;display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:15px 16px;cursor:pointer;
  font-size:18px;color:rgba(255,255,255,.6)}

/* ── 예약 모달 (iframe) ── */
.rsv-dim{
  position:fixed;inset:0;z-index:800;
  background:rgba(0,0,0,0);
  transition:background .3s;
  pointer-events:none;
}
.rsv-dim.show{
  background:rgba(0,0,0,.65);
  pointer-events:auto;
}
.rsv-modal{
  position:fixed;
  left:0;right:0;bottom:0;
  z-index:801;
  height:90vh;
  background:#fff;
  border-radius:20px 20px 0 0;
  display:flex;flex-direction:column;
  transform:translateY(100%);
  transition:transform .38s cubic-bezier(.32,1,.23,1);
  overflow:hidden;
  box-shadow:0 -6px 40px rgba(0,0,0,.5);
}
.rsv-modal.show{transform:translateY(0)}
.rsv-topbar{
  flex-shrink:0;height:50px;
  background:#fff;
  border-bottom:1px solid #eee;
  display:flex;align-items:center;
  padding:0 12px;gap:8px;
  position:relative;
}
.rsv-topbar-handle{
  position:absolute;top:7px;left:50%;transform:translateX(-50%);
  width:34px;height:4px;border-radius:4px;
  background:rgba(0,0,0,.1);
}
.rsv-topbar-title{
  flex:1;font-size:14px;font-weight:700;color:#111;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  padding-top:4px;
}
.rsv-topbar-close{
  flex-shrink:0;width:44px;height:44px;
  background:#fff0f4;border:none;border-radius:10px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation;
}
.rsv-topbar-close svg,.rsv-topbar-ext svg{
  pointer-events:none;  /* SVG가 클릭 이벤트 가로채지 않도록 */
  display:block;
}
.rsv-topbar-ext{
  flex-shrink:0;width:44px;height:44px;
  background:#f4f4f4;border:none;border-radius:10px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation;
}
.rsv-loading{
  flex-shrink:0;height:3px;background:#f0f0f0;overflow:hidden;
}
.rsv-loading-bar{
  height:100%;width:35%;
  background:#03C75A;
  animation:rsvLoad 1.1s ease-in-out infinite alternate;
}
@keyframes rsvLoad{from{transform:translateX(-100%)}to{transform:translateX(350%)}}
.rsv-loading.hide{display:none;}
.rsv-iframe{
  flex:1;border:none;width:100%;background:#fff;
}

/* 토스트 */
.toast{position:fixed;bottom:calc(var(--nav)+12px);left:50%;
  transform:translateX(-50%) translateY(8px);
  background:rgba(20,20,20,.97);color:#fff;border:1px solid rgba(255,255,255,.1);
  padding:10px 20px;border-radius:22px;font-size:13px;font-weight:600;
  z-index:600;opacity:0;transition:opacity .25s,transform .25s;
  pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* ── 프리미엄 피드 카드 ── */
.fi-premium{
  position:relative;
}
.fi-premium::before{
  content:'';
  position:absolute;inset:0;z-index:1;pointer-events:none;
  box-shadow:inset 0 0 0 2px rgba(255,200,50,.45);
  border-radius:0;
}
.feed-premium-badge{
  position:absolute;top:12px;left:12px;z-index:10;
  background:linear-gradient(90deg,#FFD700,#FFA500);
  color:#000;font-size:10px;font-weight:900;
  padding:4px 10px;border-radius:20px;
  letter-spacing:.5px;
  box-shadow:0 2px 12px rgba(255,200,0,.55);
  display:flex;align-items:center;gap:4px;
}
.feed-premium-badge span{font-size:9px}
.shop-bar-premium{
  background:linear-gradient(to bottom,transparent,rgba(10,8,0,.99));
}
.shop-bar-cat-premium{
  color:#FFD700!important;
  background:rgba(255,200,0,.15)!important;
  border-color:rgba(255,200,0,.35)!important;
}
.btn-book-premium{
  background:linear-gradient(135deg,#FFD700,#FF8C00)!important;
  box-shadow:0 4px 16px rgba(255,180,0,.5)!important;
  color:#000!important;
}
.btn-book-premium:active{
  background:linear-gradient(135deg,#FFC200,#FF7700)!important;
}

/* 프리미엄 마커 글로우 애니메이션 */
@keyframes premGlow{
  0%,100%{opacity:.6;transform:scale(1)}
  50%{opacity:1;transform:scale(1.06)}
}
</style>
</head>
<body class="shorts-mode">

<header class="hd">
  <div class="logo" id="logoBtn">
    <div class="logo-icon">💄</div>
    마이<em>뷰티</em>맵
  </div>
  <div class="hd-right">
    <span class="hd-badge">BETA</span>
    <button class="search-btn" id="searchToggleBtn" onclick="toggleSearch()" aria-label="검색">
      <i class="fas fa-search" id="searchBtnIcon"></i>
    </button>
  </div>
</header>

<!-- 검색바 -->
<div class="search-bar" id="searchBar">
  <div class="search-inner">
    <i class="fas fa-search"></i>
    <input class="search-input" id="searchInput" type="search"
      placeholder="샵 이름, 지역, 태그 검색..."
      oninput="onSearchInput(this.value)"
      onkeydown="if(event.key==='Enter'){this.blur();}"
    />
    <button class="search-clear" id="searchClear" onclick="clearSearch()"><i class="fas fa-times-circle"></i></button>
  </div>
  <div class="search-hint">예) 강남 마사지 &nbsp;·&nbsp; 눈썹문신 &nbsp;·&nbsp; 리프팅</div>
</div>

<!-- 카탈로그 탭바 (피드 전용) -->
<div class="cat-bar" id="catBar">
  <div class="cat-scroll">
    ${CATEGORIES.map((c, i) => `<button class="cp${i === 0 ? " active" : ""}" onclick="filterFeed(this,'${c === "전체" ? "all" : c}')">${CAT_EMOJI[c]} ${c}</button>${i === 0 ? REC_BTN : ""}`).join("")}
  </div>
</div>

<!-- 숏폼 전용 카탈로그 바 -->
<div id="shortsCatBar">
  <div class="cat-scroll">
    <button class="scp active" id="scat-all"    onclick="filterShorts(this,'all')">🏠 전체</button>
    <button class="scp"        id="scat-마사지"  onclick="filterShorts(this,'마사지')">💆 마사지</button>
    <button class="scp"        id="scat-헤드스파" onclick="filterShorts(this,'헤드스파')">🧖 헤드스파</button>
    <button class="scp"        id="scat-피부관리" onclick="filterShorts(this,'피부관리')">✨ 피부관리</button>
    <button class="scp"        id="scat-헤어"    onclick="filterShorts(this,'헤어')">💇 헤어</button>
    <button class="scp"        id="scat-메이크업" onclick="filterShorts(this,'메이크업')">💄 메이크업</button>
    <button class="scp"        id="scat-왁싱"    onclick="filterShorts(this,'왁싱')">🪒 왁싱</button>
    <button class="scp"        id="scat-반영구"  onclick="filterShorts(this,'반영구')">🖊️ 반영구</button>
    <button class="scp"        id="scat-병원"    onclick="filterShorts(this,'병원')">🏥 병원</button>
    <button class="scp"        id="scat-그외"    onclick="filterShorts(this,'그외')">🌸 그외</button>
  </div>
</div>

<!-- 피드 화면 -->
<main id="feedScreen">
  <div class="feed-spin"><div class="spinner"></div></div>
</main>

<!-- 지도 화면: iframe -->
<section id="mapScreen">
  <!-- 카테고리 필터 -->
  <div class="map-cat-bar" id="mapCatBar">
    ${CATEGORIES.map((c, i) => `<button class="mc${i === 0 ? " active" : ""}" onclick="filterMap(this,'${c === "전체" ? "all" : c}')">${CAT_EMOJI[c]} ${c}</button>`).join("")}
  </div>
  <!-- 지도 iframe -->
  <iframe id="mapFrame" src="/map" style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>

  <!-- ── 지도 위 팝업 카드 ── -->
  <div class="map-popup" id="mapPopup">
    <!-- 미디어 영역 -->
    <div id="mpYt"></div>
    <!-- 정보 영역 -->
    <div class="mp-info">
      <div class="mp-info-main">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;flex-wrap:wrap;">
          <div class="mp-badge" id="mpBadge"></div>
          <div id="mpPremiumBadge" style="display:none;align-items:center;gap:3px;
            font-size:10px;font-weight:900;padding:3px 8px;border-radius:20px;
            background:linear-gradient(90deg,#FFD700,#FFA500);color:#000;
            box-shadow:0 1px 8px rgba(255,180,0,.5);letter-spacing:.3px;">
            ✦ PREMIUM
          </div>
        </div>
        <div class="mp-name" id="mpName"></div>
        <div class="mp-meta" id="mpMeta"></div>
        <div class="mp-desc" id="mpDesc"></div>
        <div class="mp-tags" id="mpTags"></div>
      </div>
      <div class="mp-actions">
        <button class="mp-book" id="mpBook"
          onclick="if(curShop){trackMapSPWithSrc(curShop.id);curShop&&(()=>{const e=document.getElementById('rsvDim');const m=document.getElementById('rsvModal');const t=document.getElementById('rsvTitle');const f=document.getElementById('rsvFrame');const l=document.getElementById('rsvLoading');document.getElementById('rsvExtBtn').onclick=()=>window.open(curShop.smartPlaceUrl,'_blank','noopener');t.textContent=curShop.name+' 예약하기';f.src='';l.classList.remove('hide');e.classList.add('show');m.classList.add('show');fetch('/api/resolve-naver?url='+encodeURIComponent(curShop.smartPlaceUrl)).then(r=>r.json()).then(d=>{f.src=d.resolved;f.onload=()=>l.classList.add('hide');}).catch(()=>{f.src=curShop.smartPlaceUrl;f.onload=()=>l.classList.add('hide');});})()}">
          <i class="fas fa-calendar-check" style="font-size:12px"></i>
          네이버 예약
        </button>
        <button class="mp-close" onclick="closeMapPopup()">✕</button>
      </div>
    </div>
  </div>
</section>

<!-- 입점문의 화면 -->
<section id="inquiryScreen">
  <div class="iq-wrap">

    <!-- 히어로 -->
    <div class="iq-hero">
      <div class="iq-badge">✨ 파트너 모집 중</div>
      <div class="iq-title">마이뷰티맵에<br>내 샵을 등록하세요</div>
      <div class="iq-sub">유튜브 영상으로 홍보하고<br>더 많은 고객에게 닿을 수 있어요</div>
    </div>

    <!-- 혜택 카드 -->
    <div class="iq-benefits">
      <div class="iq-benefit">
        <div class="icon">▶️</div>
        <div class="bl">유튜브 영상 홍보</div>
        <div class="bs">업체 유튜브 영상을<br>피드에 자동 노출</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">🗺️</div>
        <div class="bl">지도 핀 등록</div>
        <div class="bs">네이버 지도 위에<br>업체 핀 표시</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">📅</div>
        <div class="bl">예약 연동</div>
        <div class="bs">스마트플레이스<br>바로 예약 연결</div>
      </div>

    </div>

    <!-- 요금 안내 -->
    <div class="iq-pricing">
      <div class="iq-plan free">
        <div class="plan-tag">추천</div>
        <div class="plan-icon">🎬</div>
        <div class="plan-price">6개월 무료</div>
        <div class="plan-name">촬영 플랜</div>
        <div class="plan-desc">
          촬영비 <b style="color:#03C75A">3만원</b> 내시면<br>
          <b style="color:#03C75A">6개월 무료</b> 게재<br>
          <span style="font-size:9px;opacity:.6">이후 월 10,000원</span>
        </div>
      </div>
      <div class="iq-plan paid">
        <div class="plan-tag">기본</div>
        <div class="plan-icon">📍</div>
        <div class="plan-price">월 1만원</div>
        <div class="plan-name">기본 플랜</div>
        <div class="plan-desc">영상 없이<br>맵 게재만<br><b style="color:var(--pink)">월 10,000원</b></div>
      </div>
    </div>

    <!-- 신청 폼 -->
    <div class="iq-form" id="iqForm">
      <h3>📝 입점 신청서</h3>
      <div class="iq-row2">
        <div class="iq-field">
          <label>대표님 성함 *</label>
          <input type="text" id="iq-owner" placeholder="홍길동">
        </div>
        <div class="iq-field">
          <label>연락처 *</label>
          <input type="tel" id="iq-phone" placeholder="010-0000-0000">
        </div>
      </div>
      <div class="iq-field">
        <label>샵 이름 *</label>
        <input type="text" id="iq-name" placeholder="예) 글로우 스킨 강남점">
      </div>
      <div class="iq-row2">
        <div class="iq-field">
          <label>업종 *</label>
          <select id="iq-cat">
            <option value="">선택</option>
            <option>마사지</option><option>헤드스파</option><option>피부관리</option>
            <option>헤어</option><option>메이크업</option><option>왁싱</option><option>반영구</option>
            <option>병원</option><option>그외</option>
          </select>
        </div>
        <div class="iq-field">
          <label>지역 *</label>
          <input type="text" id="iq-area" placeholder="예) 강남구">
        </div>
      </div>
      <div class="iq-field">
        <label>스마트플레이스 URL</label>
        <input type="url" id="iq-url" placeholder="https://naver.me/...">
      </div>
      <div class="iq-field">
        <label>문의사항</label>
        <textarea id="iq-msg" placeholder="궁금한 점이나 요청사항을 적어주세요"></textarea>
      </div>
    </div>

    <!-- 개인정보 수집·이용 동의 -->
    <div class="iq-agree">
      <div class="iq-agree-title">🔒 개인정보 수집·이용 동의</div>
      <div class="iq-agree-body">
        <b>수집 항목:</b> 성함, 연락처, 샵명, 업종, 지역, 스마트플레이스 URL, 문의사항<br>
        <b>수집 목적:</b> 입점 검토 및 상담 연락<br>
        <b>보유 기간:</b> 입점 검토 완료 후 1년 또는 동의 철회 시까지<br>
        <b>제3자 제공:</b> 없음 (내부 검토 목적으로만 사용)<br><br>
        귀하는 개인정보 수집·이용에 동의를 거부할 권리가 있으며, 동의 거부 시 입점 신청이 제한될 수 있습니다.
      </div>
      <label class="iq-agree-check">
        <input type="checkbox" id="iq-agree-chk">
        <span>위 개인정보 수집·이용에 <b>(필수)</b> 동의합니다</span>
      </label>
    </div>

    <button class="iq-submit" onclick="submitInquiry()">
      <i class="fas fa-paper-plane" style="margin-right:6px"></i>입점 신청하기
    </button>

    <!-- 완료 메시지 -->
    <div class="iq-done" id="iqDone">
      <div class="done-icon">🎉</div>
      <div class="done-title">신청이 접수됐어요!</div>
      <div class="done-sub">담당자가 확인 후<br>1~2일 내로 연락드릴게요.</div>
    </div>

    <div class="iq-notice">
      입력하신 정보는 입점 검토 목적으로만 사용되며<br>
      제3자에게 제공되지 않습니다. (개인정보보호법 준수)
    </div>
  </div>
</section>

<!-- 구글 애드센스 광고 배너 -->
<div id="coupang-ad">
  <ins class="adsbygoogle"
    style="display:inline-block;width:100%"
    data-ad-client="ca-pub-6943282483618134"
    data-ad-slot="5241168678"
    data-ad-format="fixed"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>
</div>

<!-- 음소거 버튼 (릴스 전용) -->
<button id="shorts-mute-btn" onclick="toggleShortsMute()">
  <i class="fas fa-volume-mute"></i>
</button>

<!-- 숏폼 스크린 -->
<section id="shortsScreen">
  <div id="shortsFeed" style="height:100%;display:flex;flex-direction:column"></div>
</section>

<!-- 하단 탭바: 릴스 → 영상 → 지도 → 입점 -->
<nav class="tabbar">
  <button class="tab" id="tab-shorts" onclick="switchTab('shorts')">
    <i class="fas fa-fire"></i>릴스
  </button>
  <button class="tab" id="tab-feed" onclick="switchTab('feed')">
    <i class="fas fa-play-circle"></i>영상
  </button>
  <button class="tab" id="tab-map" onclick="switchTab('map')">
    <i class="fas fa-map-marker-alt"></i>지도
  </button>
  <button class="tab" id="tab-inquiry" onclick="switchTab('inquiry')">
    <i class="fas fa-store"></i>입점문의
  </button>
</nav>

<!-- 피드 전용 딤 + 바텀시트 -->
<div class="dim" id="dim" onclick="closeFeedSheet()"></div>
<div class="sheet" id="sheet">
  <div class="sheet-handle"></div>
  <img class="sheet-img" id="sImg" src="" alt=""/>
  <div class="sheet-body">
    <div class="s-cat"  id="sCat"></div>
    <div class="s-name" id="sName"></div>
    <div class="s-addr"><i class="fas fa-map-pin" style="color:var(--green)"></i><span id="sAddr"></span></div>
    <div class="s-phone"><i class="fas fa-phone" style="color:rgba(255,255,255,.3)"></i><span id="sPhone"></span></div>
    <div class="s-desc" id="sDesc"></div>
    <div class="s-tags" id="sTags"></div>
    <div class="s-price">시술 <span id="sPrice"></span></div>
    <div class="s-actions">
      <button class="s-book" id="sBook" onclick="_sessionTrackFeedBook();_sessionEvent(&quot;feed_book&quot;,curShop);openInapp()">
        <i class="fas fa-calendar-check"></i> 네이버 예약하기
      </button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>

<!-- 예약 모달 (iframe) -->
<div class="rsv-dim" id="rsvDim" onclick="closeReserve()"></div>
<div class="rsv-modal" id="rsvModal">
  <div class="rsv-topbar">
    <div class="rsv-topbar-handle"></div>
    <span class="rsv-topbar-title" id="rsvTitle"></span>
    <button class="rsv-topbar-ext" id="rsvExtBtn" title="브라우저로 열기" type="button">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2" style="pointer-events:none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </button>
    <button class="rsv-topbar-close" onclick="closeReserve()" title="닫기" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF4D7D" stroke-width="2.5" style="pointer-events:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="rsv-loading" id="rsvLoading"><div class="rsv-loading-bar"></div></div>
  <iframe class="rsv-iframe" id="rsvFrame" src=""
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
    allowfullscreen></iframe>
</div>



<script>
// ── 전역 ──────────────────────────────────────────────────────────────────
let allShops   = [];
let mapCat     = 'all';
let nearbyOn   = false;
let userLat    = null;
let userLng    = null;
let curShop    = null;
let naverMap   = null;
let mapInited  = false;
let nvMarkers  = {};   // id -> {marker, overlay}
// ── 영상조회: 실제 클릭(재생)할 때만, 세션 내 업체당 1회만 카운팅 ──────────
// sessionStorage 사용 → 새로고침해도 탭 닫기 전까지 중복 방지
// source: 'feed' | 'catalog' | 'map'  (어디서 영상을 재생했는지)
function trackView(shopId, source) {
  if (!shopId) return;
  const id  = String(shopId);
  const src = source || 'feed';
  const key = 'viewed_' + id + '_' + src; // source별로 독립 카운팅
  if (sessionStorage.getItem(key)) return; // 이미 이 탭에서 카운팅됨
  sessionStorage.setItem(key, '1');
  lastViewSrc = src; // 예약클릭 전환율 분석용: 마지막 영상 출처 기억
  fetch('/api/track/view/'+id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: src }),
  }).catch(()=>{});
}
let userMarker = null;

const CAT_CLASS = {
  '마사지':'cat-massage', '헤드스파':'cat-headspa',
  '피부관리':'cat-skin', '헤어':'cat-hair', '메이크업':'cat-makeup',
  '왁싱':'cat-wax', '반영구':'cat-perm', '병원':'cat-hospital', '그외':'cat-etc',
};

// ── 탭 전환 ───────────────────────────────────────────────────────────────
function switchTab(tab) {
  _sessionTrackTab(tab); // 👁️ 세션 추적
  ['feed','map','inquiry','shorts'].forEach(t => {
    const tabEl = document.getElementById('tab-'+t);
    const scrEl = document.getElementById(t+'Screen');
    if(tabEl) tabEl.classList.toggle('active', t===tab);
    if(scrEl) scrEl.classList.toggle('active', t===tab);
  });
  document.getElementById('catBar').classList.toggle('show', tab==='feed');

  const pcWrapper = document.getElementById('feed-pc-wrapper');
  if (pcWrapper) pcWrapper.style.display = (tab === 'feed') ? '' : 'none';

  if (tab==='map') {
    closeMapPopup();
    initMap();
    setTimeout(() => {
      const frame = document.getElementById('mapFrame');
      if (frame) frame.contentWindow.postMessage({ type: 'fitBounds' }, '*');
    }, 300);
  }
  if (tab==='feed') closeMapPopup();

  // ── 숏폼 모드: body 클래스로 헤더·광고 통합 제어 ──────────────────────────
  document.body.classList.toggle('shorts-mode', tab === 'shorts');
  const sCatBar = document.getElementById('shortsCatBar');
  if (sCatBar) sCatBar.classList.toggle('show', tab === 'shorts');
  document.documentElement.style.setProperty('--scat', tab === 'shorts' ? '44px' : '0px');
  // ────────────────────────────────────────────────────────────────────────

  // 검색바 placeholder·힌트 탭에 따라 변경
  const si = document.getElementById('searchInput');
  const sh = document.querySelector('.search-hint');
  if (si && sh) {
    si.placeholder = '샵 이름, 지역, 태그 검색...';
    sh.textContent = '예) 강남 마사지  ·  눈썹문신  ·  리프팅';
  }

  if (tab==='shorts') {
    // 숏폼 탭 진입 → 영상탭 feed-iframe 정지
    if (_feedCurrentCard) {
      const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
      if (fi) { fi.dataset.paused = '1'; fi.src = 'about:blank'; }
    }
    closeFeedSheet && closeFeedSheet();
    // 숏폼 로드 & 재생
    if (_shortsLoaded && _shortsItems.length) {
      const sc = document.getElementById('shortsScreen');
      if (sc) {
        _shortsStopAll();
        sc.scrollTop = 0;
        // display:block 전환 후 레이아웃 확정까지 대기 (모바일 Safari 대응)
        setTimeout(() => { initShortsObserver(sc); }, 200);
      }
    } else {
      loadShorts(_shortsCat);
    }
  } else {
    // 릴스 탭 이탈 → 모든 영상 즉시 정지
    _shortsStopAll();
  }
  // 영상탭 이탈 시 feed 정지
  if (tab !== 'feed' && _feedCurrentCard) {
    const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
    if (fi) { fi.dataset.paused = '1'; fi.src = 'about:blank'; }
  }
  // 영상탭 진입/복귀 시 재생
  if (tab === 'feed') {
    const scr = document.getElementById('feedScreen');
    if (scr) {
      // 현재 카드 복귀 재생, 없으면 첫 카드 활성화
      if (_feedCurrentCard) {
        const fi = _feedCurrentCard.querySelector('iframe.feed-iframe');
        if (fi && fi.dataset.src) { delete fi.dataset.paused; fi.src = fi.dataset.src; }
      } else {
        const first = scr.querySelector('.yt-area[data-ytid]');
        if (first) feedActivateCard(first);
      }
    }
  }
}

// ── 로고 5번 탭 → 관리자 선택 팝업 ─────────────────────────────────────
let logoCnt=0, logoTmr;
document.getElementById('logoBtn').addEventListener('click', ()=>{
  logoCnt++;
  clearTimeout(logoTmr);
  logoTmr = setTimeout(()=>{logoCnt=0;}, 800);
  if (logoCnt >= 5) {
    logoCnt = 0;
    showAdminPicker();
  }
});

// ── ⚡ 숏폼 피드 ────────────────────────────────────────────────────────
let _shortsLoaded   = false;
let _shortsObserver = null;
let _shortsItems    = [];   // 전체 업체 캐시
let _shortsCat      = 'all'; // 현재 선택된 카테고리

// 앱 진입 시 릴스 탭으로 시작 (switchTab이 body.shorts-mode + catBar + 로드 모두 처리)
document.addEventListener('DOMContentLoaded', () => {
  switchTab('shorts');
  _sessionInit();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👁️ 방문자 세션 추적 엔진
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _sessId       = '';
let _sessStart    = Date.now();
let _sessTabs     = [];   // 방문한 탭 순서
let _sessTimer    = null;
// 숏폼
let _sessShorts   = 0;   // 숏폼 시청 수
let _sessShortsBook = 0; // 숏폼 예약클릭 수
// 피드
let _sessFeedCard = 0;   // 피드 업체카드 클릭
let _sessFeedBook = 0;   // 피드 예약클릭
// 지도
let _sessMapPin   = 0;   // 지도 마커 클릭
let _sessMapBook  = 0;   // 지도 예약클릭
// 기타
let _sessSearch   = 0;   // 검색 사용
let _sessInquiry  = 0;   // 문의 제출

function _sessionInit() {
  // 세션 ID: localStorage에 저장 (탭 닫기 전까지 유지)
  // 새로고침은 새 세션으로 처리
  _sessId = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  _sessStart = Date.now();
  _sessTabs       = [];
  _sessShorts     = 0;
  _sessShortsBook = 0;
  _sessFeedCard   = 0;
  _sessFeedBook   = 0;
  _sessMapPin     = 0;
  _sessMapBook    = 0;
  _sessSearch     = 0;
  _sessInquiry    = 0;

  const ua = navigator.userAgent || '';
  const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop';

  // 서버에 세션 시작 알림
  fetch('/api/track/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: _sessId, device }),
  }).catch(() => {});

  // 30초마다 heartbeat
  _sessTimer = setInterval(() => _sessionFlush(false), 30000);

  // 탭 닫기 / 페이지 이탈 시 최종 전송
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') _sessionFlush(true);
  });
  window.addEventListener('pagehide', () => _sessionFlush(true));
}

function _sessionFlush(exited) {
  if (!_sessId) return;
  const duration = Math.round((Date.now() - _sessStart) / 1000);
  const payload  = JSON.stringify({
    id:            _sessId,
    duration_sec:  duration,
    tabs_visited:  _sessTabs,
    shorts_count:  _sessShorts,
    shorts_book:   _sessShortsBook,
    feed_card_cnt: _sessFeedCard,
    feed_book_cnt: _sessFeedBook,
    map_pin_cnt:   _sessMapPin,
    map_book_cnt:  _sessMapBook,
    search_cnt:    _sessSearch,
    inquiry_cnt:   _sessInquiry,
    exited:        !!exited,
  });
  // sendBeacon: 페이지 닫혀도 전송 보장
  if (exited && navigator.sendBeacon) {
    navigator.sendBeacon('/api/track/session/update', new Blob([payload], { type: 'application/json' }));
  } else {
    fetch('/api/track/session/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    }).catch(() => {});
  }
}

// 탭 전환
function _sessionTrackTab(tab) {
  if (!_sessId) return;
  if (!_sessTabs.includes(tab)) _sessTabs.push(tab);
}
// 숏폼 시청
function _sessionTrackShorts() {
  if (!_sessId) return;
  _sessShorts++;
}
// 숏폼 예약클릭
function _sessionTrackShortsBook() {
  if (!_sessId) return;
  _sessShortsBook++;
  _sessionFlush(false); // 예약 즉시 flush — 이탈 전 누락 방지
}
// 피드 업체카드 클릭
function _sessionTrackFeedCard() {
  if (!_sessId) return;
  _sessFeedCard++;
}
// 피드 예약클릭
function _sessionTrackFeedBook() {
  if (!_sessId) return;
  _sessFeedBook++;
  _sessionFlush(false); // 예약 즉시 flush
}
// 지도 마커 클릭
function _sessionTrackMapPin() {
  if (!_sessId) return;
  _sessMapPin++;
}
// 지도 예약클릭
function _sessionTrackMapBook() {
  if (!_sessId) return;
  _sessMapBook++;
  _sessionFlush(false); // 예약 즉시 flush
}
// 검색 사용
function _sessionTrackSearch() {
  if (!_sessId) return;
  _sessSearch++;
}
// 문의 제출
function _sessionTrackInquiry() {
  if (!_sessId) return;
  _sessInquiry++;
}

// ── 업체별 이벤트 로그 (서버로 즉시 전송) ────────────────────────────────
// event_type: shorts_view|shorts_book|feed_card|feed_book|map_pin|map_book
function _sessionEvent(event_type, shop, viewed_sec) {
  if (!_sessId || !shop) return;
  fetch('/api/track/session/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: _sessId,
      event_type,
      shop_id:    shop.id   || shop.shop_id  || null,
      shop_name:  shop.name || shop.shop_name || null,
      shop_cat:   shop.category || shop.cat  || null,
      viewed_sec: viewed_sec || 0,
    }),
  }).catch(() => {});
}

function filterShorts(btn, cat) {
  // 버튼 active 토글
  document.querySelectorAll('#shortsCatBar .scp').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 캐시 유지하면서 필터만 변경 (재fetch 없음)
  loadShorts(cat);
}

// 불러오기 실패 시 재시도
function retryLoadShorts() {
  _shortsLoaded = false;
  _shortsItems  = [];
  loadShorts(_shortsCat);
}

async function loadShorts(cat) {
  cat = cat || 'all';
  _shortsCat = cat;
  const screen = document.getElementById('shortsScreen');
  const el     = document.getElementById('shortsFeed');
  if (!el) return;

  if (!_shortsLoaded) {
    _shortsLoaded = true;
    el.innerHTML = '<div class="shorts-empty">불러오는 중...</div>';
    try {
      const res = await fetch('/api/shorts');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      _shortsItems = Array.isArray(data) ? data : [];
    } catch(e) {
      console.error('[loadShorts] fetch error:', e);
      _shortsLoaded = false;
      el.innerHTML = '<div class="shorts-empty">'
        + '<div style="font-size:32px;margin-bottom:12px">😥</div>'
        + '<div style="margin-bottom:16px">영상을 불러오지 못했어요</div>'
        + '<button onclick="retryLoadShorts()" style="'
          + 'background:var(--pink);color:#fff;border:none;border-radius:20px;'
          + 'padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">'
          + '🔄 다시 시도</button>'
        + '</div>';
      return;
    }
  }

  // 랜덤 셔플 (Fisher-Yates)
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const items = shuffle(
    (cat === 'all') ? _shortsItems : _shortsItems.filter(s => s.category === cat)
  );

  if (!items.length) {
    el.innerHTML = '<div class="shorts-empty">🎬 숏폼 영상을 준비 중입니다!</div>';
    if (_shortsObserver) _shortsObserver.disconnect();
    return;
  }

  // 기존 YT 플레이어 전부 destroy 후 innerHTML 교체 (메모리 누수 방지)
  _shortsDestroyAll();
  el.style.cssText = 'height:100%;display:flex;flex-direction:column;';
  el.innerHTML = items.map((shop, i) => shortsSlide(shop, i)).join('');
  _shortsTotal = items.length;
  _shortsActiveIdx = -1;
  screen.scrollTop = 0;
  // PC(768px+): wheel로 슬라이드 넘기기 등록 (CSS !important로 레이아웃 처리)
  if (window.innerWidth >= 768) {
    _initPcShortsWheel(screen);
  }
  // 레이아웃 그려진 후 Observer 등록 → 첫 슬라이드 자동 감지·재생
  // 모바일 Safari: display:block 전환 후 layout 확정까지 200ms 대기
  setTimeout(() => { initShortsObserver(screen); }, 200);
}

// 전체 음소거 상태 (기본: 음소거)
let _shortsMuted = true;

function shortsSlide(shop, idx) {
  const clId = shop.cloudinary_public_id || '';
  const ytId = shop.youtube_id || '';
  const cat  = shop.category || '';
  const name = shop.name || '';
  const addr = shop.address || '';
  // Cloudinary 영상 URL 생성 (원본 9:16 세로 그대로 사용)
  const clUrl = clId
    ? 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + clId + '.mp4'
    : '';
  // Cloudinary 썸네일 URL (poster) - 0초 프레임
  const clPoster = clId
    ? 'https://res.cloudinary.com/dc0ouozcd/video/upload/so_0/' + clId + '.jpg'
    : '';
  const hasVideo = clUrl || ytId;
  return (
    '<div class="shorts-slide" data-shop-id="' + shop.id + '" data-clid="' + clId + '" data-ytid="' + ytId + '" data-idx="' + idx + '"' +
    ' onclick="shortsSlideClick(event,this)">' +
    (clUrl
      ? '<div class="shorts-iframe-wrap">' +
          '<video class="shorts-cl-video" id="cl-vid-' + idx + '" src="' + clUrl + '"' +
          ' poster="' + clPoster + '"' +
          ' playsinline loop muted preload="metadata"' +
          ' style="">'  +
          '</video>' +
        '</div>'
      : (ytId
          ? '<div class="shorts-iframe-wrap"><div class="shorts-yt-placeholder" id="yt-ph-' + idx + '"></div></div>'
          : '<div class="shorts-no-video"></div>')) +
    '<div class="shorts-overlay">' +
      // 모바일: 기존 하단 오버레이
      '<div class="shorts-info-row">' +
        '<div class="shorts-info-body">' +
          (cat ? '<span class="shorts-cat">' + cat + '</span>' : '') +
          '<div class="shorts-name">' + name + '</div>' +
          (addr ? '<div class="shorts-addr"><i class="fas fa-map-pin"></i>' + addr + '</div>' : '') +
        '</div>' +
        '<button class="shorts-book-btn" onclick="event.stopPropagation();shortsOpenBook(' + JSON.stringify(shop).replace(/"/g,'&quot;') + ')">' +
          '<i class="fas fa-calendar-check"></i>' +
          '<span>예약하기</span>' +
        '</button>' +
      '</div>' +
      // PC 전용: 세련된 정보 패널
      '<div class="shorts-panel-pc">' +
        // 카테고리 뱃지
        (cat ? '<span class="shorts-cat"><i class="fas fa-tag" style="font-size:9px;opacity:.7"></i>' + cat + '</span>' : '') +
        // 업체명
        '<div class="shorts-name shorts-panel-name">' + name + '</div>' +
        // 주소
        (addr ? '<div class="shorts-addr shorts-panel-addr"><i class="fas fa-location-dot" style="color:var(--pink);font-size:11px"></i><span>' + addr + '</span></div>' : '') +
        // 구분선
        '<div class="shorts-panel-divider"></div>' +
        // 예약 버튼
        (shop.smart_place_url
          ? '<button class="shorts-book-btn shorts-panel-btn" onclick="event.stopPropagation();shortsOpenBook(' + JSON.stringify(shop).replace(/"/g,'&quot;') + ')">' +
              '<i class="fas fa-calendar-check"></i>' +
              '<span>네이버 예약하기</span>' +
            '</button>'
          : '<button class="shorts-panel-btn" style="width:100%;padding:15px;font-size:14px;font-weight:800;border-radius:16px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.35);border:1.5px solid rgba(255,255,255,.08);cursor:default;display:flex;align-items:center;justify-content:center;gap:8px" disabled>' +
              '<i class="fas fa-calendar-xmark"></i>' +
              '<span>예약 정보 없음</span>' +
            '</button>'
        ) +
        // 하단 힌트
        '<div class="shorts-panel-hint">' +
          '<i class="fas fa-computer-mouse" style="opacity:.4;font-size:13px"></i>' +
          '<span>스크롤로 다음 영상</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>'
  );
}

// ── 릴스 슬라이드 탭: 재생/정지 토글 ──────────────────────────────────────
function shortsSlideClick(e, slide) {
  if (!slide) return;
  if (e.target.closest('.shorts-overlay')) return;
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';

  // Cloudinary 영상인 경우
  if (clId) {
    const vid = document.getElementById('cl-vid-' + idx);
    if (!vid) return;
    if (!_shortsUserGestured) {
      _shortsUserGestured = true;
      vid.play().catch(() => {});
      _shortsShowIcon(slide, 'play');
      return;
    }
    if (vid.paused) {
      vid.play().catch(() => {});
      _shortsShowIcon(slide, 'play');
    } else {
      vid.pause();
      _shortsShowIcon(slide, 'pause');
    }
    return;
  }

  // YouTube fallback
  const player = _ytPlayers[idx];
  if (!player) return;
  if (!_shortsUserGestured) {
    _shortsUserGestured = true;
    try { player.playVideo(); } catch(e2) {}
    _shortsShowIcon(slide, 'play');
    return;
  }
  const state = player.getPlayerState ? player.getPlayerState() : -1;
  if (state === 1) {
    player.pauseVideo();
    _shortsShowIcon(slide, 'pause');
  } else {
    player.playVideo();
    _shortsShowIcon(slide, 'play');
  }
}

// ── 재생/정지 아이콘 팝인 ─────────────────────────────────────────────────
function _shortsShowIcon(slide, type) {
  let icon = slide.querySelector('.shorts-pi');
  if (!icon) {
    icon = document.createElement('div');
    icon.className = 'shorts-pi';
    icon.innerHTML = '<i></i>';
    icon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);' +
      'width:72px;height:72px;background:rgba(0,0,0,.55);border-radius:50%;' +
      'display:flex;align-items:center;justify-content:center;' +
      'pointer-events:none;z-index:15;transition:transform .15s,opacity .15s;opacity:0;';
    icon.querySelector('i').style.cssText = 'font-size:28px;color:#fff;pointer-events:none';
    slide.appendChild(icon);
  }
  const i = icon.querySelector('i');
  if (i) i.className = type === 'pause' ? 'fas fa-pause' : 'fas fa-play';
  icon.style.transform = 'translate(-50%,-50%) scale(0)'; icon.style.opacity = '0';
  requestAnimationFrame(() => {
    icon.style.transform = 'translate(-50%,-50%) scale(1)'; icon.style.opacity = '1';
  });
  clearTimeout(icon._t);
  if (type === 'play') {
    icon._t = setTimeout(() => {
      icon.style.transform = 'translate(-50%,-50%) scale(0.7)'; icon.style.opacity = '0';
    }, 700);
  }
}

// ── 음소거 토글 ───────────────────────────────────────────────────────────
function toggleShortsMute() {
  _shortsMuted = !_shortsMuted;
  // Cloudinary <video> 음소거
  document.querySelectorAll('.shorts-cl-video').forEach(v => {
    v.muted = _shortsMuted;
  });
  // YouTube fallback 음소거
  Object.values(_ytPlayers).forEach(p => {
    try { _shortsMuted ? p.mute() : p.unMute(); } catch(e) {}
  });
  const btn = document.getElementById('shorts-mute-btn');
  if (btn) btn.innerHTML = _shortsMuted
    ? '<i class="fas fa-volume-mute"></i>'
    : '<i class="fas fa-volume-up"></i>';
}

function shortsOpenBook(shop) {
  if (!shop.smart_place_url) { showToast('예약 링크가 없어요'); return; }
  fetch('/api/track/shorts/sp/' + shop.id, { method: 'POST' }).catch(() => {});
  _sessionTrackShortsBook(); // 👁️ 세션 추적 - 숏폼 예약클릭
  _sessionEvent('shorts_book', shop);  // 👁️ 업체 이벤트
  curShop = { name: shop.name || '', smartPlaceUrl: shop.smart_place_url || '' };
  openInapp();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 숏폼 플레이어 엔진 (Cloudinary <video> + YouTube IFrame fallback)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _ytPlayers        = {};   // { idx: YT.Player } — YouTube fallback용
let _ytApiReady       = false;
let _ytApiLoading     = false;
let _ytPendingInits   = [];
let _shortsActiveIdx  = -1;
let _shortsTotal      = 0;
let _shortsUserGestured = false;
let _shortsViewStart  = 0;
let _shortsViewShopId = null;

// ── Cloudinary <video> 헬퍼 ───────────────────────────────────────────
function _clGetVideo(idx) {
  return document.getElementById('cl-vid-' + idx);
}

function _clPlayVideo(idx) {
  const v = _clGetVideo(idx);
  if (!v) return;
  v.muted = _shortsMuted;
  v.play().catch(() => {});
}

function _clPauseVideo(idx) {
  const v = _clGetVideo(idx);
  if (v) v.pause();
}

// ── YouTube IFrame fallback (youtube_id만 있는 구 데이터용) ──────────
function _ytLoadApi() {
  if (_ytApiReady || _ytApiLoading) return;
  _ytApiLoading = true;
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function() {
  _ytApiReady = true;
  _ytPendingInits.forEach(fn => fn());
  _ytPendingInits = [];
};

function _ytCreatePlayer(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const ytId = slide.dataset.ytid || '';
  if (!ytId || _ytPlayers[idx]) return;
  const ph = slide.querySelector('.shorts-yt-placeholder');
  if (!ph) return;
  const create = () => {
    const player = new window.YT.Player(ph, {
      videoId: ytId,
      playerVars: {
        autoplay: 1, mute: 1, loop: 1, playlist: ytId,
        controls: 0, playsinline: 1, rel: 0, modestbranding: 1, enablejsapi: 1,
      },
      events: {
        onReady: (e) => {
          _shortsMuted ? e.target.mute() : e.target.unMute();
          if (_shortsActiveIdx === idx) { try { e.target.playVideo(); } catch(err) {} }
        },
        onStateChange: (e) => {
          if (e.data === 0) { try { e.target.seekTo(0); e.target.playVideo(); } catch(err) {} }
        },
      }
    });
    _ytPlayers[idx] = player;
    const applyStyle = () => {
      const iframe = slide.querySelector('.shorts-iframe-wrap iframe');
      if (iframe) iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none;';
      else setTimeout(applyStyle, 100);
    };
    applyStyle();
  };
  if (_ytApiReady) create();
  else { _ytPendingInits.push(create); _ytLoadApi(); }
}

// 슬라이드 활성화: Cloudinary <video> 재생 or YouTube 플레이어 생성
function _shortsActivateSlide(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';
  const ytId = slide.dataset.ytid || '';
  if (!clId && !ytId) return;
  if (_shortsActiveIdx === idx) return;

  // ── 이전 슬라이드 시청 시간 마무리 ──────────────────────
  if (_shortsViewStart > 0 && _shortsViewShopId) {
    const prevSec = Math.round((Date.now() - _shortsViewStart) / 1000);
    const prevShop = _shortsItems.find(s => String(s.id) === String(_shortsViewShopId));
    if (prevShop && prevSec > 0) _sessionEvent('shorts_view_end', prevShop, prevSec);
  }

  _shortsActiveIdx = idx;
  _sessionTrackShorts();

  // 아이콘 초기화
  const icon = slide.querySelector('.shorts-pi');
  if (icon) { icon.style.opacity='0'; icon.style.transform='translate(-50%,-50%) scale(0)'; }

  // Cloudinary 영상 재생
  if (clId) {
    _clPlayVideo(idx);
  } else {
    // YouTube fallback
    if (!_ytPlayers[idx]) _ytCreatePlayer(slide);
    else {
      try { _ytPlayers[idx].playVideo(); } catch(e) {}
      if (!_shortsMuted) { try { _ytPlayers[idx].unMute(); } catch(e) {} }
    }
  }

  // 조회수 트래킹
  const sid = slide.dataset.shopId;
  _shortsViewStart  = Date.now();
  _shortsViewShopId = sid || null;
  if (sid && !slide.dataset.viewed) {
    slide.dataset.viewed = '1';
    fetch('/api/track/shorts/view/' + sid, { method: 'POST' }).catch(() => {});
    const shopInfo = _shortsItems.find(s => String(s.id) === String(sid));
    _sessionEvent('shorts_view', shopInfo || { id: sid, name: '' });
  }
}

// 슬라이드 비활성화: 정지
function _shortsDeactivateSlide(slide) {
  const idx  = parseInt(slide.dataset.idx || '0', 10);
  const clId = slide.dataset.clid || '';
  if (clId) {
    _clPauseVideo(idx);
  } else if (_ytPlayers[idx]) {
    try { _ytPlayers[idx].pauseVideo(); } catch(e) {}
  }
}

function _shortsStopAll() {
  if (_shortsViewStart > 0 && _shortsViewShopId) {
    const sec = Math.round((Date.now() - _shortsViewStart) / 1000);
    const shop = _shortsItems.find(s => String(s.id) === String(_shortsViewShopId));
    if (shop && sec > 0) _sessionEvent('shorts_view_end', shop, sec);
    _shortsViewStart = 0; _shortsViewShopId = null;
  }
  // Cloudinary 영상 전부 정지
  document.querySelectorAll('.shorts-cl-video').forEach(v => { try { v.pause(); } catch(e) {} });
  // YouTube fallback 전부 정지
  Object.values(_ytPlayers).forEach(p => { try { p.pauseVideo(); } catch(e) {} });
  _shortsActiveIdx = -1;
  const sc = document.getElementById('shortsScreen');
  if (sc && sc._shortsScrollTimer) { clearTimeout(sc._shortsScrollTimer); sc._shortsScrollTimer = null; }
}

function _shortsDestroyAll() {
  // Cloudinary 영상 초기화
  document.querySelectorAll('.shorts-cl-video').forEach(v => {
    try { v.pause(); v.currentTime = 0; } catch(e) {}
  });
  // YouTube fallback 제거
  Object.values(_ytPlayers).forEach(p => { try { p.destroy(); } catch(e) {} });
  _ytPlayers = {};
  _shortsActiveIdx = -1;
  // _shortsUserGestured는 리셋하지 않음
}

function initShortsObserver(screen) {
  if (_shortsObserver) { _shortsObserver.disconnect(); _shortsObserver = null; }
  if (screen._shortsScrollHandler) {
    screen.removeEventListener('scroll', screen._shortsScrollHandler);
    screen._shortsScrollHandler = null;
  }

  // IntersectionObserver: 50% 이상 보이면 활성화, 20% 미만이면 비활성화
  _shortsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const slide = entry.target;
      if (entry.intersectionRatio >= 0.5) {
        _shortsActivateSlide(slide);
      } else if (entry.intersectionRatio < 0.2) {
        _shortsDeactivateSlide(slide);
      }
    });
  }, { root: screen, threshold: [0.2, 0.5] });

  document.querySelectorAll('.shorts-slide').forEach(s => _shortsObserver.observe(s));

  // scroll fallback: snap 후 Observer 미동작 시 보정
  screen._shortsScrollHandler = function() {
    clearTimeout(screen._shortsScrollTimer);
    screen._shortsScrollTimer = setTimeout(() => {
      const slides  = document.querySelectorAll('.shorts-slide');
      const scrTop  = screen.scrollTop;
      const scrH    = screen.clientHeight;
      let best = null, bestR = 0;
      slides.forEach(s => {
        const oh = Math.max(0, Math.min(s.offsetTop + s.offsetHeight, scrTop + scrH) - Math.max(s.offsetTop, scrTop));
        const r  = s.offsetHeight > 0 ? oh / s.offsetHeight : 0;
        if (r > bestR) { bestR = r; best = s; }
      });
      if (best && bestR >= 0.5) {
        _shortsActivateSlide(best);
        slides.forEach(s => {
          if (s === best) return;
          const oh = Math.max(0, Math.min(s.offsetTop + s.offsetHeight, scrTop + scrH) - Math.max(s.offsetTop, scrTop));
          const r  = s.offsetHeight > 0 ? oh / s.offsetHeight : 0;
          if (r < 0.2) _shortsDeactivateSlide(s);
        });
      }
    }, 200);
  };
  screen.addEventListener('scroll', screen._shortsScrollHandler, { passive: true });

  // iOS Safari rAF 트릭: Observer 첫 감지 강제
  requestAnimationFrame(() => {
    const cur = screen.scrollTop;
    screen.scrollTop = cur + 1;
    requestAnimationFrame(() => { screen.scrollTop = cur; });
  });
}

// PC wheel → 슬라이드 프로그래매틱 스크롤
function _initPcShortsWheel(screen) {
  // 기존 핸들러 제거
  if (screen._pcWheelHandler) {
    screen.removeEventListener('wheel', screen._pcWheelHandler);
    screen._pcWheelHandler = null;
  }
  let _wheelLock = false;
  screen._pcWheelHandler = function(e) {
    e.preventDefault();
    if (_wheelLock) return;
    _wheelLock = true;
    const slides = Array.from(screen.querySelectorAll('.shorts-slide'));
    if (!slides.length) { _wheelLock = false; return; }
    const slideH = screen.clientHeight;
    const cur = Math.round(screen.scrollTop / slideH);
    const next = e.deltaY > 0
      ? Math.min(cur + 1, slides.length - 1)
      : Math.max(cur - 1, 0);
    screen.scrollTo({ top: next * slideH, behavior: 'smooth' });
    setTimeout(() => { _wheelLock = false; }, 600);
  };
  screen.addEventListener('wheel', screen._pcWheelHandler, { passive: false });
}

function showAdminPicker() {
  const pw = prompt('관리자 비밀번호');
  if (pw === null) return;
  if (pw !== '0907') { showToast('❌ 비밀번호가 틀렸어요'); return; }
  location.href = '/admin';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 피드
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let feedCat = 'all';
let searchQ = '';
let searchTimer = null;

// ─────────────────────────────────────────────
// 피드: CSS scroll-snap 방식 (JS 높이계산 없음)
// ─────────────────────────────────────────────

// 유튜브 썸네일 폴백: maxresdefault → hqdefault → 업체 썸네일 → 그라데이션
function feedThumbFallback(img, shopThumb) {
  const src = img.src || '';
  if (src.includes('maxresdefault')) {
    // 1단계: hqdefault 시도
    img.src = src.replace('maxresdefault', 'hqdefault');
  } else if (src.includes('hqdefault')) {
    // 2단계: 업체 등록 썸네일 시도
    if (shopThumb) {
      img.src = shopThumb;
    } else {
      // 3단계: 그라데이션 placeholder (img 숨기고 부모 배경 적용)
      img.style.display = 'none';
      img.parentElement.style.background = 'linear-gradient(135deg,#1a1a1a 0%,#2a1a2a 50%,#1a1a2a 100%)';
    }
  } else {
    // 업체 썸네일도 실패 → 그라데이션
    img.style.display = 'none';
    img.parentElement.style.background = 'linear-gradient(135deg,#1a1a1a 0%,#2a1a2a 50%,#1a1a2a 100%)';
  }
}

function feedCardHTML(s) {
  // iframe을 처음부터 삽입 (autoplay=1, mute=1)
  // 브라우저 autoplay 정책: mute=1 필수 (음소거 상태로 자동재생)
  // 화면에 들어오면 자동재생, 이탈하면 src 비워서 정지
  const ytArea = s.youtubeId
    ? '<div class="yt-area"'
        + ' data-shopid="' + s.id + '" data-ytid="' + s.youtubeId + '">'
        + '<iframe class="feed-iframe"'
        + ' src=""'
        + ' data-src="https://www.youtube.com/embed/' + s.youtubeId
        + '?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&controls=1"'
        + ' allow="autoplay;encrypted-media;picture-in-picture;fullscreen"'
        + ' allowfullscreen></iframe>'
      + '</div>'
    : '<div class="yt-area" style="background:linear-gradient(135deg,#1a1a1a,#111)"></div>';
  // data-shop JSON 이스케이프 버그 → data-id/url/name 개별 속성으로 분리
  const safeUrl  = (s.smartPlaceUrl||'').replace(/"/g,'&quot;');
  const safeName = (s.name||'').replace(/"/g,'&quot;');
  const bookBtn = s.smartPlaceUrl
    ? '<button class="btn-book' + (s.isPremium ? ' btn-book-premium' : '') + '"'
        + ' data-id="' + s.id + '"'
        + ' data-url="' + safeUrl + '"'
        + ' data-name="' + safeName + '"'
        + ' onclick="'
            + 'curShop={id:+this.dataset.id,name:this.dataset.name,smartPlaceUrl:this.dataset.url};'
            + '_sessionTrackFeedBook();_sessionEvent(&quot;feed_book&quot;,curShop);openInapp()">'  
        + '<i class="fas fa-calendar-check"></i><span>예약하기</span></button>'
    : '';
  // 프리미엄 뱃지
  const premiumBadge = s.isPremium
    ? '<div class="feed-premium-badge"><span>✦</span> PREMIUM</div>'
    : '';
  // 프리미엄 테두리 글로우
  const premiumClass = s.isPremium ? ' fi-premium' : '';
  return '<div class="fi' + premiumClass + '" data-id="' + s.id + '">'
    + ytArea
    + premiumBadge
    + '<div class="shop-bar' + (s.isPremium ? ' shop-bar-premium' : '') + '">'
      + '<div class="shop-bar-info">'
        + '<div class="shop-bar-cat' + (s.isPremium ? ' shop-bar-cat-premium' : '') + '">'
          + (s.isPremium ? '✦ ' : '') + (s.category||'') + '</div>'
        + '<div class="shop-bar-name">' + (s.name||'') + '</div>'
        + '<div class="shop-bar-loc"><i class="fas fa-map-marker-alt"></i><span>'
          + (s.address || s.district || '') + (s.price ? ' · ' + s.price : '') + '</span></div>'
        + (s.desc ? '<div class="shop-bar-desc">' + s.desc + '</div>' : '')
      + '</div>'
      + bookBtn
    + '</div>'
  + '</div>';
}

async function loadFeed(cat='all', q='') {
  feedCat = cat;
  const scr = document.getElementById('feedScreen');

  // 스켈레톤 카드 3장
  const sc = 'skel-card', sv = 'skel-video', sb = 'skel-bar', sl = 'skel-line';
  const skelCard = '<div class="'+sc+'"><div class="'+sv+'"></div><div class="'+sb+'">'
    +'<div class="'+sl+'" style="height:18px;width:55%"></div>'
    +'<div class="'+sl+'" style="height:13px;width:75%"></div>'
    +'<div class="'+sl+'" style="height:13px;width:40%"></div>'
    +'</div></div>';
  scr.innerHTML = skelCard + skelCard + skelCard;

  let url = '/api/shops?category=' + encodeURIComponent(cat==='all'||cat==='recommended'?'':cat) + '&shuffle=1';
  if (cat === 'recommended') url = '/api/shops?category=recommended';
  if (q) url += '&q=' + encodeURIComponent(q);
  const shops = await fetch(url).then(r=>r.json());

  if (!shops.length) {
    scr.innerHTML = '<div class="feed-empty"><i class="fas fa-search"></i><p>'
      + (cat==='recommended' ? '추천 업체가 없어요' : q ? '"'+q+'" 검색 결과가 없어요' : '등록된 샵이 없어요') + '</p></div>';
    return;
  }

  // ── 프리미엄 업체 5장마다 재삽입 ──
  const premiums = shops.filter(s => s.isPremium);
  const normals  = shops.filter(s => !s.isPremium);
  const INTERVAL = 5;
  const merged = [];
  let pi = 0;
  premiums.forEach(s => merged.push(s));
  if (premiums.length > 0) {
    normals.forEach((s, i) => {
      merged.push(s);
      if ((i + 1) % INTERVAL === 0) {
        merged.push(premiums[pi % premiums.length]);
        pi++;
      }
    });
  } else {
    normals.forEach(s => merged.push(s));
  }

  // 카드 렌더
  scr.innerHTML = merged.map(feedCardHTML).join('');
  scr.scrollTop = 0;

  // 카드 스크롤 정지 감지 Observer 연결
  initFeedStopObserver();
}

// ── 스크롤 기반으로 현재 카드 감지 → 재생/정지 ──
let _feedCurrentCard = null;
let _feedScrollTimer = null;

function feedActivateCard(ytDiv) {
  if (_feedCurrentCard === ytDiv) return;
  // 이전 카드 정지: src를 about:blank로
  if (_feedCurrentCard) {
    const prev = _feedCurrentCard.querySelector('iframe.feed-iframe');
    if (prev && !prev.dataset.paused) {
      prev.dataset.paused = '1';
      prev.src = 'about:blank';
    }
  }
  _feedCurrentCard = ytDiv;
  // 피드 탭이 아니면 재생하지 않음 (릴스 등 다른 탭에서 호출 방지)
  if (!document.getElementById('feedScreen').classList.contains('active')) return;
  // 현재 카드 재생
  const iframe = ytDiv.querySelector('iframe.feed-iframe');
  if (iframe && iframe.dataset.src) {
    delete iframe.dataset.paused;
    iframe.src = iframe.dataset.src;
    const shopId = ytDiv.dataset.shopid;
    const source = feedCat === 'recommended' ? 'catalog' : 'feed';
    if (feedCat === 'recommended') fetch('/api/track/rec/'+shopId,{method:'POST'}).catch(()=>{});
    trackView(shopId, source);
  }
}

function feedFindCurrentCard(scr) {
  // 화면 중앙에 가장 많이 격치는 .yt-area 찾기
  const cards = scr.querySelectorAll('.yt-area[data-ytid]');
  const scrMid = scr.scrollTop + scr.clientHeight / 2;
  let best = null, bestDist = Infinity;
  cards.forEach(card => {
    const mid = card.offsetTop + card.offsetHeight / 2;
    const dist = Math.abs(mid - scrMid);
    if (dist < bestDist) { bestDist = dist; best = card; }
  });
  return best;
}

function initFeedStopObserver() {
  _feedCurrentCard = null;
  const scr = document.getElementById('feedScreen');

  // 스크롤 리스너 중복 방지
  if (scr._feedScrollHandler) scr.removeEventListener('scroll', scr._feedScrollHandler);
  scr._feedScrollHandler = () => {
    clearTimeout(_feedScrollTimer);
    _feedScrollTimer = setTimeout(() => {
      const cur = feedFindCurrentCard(scr);
      if (cur) feedActivateCard(cur);
    }, 150);
  };
  scr.addEventListener('scroll', scr._feedScrollHandler, { passive: true });

  // 첫 번째 카드는 피드 탭 활성 시에만 재생 (switchTab('feed') 에서 처리)
}

function filterFeed(btn, cat) {
  document.querySelectorAll('.cp').forEach((b)=>b.classList.remove('active'));
  btn.classList.add('active');
  loadFeed(cat, searchQ);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 검색
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let searchOpen = false;

function toggleSearch() {
  searchOpen = !searchOpen;
  if (searchOpen) _sessionTrackSearch(); // 👁️ 세션 추적 - 검색 열기
  const bar  = document.getElementById('searchBar');
  const icon = document.getElementById('searchBtnIcon');
  const catBar = document.getElementById('catBar');
  const sCatBar = document.getElementById('shortsCatBar');
  bar.classList.toggle('open', searchOpen);
  icon.className = searchOpen ? 'fas fa-times' : 'fas fa-search';
  // 검색바 높이(62px)만큼 catBar 아래로
  document.documentElement.style.setProperty('--sb', searchOpen ? '62px' : '0px');
  // 릴스 탭 카탈로그바: 검색 열릴 때 숨기고, 닫힐 때 복원
  if (sCatBar) sCatBar.style.visibility = searchOpen ? 'hidden' : '';
  if (searchOpen) {
    setTimeout(()=>document.getElementById('searchInput').focus(), 320);
  } else {
    clearSearch();
  }
}

function getActiveTab() {
  if (document.getElementById('shortsScreen').classList.contains('active')) return 'shorts';
  if (document.getElementById('mapScreen').classList.contains('active'))   return 'map';
  if (document.getElementById('inquiryScreen').classList.contains('active')) return 'inquiry';
  return 'feed';
}

function onSearchInput(val) {
  searchQ = val.trim();
  document.getElementById('searchClear').classList.toggle('show', !!searchQ);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const activeTab = getActiveTab();
    if (activeTab === 'map') {
      loadMapShops(mapCat, nearbyOn, searchQ);
    } else if (activeTab === 'shorts') {
      // 숏폼 탭은 검색 미지원 (업체 전체 피드)
    } else {
      loadFeed(feedCat, searchQ);
    }
  }, 350);
}

function clearSearch() {
  searchQ = '';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  document.getElementById('searchClear').classList.remove('show');
  const activeTab = getActiveTab();
  if (activeTab === 'map') {
    loadMapShops(mapCat, nearbyOn, '');
  } else if (activeTab === 'shorts') {
    // 숏폼은 검색 미지원
  } else {
    loadFeed(feedCat, '');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 네이버 지도
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function waitNaverMap(cb, tries=0) {
  if (window.naver && window.naver.maps) { cb(); return; }
  if (tries > 40) { showToast('지도 로드 실패. 새로고침 해주세요'); return; }
  setTimeout(()=>waitNaverMap(cb, tries+1), 200);
}

function initMap() {
  if (mapInited) {
    if (naverMap) {
      naverMap.autoResize();
      loadMapShops(mapCat, nearbyOn, searchQ);
    }
    return;
  }
  // display:none 우회: naverMap 크기를 window 기준으로 강제 지정
  const hd  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hd') || '56');
  const nav = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav') || '60');
  const nm  = document.getElementById('naverMap');
  nm.style.width  = window.innerWidth  + 'px';
  nm.style.height = (window.innerHeight - hd - nav) + 'px';
  waitNaverMap(()=>{
    mapInited = true;
    naverMap = new naver.maps.Map('naverMap', {
      center: new naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
      mapTypeControl: false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
    });
    naver.maps.Event.addListener(naverMap, 'click', ()=>closeMapPopup());
    loadMapShops('all', false);
  });
}

function catClass(cat) { return CAT_CLASS[cat] || ''; }

// 카테고리별 배경색 (인라인 스타일용)
const CAT_COLOR = {
  '마사지':'#10B981', '헤드스파':'#6366F1',
  '피부관리':'#FF4D7D', '헤어':'#F59E0B', '메이크업':'#C084FC',
  '왁싱':'#EC4899', '반영구':'#06B6D4', '병원':'#3B82F6', '그외':'#8B5CF6',
};
function pinColor(cat) { return CAT_COLOR[cat] || '#FF4D7D'; }

// DOM 엘리먼트 방식으로 마커 생성 (썸네일 카드형)
function buildMarkerEl(shop, selected) {
  const isPrem = !!shop.isPremium;
  const ac   = isPrem ? '#FFD700' : pinColor(shop.category);
  const scale = selected ? 'scale(1.18)' : (isPrem ? 'scale(1.08)' : 'scale(1)');
  const shadow = selected
    ? '0 6px 28px rgba(0,0,0,.8)'
    : isPrem
      ? '0 4px 20px rgba(255,200,0,.6), 0 2px 12px rgba(0,0,0,.5)'
      : '0 3px 12px rgba(0,0,0,.5)';
  const border = selected
    ? '2.5px solid #fff'
    : isPrem
      ? '2.5px solid #FFD700'
      : '2px solid rgba(255,255,255,.4)';
  const cardWidth = isPrem ? '108px' : '90px';

  // 썸네일: 유튜브 우선 → 등록 썸네일 → 카테고리 색 배경
  const thumbUrl = shop.youtubeId
    ? 'https://img.youtube.com/vi/' + shop.youtubeId + '/maxresdefault.jpg'
    : shop.thumbnail || '';

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'display:flex;flex-direction:column;align-items:center;',
    'cursor:pointer;',
    'transform:' + scale + ';transition:transform .2s;',
  ].join('');

  // 프리미엄 글로우 링 (애니메이션)
  if (isPrem && !selected) {
    const glow = document.createElement('div');
    glow.style.cssText = [
      'position:absolute;',
      'width:' + cardWidth + ';height:70px;',
      'border-radius:12px;',
      'background:transparent;',
      'border:2px solid rgba(255,215,0,.5);',
      'animation:premGlow 2s ease-in-out infinite;',
      'pointer-events:none;',
      'z-index:-1;',
    ].join('');
    wrap.appendChild(glow);
  }

  // 카드 본체
  const card = document.createElement('div');
  card.style.cssText = [
    'border-radius:10px;overflow:hidden;',
    'box-shadow:' + shadow + ';',
    'border:' + border + ';',
    'width:' + cardWidth + ';',
    'background:' + (isPrem ? '#1a1500' : '#111') + ';',
    'position:relative;',
  ].join('');

  // 프리미엄 뱃지 (카드 위)
  if (isPrem) {
    const badge = document.createElement('div');
    badge.style.cssText = [
      'position:absolute;top:3px;left:4px;z-index:5;',
      'background:linear-gradient(90deg,#FFD700,#FFA500);',
      'color:#000;font-size:8px;font-weight:900;',
      'padding:2px 6px;border-radius:8px;',
      'letter-spacing:.3px;',
      'box-shadow:0 1px 6px rgba(255,180,0,.6);',
    ].join('');
    badge.textContent = '✦ PREMIUM';
    card.appendChild(badge);
  }

  // 썸네일 영역
  const imgWrap = document.createElement('div');
  imgWrap.style.cssText = 'width:' + cardWidth + ';height:' + (isPrem ? '68px' : '56px') + ';overflow:hidden;position:relative;';

  if (thumbUrl) {
    const img = document.createElement('img');
    img.src = thumbUrl;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror = function() {
      if (this.src.includes('maxresdefault')) {
        this.onerror = function() { imgWrap.style.background = ac; this.style.display='none'; };
        this.src = 'https://img.youtube.com/vi/' + shop.youtubeId + '/hqdefault.jpg';
      } else { imgWrap.style.background = ac; this.style.display='none'; }
    };
    imgWrap.appendChild(img);
  } else {
    imgWrap.style.background = isPrem
      ? 'linear-gradient(135deg,#2a1f00,#1a1200)'
      : ac;
    imgWrap.style.display = 'flex';
    imgWrap.style.alignItems = 'center';
    imgWrap.style.justifyContent = 'center';
    imgWrap.innerHTML = '<span style="font-size:' + (isPrem ? '26px' : '22px') + '">💄</span>';
  }

  // 유튜브 아이콘 뱃지
  if (shop.youtubeId) {
    const ytBadge = document.createElement('div');
    ytBadge.style.cssText = [
      'position:absolute;bottom:3px;right:3px;',
      'background:rgba(255,0,0,.85);border-radius:3px;',
      'padding:1px 4px;font-size:9px;color:#fff;font-weight:700;',
    ].join('');
    ytBadge.textContent = '▶';
    imgWrap.appendChild(ytBadge);
  }

  // 업체명 라벨
  const label = document.createElement('div');
  label.style.cssText = [
    'font-size:' + (isPrem ? '11px' : '10px') + ';font-weight:800;',
    'color:' + (isPrem ? '#FFD700' : '#fff') + ';',
    'padding:' + (isPrem ? '5px 6px' : '4px 5px') + ';',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
    'text-align:center;',
    'background:' + (isPrem ? 'rgba(30,20,0,.92)' : 'rgba(0,0,0,.75)') + ';',
    'font-family:-apple-system,sans-serif;',
    'border-top:1px solid ' + (isPrem ? 'rgba(255,200,0,.3)' : 'rgba(255,255,255,.1)') + ';',
  ].join('');
  label.textContent = shop.name;

  card.appendChild(imgWrap);
  card.appendChild(label);

  // 말풍선 꼬리
  const tailColor = selected
    ? 'rgba(255,255,255,.9)'
    : isPrem ? '#FFD700' : 'rgba(255,255,255,.4)';
  const tail = document.createElement('div');
  tail.style.cssText = [
    'width:0;height:0;',
    'border-left:' + (isPrem ? '8px' : '7px') + ' solid transparent;',
    'border-right:' + (isPrem ? '8px' : '7px') + ' solid transparent;',
    'border-top:' + (isPrem ? '10px' : '9px') + ' solid ' + tailColor + ';',
    'margin-top:-1px;',
  ].join('');

  wrap.appendChild(card);
  wrap.appendChild(tail);
  wrap.onclick = (e) => { e.stopPropagation(); selectShopOnMap(shop.id); };
  return wrap;
}

function createNaverMarker(shop, selected=false) {
  const el  = buildMarkerEl(shop, selected);
  const pos = new naver.maps.LatLng(shop.lat, shop.lng);
  const overlay = new naver.maps.CustomOverlay({
    position: pos,
    content: el,
    anchor: new naver.maps.Point(45, 74),
    zIndex: selected ? 200 : (shop.isPremium ? 150 : shop.featured ? 100 : 10),
    map: naverMap,
  });
  return overlay;
}

function fitMapToBounds(shops) {
  if (!shops.length || !naverMap) return;
  if (shops.length === 1) {
    naverMap.setCenter(new naver.maps.LatLng(shops[0].lat, shops[0].lng));
    naverMap.setZoom(14);
  } else {
    const lats = shops.map(s => s.lat);
    const lngs = shops.map(s => s.lng);
    const sw = new naver.maps.LatLng(Math.min(...lats), Math.min(...lngs));
    const ne = new naver.maps.LatLng(Math.max(...lats), Math.max(...lngs));
    const bounds = new naver.maps.LatLngBounds(sw, ne);
    naverMap.fitBounds(bounds, { top: 80, right: 60, bottom: 140, left: 60 });
    setTimeout(() => {
      if (naverMap.getZoom() > 14) naverMap.setZoom(14);
    }, 350);
  }
}

function renderNaverMarkers(shops) {
  Object.values(nvMarkers).forEach(o => o.setMap(null));
  nvMarkers = {};
  if (!shops.length) return;
  shops.forEach(shop => {
    nvMarkers[shop.id] = createNaverMarker(shop, false);
  });
  // 지도 렌더 완료 후 fitBounds (타이밍 넉넉히)
  setTimeout(() => fitMapToBounds(shops), 100);
  setTimeout(() => fitMapToBounds(shops), 600);
}

function selectShopOnMap(id) {
  _sessionTrackMapPin(); // 👁️ 세션 추적 - 지도 마커 클릭
  const shop = allShops.find(s=>s.id===id);
  if (!shop) return;
  _sessionEvent('map_pin', shop);     // 👁️ 업체 이벤트
  curShop = shop;

  // 마커 선택 상태 갱신
  Object.entries(nvMarkers).forEach(([sid, overlay])=>{
    const s = allShops.find(x=>x.id===+sid);
    if (!s) return;
    overlay.setContent(buildMarkerEl(s, +sid===id));
    overlay.setZIndex(+sid===id ? 200 : (s.isPremium ? 150 : s.featured ? 100 : 10));
  });

  // 지도 중심 이동 (팝업 높이만큼 위로 offset)
  naverMap.panTo(new naver.maps.LatLng(shop.lat, shop.lng));



  // ── 지도 위 팝업 카드 열기 ──
  openMapPopup(shop);
}

// ── 지도 위 팝업 카드 ──────────────────────────────────────────────────────
let popupYtLoaded = false;

function openMapPopup(shop) {
  const popup = document.getElementById('mapPopup');
  const ytEl  = document.getElementById('mpYt');

  // 유튜브 or 썸네일
  if (shop.youtubeId) {
    const ytThumb = 'https://img.youtube.com/vi/' + shop.youtubeId + '/maxresdefault.jpg';
    ytEl.innerHTML = \`
      <div class="mp-yt-thumb-wrap" style="position:relative;width:100%;padding-top:52%;background:#111;overflow:hidden">
        <img src="\${ytThumb}"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;cursor:pointer"
          onerror="if(this.src.includes('maxresdefault')){this.src=this.src.replace('maxresdefault','hqdefault')}else{this.style.display='none'}"
          onclick="loadYtInPopup('\${shop.youtubeId}')" alt=""/>
        <div onclick="loadYtInPopup('\${shop.youtubeId}')"
          style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                 background:rgba(0,0,0,.3);cursor:pointer">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.93);
                      display:flex;align-items:center;justify-content:center;
                      box-shadow:0 4px 20px rgba(0,0,0,.5)">
            <i class="fas fa-play" style="color:#111;font-size:20px;margin-left:4px"></i>
          </div>
        </div>
      </div>
    \`;
  } else if (shop.thumbnail) {
    ytEl.innerHTML = \`<img src="\${shop.thumbnail}"
      onerror="this.style.display='none'"
      style="width:100%;height:160px;object-fit:cover;display:block" alt=""/>\`;
  } else {
    ytEl.innerHTML = '';
  }

  // 텍스트 정보
  const bg = pinColor(shop.category);
  document.getElementById('mpBadge').innerHTML =
    \`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:\${bg};margin-right:4px"></span>\${shop.category}\`;
  document.getElementById('mpName').textContent  = shop.name;
  document.getElementById('mpMeta').innerHTML    =
    \`<i class="fas fa-map-marker-alt" style="color:var(--green)"></i>\${shop.district}&nbsp;·&nbsp;\${shop.price}\`;
  document.getElementById('mpDesc').textContent  = shop.desc || '';
  document.getElementById('mpTags').innerHTML    =
    shop.tags.map(t=>\`<span class="mp-tag">\${t}</span>\`).join('');

  // 프리미엄 뱃지
  const mpPremEl = document.getElementById('mpPremiumBadge');
  if (mpPremEl) {
    mpPremEl.style.display = shop.isPremium ? 'inline-flex' : 'none';
  }
  // 프리미엄 팝업 테두리 강조
  if (shop.isPremium) {
    popup.style.border = '1.5px solid rgba(255,200,0,.45)';
    popup.style.boxShadow = '0 8px 32px rgba(0,0,0,.7), 0 0 0 1px rgba(255,200,0,.2)';
  } else {
    popup.style.border = '1px solid rgba(255,255,255,.1)';
    popup.style.boxShadow = '0 8px 32px rgba(0,0,0,.7)';
  }

  const bookEl = document.getElementById('mpBook');
  bookEl.style.opacity      = shop.smartPlaceUrl ? '1' : '.35';
  bookEl.style.pointerEvents= shop.smartPlaceUrl ? 'auto' : 'none';
  // 프리미엄 예약 버튼 스타일
  if (shop.isPremium && shop.smartPlaceUrl) {
    bookEl.style.background = 'linear-gradient(135deg,#FFD700,#FF8C00)';
    bookEl.style.color = '#000';
    bookEl.style.boxShadow = '0 3px 12px rgba(255,180,0,.4)';
  } else {
    bookEl.style.background = '';
    bookEl.style.color = '';
    bookEl.style.boxShadow = '';
  }

  popup.classList.add('show');
}

function loadYtInPopup(ytId) {
  // 지도 팝업 썸네일 클릭 → 영상조회 카운팅 (세션 내 1회, 출처: map)
  if (curShop?.id) trackView(curShop.id, 'map');
  document.getElementById('mpYt').innerHTML = \`
    <div style="position:relative;width:100%;padding-top:52%;background:#000">
      <iframe style="position:absolute;inset:0;width:100%;height:100%;border:none"
        src="https://www.youtube.com/embed/\${ytId}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1"
        allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>
    </div>
  \`;
}

function closeMapPopup() {
  document.getElementById('mapPopup').classList.remove('show');
  // 유튜브 멈추기
  document.getElementById('mpYt').innerHTML = '';
  // 마커 선택 해제
  Object.entries(nvMarkers).forEach(([sid, overlay])=>{
    const s = allShops.find(x=>x.id===+sid);
    if (s) { overlay.setContent(buildMarkerEl(s,false)); overlay.setZIndex(s.isPremium ? 150 : s.featured ? 100 : 10); }
  });
  curShop = null;
}

async function loadMapShops(cat, nearby, q='') {
  let url = '/api/shops?category='+encodeURIComponent(cat==='all'?'':cat);
  if (nearby && userLat) url += '&nearby=1&lat='+userLat+'&lng='+userLng;
  if (q) url += '&q='+encodeURIComponent(q);
  const res = await fetch(url);
  allShops  = await res.json();
  renderNaverMarkers(allShops);
}

function filterMap(btn, cat) {
  document.querySelectorAll('.mc').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  mapCat = cat;
  const frame = document.getElementById('mapFrame');
  if (frame) frame.contentWindow.postMessage({ type:'filterCat', cat }, '*');
}

function toggleNearby() {
  const fab = document.getElementById('nearbyFab');
  if (nearbyOn) {
    nearbyOn=false; userLat=null; userLng=null;
    fab.classList.remove('on');
    fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변';
    if (userMarker) { userMarker.setMap(null); userMarker=null; }
    loadMapShops(mapCat, false);
    return;
  }
  if (!navigator.geolocation) { showToast('위치 서비스를 지원하지 않아요'); return; }
  showToast('📍 위치 확인 중...');
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat=pos.coords.latitude; userLng=pos.coords.longitude;
    nearbyOn=true;
    fab.classList.add('on');
    fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변 ON';
    if (userMarker) userMarker.setMap(null);
    userMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(userLat, userLng),
      map: naverMap,
      icon: {
        content:'<div style="width:16px;height:16px;border-radius:50%;background:#FF4D7D;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
        anchor: new naver.maps.Point(8,8),
      }
    });
    naverMap.setCenter(new naver.maps.LatLng(userLat, userLng));
    naverMap.setZoom(14);
    loadMapShops(mapCat, true);
    showToast('📍 내 주변 샵을 찾았어요!');
  }, ()=>{ showToast('위치 권한이 필요해요'); }, {timeout:8000,enableHighAccuracy:true});
}

// ── 피드 바텀시트 (피드 탭 전용) ─────────────────────────────────────────
function openFeedSheet(id) {
  const s = allShops.find(x=>x.id===id);
  if (!s) return;
  curShop = s;
  document.getElementById('sImg').src            = s.thumbnail;
  document.getElementById('sCat').textContent    = s.category;
  document.getElementById('sName').textContent   = s.name;
  document.getElementById('sAddr').textContent   = s.address;
  document.getElementById('sPhone').textContent  = s.phone||'';
  document.getElementById('sDesc').textContent   = s.desc||'';
  document.getElementById('sPrice').textContent  = s.price;
  document.getElementById('sTags').innerHTML     = s.tags.map(t=>\`<span class="s-tag">\${t}</span>\`).join('');
  const bookEl = document.getElementById('sBook');
  bookEl.style.opacity = s.smartPlaceUrl ? '1' : '.4';
  bookEl.style.pointerEvents = s.smartPlaceUrl ? 'auto' : 'none';
  document.getElementById('dim').classList.add('on');
  document.getElementById('sheet').classList.add('open');
}
function closeFeedSheet() {
  document.getElementById('dim').classList.remove('on');
  document.getElementById('sheet').classList.remove('open');
}
// ── 마지막 영상 재생 출처 기억 (예약클릭 전환율 분석용) ──────────────────
// trackView() 호출 시 갱신 → 예약클릭 시 참조
let lastViewSrc = null; // 'feed' | 'catalog' | 'map' | null

// 피드 예약 트래킹 (영상 시청 출처 포함)
function trackSP() {
  if (!curShop) return;
  fetch('/api/track/sp/' + curShop.id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: lastViewSrc }),
  }).catch(()=>{});
}
// 지도 예약 트래킹 (영상 시청 출처 포함)
function trackMapSP(id) {
  fetch('/api/track/mapsp/' + id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: lastViewSrc }),
  }).catch(()=>{});
}
// 지도 팝업 예약버튼 전용 (인라인 onclick 대체)
function trackMapSPWithSrc(id) {
  _sessionTrackMapBook(); // 👁️ 세션 추적 - 지도 예약클릭
  _sessionEvent('map_book', curShop); // 👁️ 업체 이벤트
  trackMapSP(id);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 예약 모달 (m.place.naver.com iframe)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _rsvOrigUrl = '';
function openInapp() {
  if (!curShop || !curShop.smartPlaceUrl) { showToast('예약 링크가 없어요'); return; }
  trackSP();
  _rsvOrigUrl = curShop.smartPlaceUrl;
  const name = curShop.name || '';
  document.getElementById('rsvTitle').textContent = name + ' 예약하기';
  // 외부열기 버튼 → 원본 naver.me URL 유지
  document.getElementById('rsvExtBtn').onclick = () =>
    window.open(_rsvOrigUrl, '_blank', 'noopener,noreferrer');
  // 모달 먼저 열고
  const frame   = document.getElementById('rsvFrame');
  const loading = document.getElementById('rsvLoading');
  frame.src = '';
  loading.classList.remove('hide');
  document.getElementById('rsvDim').classList.add('show');
  document.getElementById('rsvModal').classList.add('show');
  document.body.style.overflow = 'hidden';
  // 서버에서 naver.me → m.place.naver.com 변환
  fetch('/api/resolve-naver?url=' + encodeURIComponent(_rsvOrigUrl))
    .then(r => r.json())
    .then(d => {
      frame.src = d.resolved;
      frame.onload = () => loading.classList.add('hide');
    })
    .catch(() => {
      // 실패 시 원본 URL 직접 사용
      frame.src = _rsvOrigUrl;
      frame.onload = () => loading.classList.add('hide');
    });
}
function closeReserve() {
  document.getElementById('rsvDim').classList.remove('show');
  document.getElementById('rsvModal').classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => {
    const f = document.getElementById('rsvFrame');
    if (f) f.src = '';
  }, 400);
}
// 스와이프 다운으로 닫기 (topbar 영역만)
(function(){
  const topbar = document.querySelector('.rsv-topbar');
  if (!topbar) return;
  let sy = 0;
  topbar.addEventListener('touchstart', e => {
    sy = e.touches[0].clientY;
  }, {passive:true});
  topbar.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientY - sy > 50) closeReserve();
  }, {passive:true});
})();

// ── 지도 iframe → 메인 페이지 예약 모달 트리거 ─────────────────────────────
window.addEventListener('message', e => {
  if (e.data?.type === 'openInapp' && e.data.shop) {
    curShop = e.data.shop;
    openInapp();
  }
});

// 스와이프 다운으로 피드 시트 닫기
let tsY=0;
const sh=document.getElementById('sheet');
sh.addEventListener('touchstart',e=>{tsY=e.touches[0].clientY},{passive:true});
sh.addEventListener('touchend',  e=>{if(e.changedTouches[0].clientY-tsY>70)closeFeedSheet()},{passive:true});

// ── 토스트 ───────────────────────────────────────────────────────────────
let toastTmr;
function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTmr);
  toastTmr=setTimeout(()=>t.classList.remove('show'),2600);
}

function submitInquiry() {
  const owner = document.getElementById('iq-owner').value.trim();
  const phone = document.getElementById('iq-phone').value.trim();
  const name  = document.getElementById('iq-name').value.trim();
  const cat   = document.getElementById('iq-cat').value;
  const area  = document.getElementById('iq-area').value.trim();
  const agreed = document.getElementById('iq-agree-chk').checked;
  if (!owner || !phone || !name || !cat || !area) {
    showToast('⚠️ 필수 항목을 모두 입력해 주세요');
    return;
  }
  if (!agreed) {
    showToast('⚠️ 개인정보 수집·이용에 동의해 주세요');
    return;
  }
  const url = document.getElementById('iq-url').value.trim();
  const msg = document.getElementById('iq-msg').value.trim();
  _sessionTrackInquiry(); // 👁️ 세션 추적 - 문의 제출
  fetch('/api/inquiry', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, owner, category:cat, area, phone, url, message:msg })
  }).then(r => r.json()).then(() => {
    document.getElementById('iqForm').style.display = 'none';
    document.querySelector('.iq-agree').style.display = 'none';
    document.querySelector('.iq-submit').style.display = 'none';
    document.getElementById('iqDone').style.display = 'block';
    document.getElementById('iqDone').scrollIntoView({behavior:'smooth'});
  }).catch(() => {
    showToast('❌ 전송에 실패했어요. 다시 시도해 주세요');
  });
}

// 앱 진입 시 방문자 카운팅 (새로고침·최초진입 모두 포함)
fetch('/api/track/visit', { method: 'POST' }).catch(() => {});

loadFeed('all');
<\/script>
</body>
</html>`;
}
function shopDetailPage(shop, baseUrl) {
  const title = seoTitle(shop);
  const desc = seoDesc(shop);
  const region = extractRegion(shop.address);
  const city = extractCity(shop.address);
  const loc = region || city;
  const type = schemaType(shop.category);
  const ogImg = shop.thumbnail || `${baseUrl}/og-image.jpg`;
  const pageUrl = `${baseUrl}/shop/${shop.id}`;
  const tags = Array.isArray(shop.tags) ? shop.tags : [];
  const catEmoji = { 마사지: "💆", 헤드스파: "🧖", 피부관리: "✨", 헤어: "💇", 메이크업: "💄", 왁싱: "🌸", 반영구: "👁", 병원: "🏥", 그외: "🌟" };
  const emoji = catEmoji[shop.category] || "🌟";
  const schemaObj = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": pageUrl,
    name: shop.name,
    description: desc,
    url: pageUrl,
    telephone: shop.phone || void 0,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      addressLocality: loc,
      addressRegion: city,
      addressCountry: "KR"
    },
    geo: shop.lat && shop.lng ? {
      "@type": "GeoCoordinates",
      latitude: shop.lat,
      longitude: shop.lng
    } : void 0,
    image: shop.thumbnail ? {
      "@type": "ImageObject",
      url: shop.thumbnail,
      width: 800,
      height: 600
    } : void 0,
    priceRange: shop.price || void 0,
    hasMap: shop.smartPlaceUrl || void 0,
    sameAs: shop.smartPlaceUrl ? [shop.smartPlaceUrl] : void 0,
    // 네이버 지도 연동 강화
    ...shop.category === "마사지" && { serviceType: "마사지·스파" },
    ...shop.category === "헤드스파" && { serviceType: "헤드스파·두피케어" },
    ...shop.category === "피부관리" && { serviceType: "피부관리·에스테틱" },
    ...shop.category === "헤어" && { serviceType: "헤어살롱·미용실" }
  };
  const schema = JSON.stringify(schemaObj);
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "마이뷰티맵", item: baseUrl },
      { "@type": "ListItem", position: 2, name: `${loc} ${shop.category}`, item: `${baseUrl}/c/${encodeURIComponent(shop.category)}/${encodeURIComponent(loc)}` },
      { "@type": "ListItem", position: 3, name: shop.name, item: pageUrl }
    ]
  });
  const kws = [
    shop.name,
    `${loc} ${shop.category}`,
    `${loc} ${shop.category} 추천`,
    `${loc} ${shop.category} 잘하는 곳`,
    `${loc} ${shop.category} 예약`,
    `${loc} ${shop.category} 가격`,
    `${loc} ${shop.category} 후기`,
    `${city} ${shop.category}`,
    `${shop.name} 예약`,
    `${shop.name} 위치`,
    ...tags.map((t) => `${loc} ${t}`)
  ].filter(Boolean).join(",");
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="keywords" content="${kws}"/>
<link rel="canonical" href="${pageUrl}"/>
<meta property="og:type"        content="business.business"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image"       content="${ogImg}"/>
<meta property="og:url"         content="${pageUrl}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image"       content="${ogImg}"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${schema}<\/script>
<script type="application/ld+json">${breadcrumb}<\/script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',-apple-system,sans-serif;background:#0a0a0a;color:#fff;min-height:100vh}
.wrap{max-width:640px;margin:0 auto;padding-bottom:90px}
.top{display:flex;align-items:center;gap:12px;padding:14px 16px;position:sticky;top:0;z-index:10;
  background:rgba(10,10,10,.95);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.07)}
.back{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);border:none;
  color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.site-nm{font-size:15px;font-weight:800;color:#FF4D7D;letter-spacing:-.3px}
.thumb{width:100%;aspect-ratio:16/9;object-fit:cover;background:#111}
.thumb-ph{width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);
  display:flex;align-items:center;justify-content:center;font-size:72px}
.info{padding:20px 16px 0}
.badge{display:inline-flex;align-items:center;gap:5px;background:rgba(255,77,125,.12);
  color:#FF4D7D;font-size:11px;font-weight:700;padding:4px 11px;border-radius:20px;margin-bottom:10px}
h1{font-size:26px;font-weight:800;line-height:1.2;margin-bottom:8px;letter-spacing:-.5px}
.addr{font-size:13px;color:rgba(255,255,255,.45);display:flex;align-items:flex-start;gap:5px;margin-bottom:4px;line-height:1.5}
.shop-desc{font-size:14px;color:rgba(255,255,255,.65);line-height:1.75;margin-top:14px;white-space:pre-wrap}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.tag{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
  color:rgba(255,255,255,.65);font-size:11px;padding:4px 10px;border-radius:12px}
.price-box{margin:16px 16px 0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px 16px}
.price-lbl{font-size:11px;color:rgba(255,255,255,.35);margin-bottom:5px;font-weight:600}
.price-val{font-size:16px;font-weight:700}
.map-btn{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 16px 0;
  padding:14px;border-radius:14px;background:rgba(3,199,90,.1);border:1px solid rgba(3,199,90,.2);
  color:#03C75A;font-size:14px;font-weight:700;text-decoration:none;transition:background .2s}
.map-btn:hover{background:rgba(3,199,90,.18)}
.related{padding:28px 16px 0}
.rel-hd{font-size:12px;font-weight:700;color:rgba(255,255,255,.35);margin-bottom:12px;
  display:flex;align-items:center;gap:8px}
.rel-hd::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08)}
.rel-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rel-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px;cursor:pointer;text-decoration:none;display:block;transition:background .2s}
.rel-card:hover{background:rgba(255,255,255,.08)}
.rel-cat{font-size:10px;color:#FF4D7D;font-weight:700;margin-bottom:3px}
.rel-nm{font-size:13px;font-weight:700;margin-bottom:3px}
.rel-addr{font-size:11px;color:rgba(255,255,255,.38)}
/* SEO용 숨긴 텍스트 (크롤러 가독성↑) */
.seo-text{font-size:13px;color:rgba(255,255,255,.45);line-height:1.8;padding:20px 16px 0}
.seo-text h2{font-size:15px;font-weight:700;margin-bottom:8px;color:rgba(255,255,255,.6)}
/* 예약 버튼 */
.rsv-bar{position:fixed;bottom:0;left:0;right:0;padding:12px 16px;
  background:rgba(10,10,10,.97);backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.07);
  z-index:100}
.rsv-inner{display:flex;gap:10px;max-width:640px;margin:0 auto}
.btn-rsv{flex:1;padding:15px;border-radius:14px;border:none;
  background:linear-gradient(135deg,#FF4D7D,#FF8FA3);color:#fff;font-size:16px;font-weight:800;cursor:pointer}
.btn-home{flex:0 0 auto;padding:15px 18px;border-radius:14px;border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.06);color:#fff;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;
  display:flex;align-items:center;justify-content:center}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <button class="back" onclick="history.length>1?history.back():location.href='/'">&#8592;</button>
    <span class="site-nm">마이뷰티맵</span>
  </div>

  ${shop.thumbnail ? `<img class="thumb" src="${shop.thumbnail}" alt="${shop.name} ${loc} ${shop.category} 대표사진" loading="eager"/>` : `<div class="thumb-ph">${emoji}</div>`}

  <div class="info">
    <div class="badge">${emoji} ${shop.category}</div>
    <h1>${shop.name}</h1>
    <p class="addr">📍 <span>${shop.address}</span></p>
    ${shop.phone ? `<p class="addr">📞 <a href="tel:${shop.phone}" style="color:inherit;text-decoration:none">${shop.phone}</a></p>` : ""}
    ${shop.desc ? `<p class="shop-desc">${shop.desc}</p>` : ""}
    ${tags.length ? `<div class="tags">${tags.map((t) => `<span class="tag">#${t}</span>`).join("")}</div>` : ""}
  </div>

  ${shop.price ? `<div class="price-box"><div class="price-lbl">💰 가격 안내</div><div class="price-val">${shop.price}</div></div>` : ""}

  ${shop.smartPlaceUrl ? `<a class="map-btn" href="${shop.smartPlaceUrl}" target="_blank" rel="noopener">🗺️ 네이버 지도에서 보기</a>` : ""}

  <!-- SEO 텍스트 영역 – 크롤러 키워드 보강 -->
  <div class="seo-text">
    <h2>${loc} ${shop.category} 추천 – ${shop.name}</h2>
    <p>${shop.name}은(는) ${shop.address}에 위치한 ${loc} ${shop.category} 전문샵입니다.
    ${tags.length ? tags.join(", ") + " 등 다양한 시술을 제공하며," : ""}
    ${shop.price ? "가격은 " + shop.price + "입니다." : ""}
    ${loc} ${shop.category} 예약은 마이뷰티맵에서 바로 확인하세요.</p>
  </div>

  <div class="related" id="relShops"></div>
</div>

<div class="rsv-bar">
  <div class="rsv-inner">
    ${shop.smartPlaceUrl ? `<button class="btn-rsv" onclick="window.open('${shop.smartPlaceUrl}','_blank','noopener')">📅 네이버로 예약하기</button>` : `<button class="btn-rsv" onclick="location.href='/'">📅 다른 샵 예약하기</button>`}
    <a class="btn-home" href="/">홈</a>
  </div>
</div>

<script>
(async()=>{
  try{
    const r=await fetch('/api/shops?category=${encodeURIComponent(shop.category)}');
    const list=await r.json();
    const others=list.filter(s=>s.id!==${shop.id}).slice(0,4);
    if(!others.length)return;
    const el=document.getElementById('relShops');
    el.innerHTML='<div class="rel-hd">📍 ${loc} 근처 ${shop.category} 샵</div>'
      +'<div class="rel-grid">'+others.map(s=>{
        const a=(s.address||'').split(' ').slice(1,3).join(' ');
        return '<a class="rel-card" href="/shop/'+s.id+'">'
          +'<div class="rel-cat">'+s.category+'</div>'
          +'<div class="rel-nm">'+s.name+'</div>'
          +'<div class="rel-addr">📍 '+a+'</div>'
          +'</a>';
      }).join('')+'</div>';
  }catch(e){}
})();
<\/script>
</body>
</html>`;
}
function categoryLandingPage(category, region, shops, baseUrl) {
  const title = catSeoTitle(category, region);
  const desc = catSeoDesc(category, region, shops.length);
  const kws = catSeoKeywords(category, region);
  const pageUrl = `${baseUrl}/c/${encodeURIComponent(category)}/${encodeURIComponent(region)}`;
  const catEmoji = { 마사지: "💆", 헤드스파: "🧖", 피부관리: "✨", 헤어: "💇", 메이크업: "💄", 왁싱: "🌸", 반영구: "👁", 병원: "🏥", 그외: "🌟" };
  const emoji = catEmoji[category] || "🌟";
  const catList = ["마사지", "헤드스파", "피부관리", "헤어", "메이크업", "왁싱", "반영구", "병원", "그외"];
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: desc,
    url: pageUrl,
    numberOfItems: shops.length,
    itemListElement: shops.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${baseUrl}/shop/${s.id}`,
      description: seoDesc(s)
    }))
  });
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "마이뷰티맵", item: baseUrl },
      { "@type": "ListItem", position: 2, name: `${region} ${category}`, item: pageUrl }
    ]
  });
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="keywords" content="${kws}"/>
<link rel="canonical" href="${pageUrl}"/>
<meta property="og:type"        content="website"/>
<meta property="og:site_name"   content="마이뷰티맵"/>
<meta property="og:title"       content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image"       content="${baseUrl}/og-image.jpg"/>
<meta property="og:url"         content="${pageUrl}"/>
<meta property="og:locale"      content="ko_KR"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image"       content="${baseUrl}/og-image.jpg"/>
<meta name="robots" content="index,follow"/>
<meta name="author" content="마이뷰티맵"/>
<meta name="naver-site-verification" content="03dd559471b30f56932048b9f009cab98039d653"/>
<script type="application/ld+json">${schema}<\/script>
<script type="application/ld+json">${breadcrumb}<\/script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',-apple-system,sans-serif;background:#0a0a0a;color:#fff;min-height:100vh}
.wrap{max-width:640px;margin:0 auto;padding-bottom:40px}
.top{display:flex;align-items:center;gap:12px;padding:14px 16px;position:sticky;top:0;z-index:10;
  background:rgba(10,10,10,.95);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.07)}
.back{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);border:none;
  color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.site-nm{font-size:15px;font-weight:800;color:#FF4D7D}
/* 히어로 */
.hero{padding:28px 16px 22px;background:linear-gradient(180deg,rgba(255,77,125,.07) 0%,transparent 100%)}
.hero-emoji{font-size:44px;margin-bottom:12px}
h1{font-size:26px;font-weight:800;line-height:1.25;margin-bottom:8px;letter-spacing:-.5px}
.hero-sub{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:12px}
.hero-cnt{display:inline-block;background:rgba(255,77,125,.12);color:#FF4D7D;
  font-size:12px;font-weight:700;padding:4px 13px;border-radius:20px}
/* 빵부스러기 */
.bread{padding:12px 16px;font-size:12px;color:rgba(255,255,255,.3);display:flex;align-items:center;gap:6px}
.bread a{color:rgba(255,255,255,.3);text-decoration:none}
.bread a:hover{color:#FF4D7D}
/* 카테고리 탭 */
.cat-tabs{display:flex;gap:6px;padding:10px 16px;overflow-x:auto;scrollbar-width:none;
  border-bottom:1px solid rgba(255,255,255,.06)}
.cat-tabs::-webkit-scrollbar{display:none}
.ctab{flex-shrink:0;padding:7px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.1);
  background:transparent;color:rgba(255,255,255,.45);font-size:12px;font-weight:600;
  cursor:pointer;text-decoration:none;white-space:nowrap;transition:all .2s}
.ctab.on{background:#FF4D7D;border-color:#FF4D7D;color:#fff}
/* 업체 리스트 */
.list{padding:12px 16px;display:flex;flex-direction:column;gap:12px}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
  border-radius:16px;overflow:hidden;text-decoration:none;display:flex;transition:background .2s}
.card:hover{background:rgba(255,255,255,.08)}
.card-img{width:108px;min-height:100px;object-fit:cover;background:#1a1a1a;flex-shrink:0}
.card-ph{width:108px;display:flex;align-items:center;justify-content:center;
  font-size:38px;background:linear-gradient(135deg,#141414,#222)}
.card-body{padding:14px;flex:1;min-width:0}
.card-cat{font-size:10px;color:#FF4D7D;font-weight:700;margin-bottom:3px}
.card-nm{font-size:15px;font-weight:800;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card-addr{font-size:11px;color:rgba(255,255,255,.38);margin-bottom:6px}
.card-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.card-tag{background:rgba(255,255,255,.06);color:rgba(255,255,255,.55);font-size:10px;padding:2px 7px;border-radius:10px}
.card-price{font-size:11px;color:rgba(255,255,255,.4)}
.card-arrow{font-size:16px;color:rgba(255,255,255,.2);align-self:center;padding-right:14px;flex-shrink:0}
/* 빈 상태 */
.empty{text-align:center;padding:60px 16px;color:rgba(255,255,255,.3)}
.empty-icon{font-size:52px;margin-bottom:14px}
/* SEO 텍스트 */
.seo-text{padding:24px 16px 0;font-size:13px;color:rgba(255,255,255,.38);line-height:1.8}
.seo-text h2{font-size:14px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:6px}
.seo-text p{margin-bottom:10px}
/* 다른 카테고리 */
.other{padding:24px 16px 0}
.other-hd{font-size:12px;font-weight:700;color:rgba(255,255,255,.3);margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:6px 12px;border-radius:20px;border:1px solid rgba(255,255,255,.08);
  color:rgba(255,255,255,.4);font-size:11px;text-decoration:none;transition:all .2s}
.chip:hover{border-color:#FF4D7D;color:#FF4D7D}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <button class="back" onclick="history.length>1?history.back():location.href='/'">&#8592;</button>
    <span class="site-nm">마이뷰티맵</span>
  </div>

  <!-- 빵부스러기 (SEO) -->
  <nav class="bread" aria-label="breadcrumb">
    <a href="/">마이뷰티맵</a> › <span>${region} ${category}</span>
  </nav>

  <!-- 히어로 -->
  <div class="hero">
    <div class="hero-emoji">${emoji}</div>
    <h1>${region} ${category} 추천 TOP</h1>
    <p class="hero-sub">
      ${region} 인근 ${category} 전문샵 ${shops.length}곳 모음<br>
      가격·위치·예약·후기까지 한눈에 확인하세요
    </p>
    <span class="hero-cnt">총 ${shops.length}곳</span>
  </div>

  <!-- 카테고리 탭 -->
  <div class="cat-tabs">
    ${catList.map((c) => `<a class="ctab${c === category ? " on" : ""}" href="/c/${encodeURIComponent(c)}/${encodeURIComponent(region)}">${catEmoji[c] || "🌟"} ${c}</a>`).join("")}
  </div>

  <!-- 업체 목록 -->
  <div class="list">
    ${shops.length ? shops.map((s, i) => {
    const tags = Array.isArray(s.tags) ? s.tags : [];
    const addrShort = (s.address || "").split(" ").slice(1, 3).join(" ");
    const rank = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
    return `<a class="card" href="/shop/${s.id}">
        ${s.thumbnail ? `<img class="card-img" src="${s.thumbnail}" alt="${s.name} ${region} ${category}" loading="lazy"/>` : `<div class="card-ph">${emoji}</div>`}
        <div class="card-body">
          <div class="card-cat">${rank} ${s.category}</div>
          <div class="card-nm">${s.name}</div>
          <div class="card-addr">📍 ${addrShort}</div>
          ${tags.length ? `<div class="card-tags">${tags.map((t) => `<span class="card-tag">#${t}</span>`).join("")}</div>` : ""}
          ${s.price ? `<div class="card-price">💰 ${s.price}</div>` : ""}
        </div>
        <div class="card-arrow">›</div>
      </a>`;
  }).join("") : `
    <div class="empty">
      <div class="empty-icon">${emoji}</div>
      <div>${region} ${category} 업체를 준비 중이에요</div>
      <a href="/" style="color:#FF4D7D;font-size:13px;margin-top:12px;display:inline-block">전체 보기 →</a>
    </div>`}
  </div>

  <!-- SEO 텍스트 (크롤러 키워드 보강) -->
  <div class="seo-text">
    <h2>${region} ${category} 추천 가이드</h2>
    <p>${region} ${category} 잘하는 곳을 찾고 계신가요? 마이뷰티맵에서 ${region} 근처 ${category} 전문샵 ${shops.length}곳을 한눈에 비교해 보세요. 가격, 위치, 예약, 후기까지 모두 확인 가능합니다.</p>
    <p>${region} ${category} 예약 방법, 가격 비교, 잘하는 곳 추천 정보를 마이뷰티맵에서 확인하세요. ${category} 전문 업체들의 상세 정보와 네이버 예약 링크를 바로 이용하실 수 있습니다.</p>
  </div>

  <!-- 다른 카테고리 -->
  <div class="other">
    <div class="other-hd">🔍 다른 카테고리도 찾아보기</div>
    <div class="chips">
      ${catList.filter((c) => c !== category).map(
    (c) => `<a class="chip" href="/c/${encodeURIComponent(c)}/${encodeURIComponent(region)}">${catEmoji[c] || "🌟"} ${region} ${c}</a>`
  ).join("")}
    </div>
  </div>
</div>
</body>
</html>`;
}
function mapPage() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0a;
  font-family:-apple-system,'Pretendard',sans-serif}
#naverMap{width:100%;height:100%;}

/* ── 하단 카드 (모바일) ── */
#card{
  position:fixed;bottom:0;left:0;right:0;z-index:300;
  background:#141414;
  border-radius:22px 22px 0 0;
  box-shadow:0 -4px 40px rgba(0,0,0,.8);
  border-top:1px solid rgba(255,255,255,.08);
  transform:translateY(100%);
  transition:transform .32s cubic-bezier(.22,.68,0,1.2);
  overflow-y:auto;   /* hidden 제거 → 스크롤 가능 */
  max-height:85vh;
}
#card.open{transform:translateY(0)}

/* ── PC: 오른쪽 사이드 패널 ── */
@media(min-width:768px){
  #card{
    top:0;bottom:0;right:0;left:auto;
    width:360px;
    border-radius:0;
    border-top:none;
    border-left:1px solid rgba(255,255,255,.08);
    box-shadow:-4px 0 40px rgba(0,0,0,.8);
    /* iframe 부모가 100vh보다 작을 수 있으므로 100% 사용 */
    max-height:100%;
    transform:translateX(100%);
    transition:transform .32s cubic-bezier(.22,.68,0,1.2);
    overflow-y:auto;
    /* 스크롤바 스타일 */
    scrollbar-width:thin;
    scrollbar-color:rgba(255,255,255,.15) transparent;
  }
  #card.open{transform:translateX(0)}
  .card-handle{display:none}
  .card-close{top:14px;right:14px}
}

/* PC: 360px 너비 고정 → 16:9 = 202px 높이 명시 (overflow-y:auto 안에서도 확실하게 동작) */
@media(min-width:768px){
  .card-media{
    height:202px !important;
    padding-top:0 !important;
    flex-shrink:0;
  }
}
.card-handle{width:36px;height:4px;border-radius:2px;
  background:rgba(255,255,255,.18);margin:10px auto 0;flex-shrink:0}

/* 미디어 영역 (유튜브 or 썸네일) */
.card-media{
  position:relative;
  width:100%;
  aspect-ratio:16/9;   /* 모바일: aspect-ratio 정상 동작 */
  background:#000;
  overflow:hidden;
  flex-shrink:0;
}
.card-media > *{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
}
.card-media img{object-fit:cover;display:block}
.card-media iframe{border:none}
/* 썸네일 위 플레이 버튼 */
.play-btn{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.3);cursor:pointer;transition:background .2s;
}
.play-btn:hover{background:rgba(0,0,0,.15)}
.play-icon{
  width:52px;height:52px;border-radius:50%;
  background:rgba(255,0,0,.9);display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.5);
}
.play-icon svg{margin-left:3px}
/* 카드 상단 뱃지 오버레이 */
.card-overlay{
  position:absolute;top:10px;left:10px;right:10px;
  display:flex;justify-content:space-between;align-items:flex-start;
  pointer-events:none;
}
.card-cat-badge{
  font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;
  color:#fff;letter-spacing:.3px;backdrop-filter:blur(4px);
  background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2);
}
.card-feat-badge{
  font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;
  color:#fff;background:#FF4D7D;
}
.card-close{
  position:absolute;top:10px;right:10px;
  width:30px;height:30px;border-radius:50%;
  background:rgba(0,0,0,.6);backdrop-filter:blur(6px);
  border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  pointer-events:auto;
}

/* 카드 바디 */
.card-body{padding:14px 16px 28px}
.card-name{
  font-size:18px;font-weight:800;color:#fff;
  margin-bottom:8px;letter-spacing:-.4px;
}
/* 위치 + 가격 한 줄 */
.card-meta{
  display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;
}
.card-location{
  display:flex;align-items:center;gap:4px;
  font-size:12px;color:rgba(255,255,255,.45);
}
.card-location svg{flex-shrink:0}
.card-price{
  font-size:12px;font-weight:700;color:#FF4D7D;
  background:rgba(255,77,125,.12);padding:3px 9px;
  border-radius:999px;border:1px solid rgba(255,77,125,.2);
}
/* 설명 */
.card-desc{
  font-size:13px;color:rgba(255,255,255,.55);
  line-height:1.55;margin-bottom:12px;
}
/* 태그 */
.card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.card-tag{
  font-size:11px;color:rgba(255,255,255,.45);
  background:rgba(255,255,255,.06);padding:3px 9px;
  border-radius:999px;border:1px solid rgba(255,255,255,.09);
}
/* 예약 버튼 */
.btn-reserve{
  width:100%;height:46px;border-radius:14px;border:none;
  background:#03C75A;color:#fff;
  font-size:14px;font-weight:800;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  font-family:inherit;letter-spacing:-.2px;transition:opacity .15s;
}
.btn-reserve:hover{opacity:.88}

/* ── 지도 인앱 브라우저 시트 ── */
.map-inapp-bg{
  display:none;position:fixed;inset:0;z-index:900;
  background:rgba(0,0,0,.55);backdrop-filter:blur(2px);
}
.map-inapp-bg.show{display:block}
.map-inapp-sheet{
  position:fixed;left:0;right:0;bottom:0;z-index:901;
  height:92vh;
  background:#1a1a1a;border-radius:20px 20px 0 0;
  display:flex;flex-direction:column;
  transform:translateY(100%);transition:transform .32s cubic-bezier(.22,.68,0,1.2);
}
.map-inapp-sheet.show{transform:translateY(0)}
.map-inapp-handle{
  width:36px;height:4px;border-radius:2px;
  background:rgba(255,255,255,.2);margin:10px auto 0;flex-shrink:0;
}
.map-inapp-bar{
  display:flex;align-items:center;padding:10px 14px;
  border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0;gap:6px;
}
.map-inapp-title{
  flex:1;font-size:14px;font-weight:700;color:#fff;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.map-inapp-btn{
  width:34px;height:34px;border-radius:10px;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:#fff;flex-shrink:0;
}
.map-inapp-btn-ext{background:rgba(255,255,255,.1)}
.map-inapp-btn-ext:active{background:rgba(255,255,255,.2)}
.map-inapp-btn-close{background:rgba(255,77,125,.25)}
.map-inapp-btn-close:active{background:rgba(255,77,125,.45)}
.map-inapp-loader{
  flex-shrink:0;height:3px;background:rgba(255,255,255,.06);overflow:hidden;
}
.map-inapp-loader::after{
  content:'';display:block;height:100%;width:40%;
  background:#03C75A;animation:mload 1s ease-in-out infinite alternate;
}
@keyframes mload{from{transform:translateX(-100%)}to{transform:translateX(350%)}}
.map-inapp-loader.done{display:none}
.map-inapp-iframe{flex:1;border:none;background:#fff;width:100%;}
</style>
</head>
<body>
<div id="naverMap"></div>

<!-- 하단 카드 -->
<div id="card">
  <div class="card-handle"></div>
  <!-- 미디어 -->
  <div class="card-media" id="cardMedia">
    <!-- 썸네일+플레이버튼 래퍼: 전체 클릭 시 재생 -->
    <div id="thumbWrap" style="position:absolute;inset:0;cursor:pointer" onclick="playVideo()">
      <img id="cardThumb" src="about:blank" alt="" style="width:100%;height:100%;object-fit:cover;display:block">
      <div class="play-btn" id="playBtn" style="display:none">
        <div class="play-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
    </div>
    <!-- 실제 유튜브 iframe (클릭 후 로드) -->
    <iframe id="cardIframe" src="about:blank" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen style="display:none;position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>
    <!-- 오버레이 뱃지 -->
    <div class="card-overlay">
      <span id="cardCatBadge" class="card-cat-badge"></span>
      <span id="cardFeatBadge" class="card-feat-badge" style="display:none">⭐ PICK</span>
    </div>
    <button class="card-close" onclick="closeCard()">✕</button>
  </div>
  <!-- 바디 -->
  <div class="card-body">
    <div class="card-name" id="cardName"></div>
    <div class="card-meta">
      <span class="card-location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <span id="cardAddress"></span>
      </span>
      <span class="card-price" id="cardPrice"></span>
    </div>
    <div class="card-desc" id="cardDesc"></div>
    <div class="card-tags" id="cardTags"></div>
    <button class="btn-reserve" id="btnReserve" onclick="openReserve()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      네이버 예약하기
    </button>
  </div>
</div>

<!-- 인앱 브라우저 시트 (예약하기) -->

<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=xjjg4490h8"><\/script>
<script>
const CAT_COLOR = {
  '마사지':'#10B981','헤드스파':'#6366F1','피부관리':'#FF4D7D',
  '헤어':'#F59E0B','메이크업':'#C084FC','왁싱':'#EC4899','반영구':'#06B6D4','병원':'#3B82F6','그외':'#8B5CF6'
};

let map = null, markers = [], curCat = 'all', curShop = null;

window.addEventListener('message', e => {
  if (e.data?.type === 'filterCat') { curCat = e.data.cat; renderMarkers(); }
  if (e.data?.type === 'fitBounds') {
    // 지도 크기 재계산 후 fitBounds 재실행
    if (map) {
      map.autoResize();
      setTimeout(() => fitToBounds(curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat)), 200);
    }
  }
});

/* ── 카드 닫기 ── */
function closeCard() {
  document.getElementById('card').classList.remove('open');
  // iframe 정지 (src='' 하면 브라우저가 현재URL로 변환 → about:blank 사용)
  document.getElementById('cardIframe').src = 'about:blank';
  document.getElementById('cardIframe').style.display = 'none';
  document.getElementById('thumbWrap').style.display = 'block';
  document.getElementById('playBtn').style.display = 'none';
  curShop = null;
}

/* ── 유튜브 재생 ── */
function playVideo() {
  // 유튜브 없으면 아무것도 안 함
  if (!curShop?.youtubeId) return;
  // 지도 하단 카드 썸네일 클릭 → 영상조회 카운팅 (세션 내 1회, 출처: map)
  trackView(curShop.id, 'map');
  const iframe = document.getElementById('cardIframe');
  // 썸네일 직접 클릭 → mute 없이 재생 (광고 수익 활성화)
  iframe.src = \`https://www.youtube.com/embed/\${curShop.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&color=white\`;
  iframe.style.display = 'block';
  document.getElementById('thumbWrap').style.display = 'none';
}

/* ── 예약 버튼 ── */
// /reserve iframe → 메인 페이지로 postMessage → openInapp() 실행
function openReserve() {
  if (!curShop?.smartPlaceUrl) return;
  _sessionTrackMapBook(); // 👁️ 세션 추적 - 지도 팝업 예약클릭
  _sessionEvent('map_book', curShop);  // 👁️ 업체 이벤트
  // viewSrc는 지도 iframe 내부이므로 항상 'map'
  fetch('/api/track/mapsp/' + curShop.id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ viewSrc: 'map' }),
  }).catch(()=>{});
  window.parent.postMessage({
    type: 'openInapp',
    shop: {
      id:            curShop.id,
      name:          curShop.name,
      smartPlaceUrl: curShop.smartPlaceUrl
    }
  }, '*');
}

/* ── 카드 열기 ── */
function openCard(shop) {
  _sessionTrackFeedCard(); // 👁️ 세션 추적 - 피드 업체카드 클릭
  _sessionEvent('feed_card', shop);   // 👁️ 업체 이벤트
  curShop = shop;
  const color = CAT_COLOR[shop.category] || '#FF4D7D';

  const iframe   = document.getElementById('cardIframe');
  const thumbWrap = document.getElementById('thumbWrap');
  const thumb    = document.getElementById('cardThumb');
  const playBtn  = document.getElementById('playBtn');

  // ── 유튜브 있음 → 카드 열리자마자 바로 iframe 재생 ──
  if (shop.youtubeId) {
    // 썸네일 클릭 재생 → mute 없이 (광고 수익 활성화)
    iframe.src = \`https://www.youtube.com/embed/\${shop.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&color=white\`;
    iframe.style.display = 'block';
    thumbWrap.style.display = 'none';
    playBtn.style.display = 'none';

  // ── 유튜브 없음 → 사진(썸네일)만 표시, 클릭 불가 ──
  } else {
    iframe.src = 'about:blank';
    iframe.style.display = 'none';
    thumbWrap.style.display = 'block';
    thumbWrap.style.cursor = 'default';
    thumbWrap.onclick = null;  // 클릭 이벤트 제거 (사진만)
    playBtn.style.display = 'none';

    thumb.onerror = null;
    thumb.src = 'about:blank';
    const imgSrc = shop.thumbnail || '';
    if (imgSrc) {
      thumb.style.display = 'block';
      thumb.onerror = function() { this.style.display = 'none'; };
      thumb.src = imgSrc;
    } else {
      thumb.style.display = 'none';
    }
  }

  // 뱃지
  const catBadge = document.getElementById('cardCatBadge');
  catBadge.textContent = shop.category;
  catBadge.style.background = color + '99';

  document.getElementById('cardFeatBadge').style.display = shop.featured ? 'block' : 'none';

  // 텍스트
  document.getElementById('cardName').textContent = shop.name;
  document.getElementById('cardAddress').textContent = shop.address || shop.district || '';
  document.getElementById('cardPrice').textContent = shop.price;
  document.getElementById('cardDesc').textContent = shop.desc || '';

  // 태그
  document.getElementById('cardTags').innerHTML =
    (shop.tags || []).map(t => \`<span class="card-tag">#\${t}</span>\`).join('');

  // 예약 버튼
  const reserveBtn = document.getElementById('btnReserve');
  reserveBtn.style.display = shop.smartPlaceUrl ? 'flex' : 'none';

  document.getElementById('card').classList.add('open');
  window.parent.postMessage({ type:'shopSelected', id: shop.id }, '*');
  map.panTo(new naver.maps.LatLng(shop.lat, shop.lng));
  // position:fixed 카드가 iframe 첫 렌더 시 뷰포트 밖에 숨는 문제 해결
  // → map.autoResize()로 강제 리페인트 트리거
  requestAnimationFrame(() => { try { map.autoResize(); } catch(e){} });
}

/* 마커 생성 */
function makeMarker(shop) {
  const color = CAT_COLOR[shop.category] || '#FF4D7D';
  const html = \`<div style="
    display:inline-flex;flex-direction:column;align-items:center;
    cursor:pointer;transform-origin:bottom center;transition:transform .15s;
  " onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform='scale(1)'">
    <div style="
      background:\${color};color:#fff;
      font-size:11px;font-weight:800;
      padding:5px 12px;border-radius:999px;
      white-space:nowrap;
      box-shadow:0 3px 12px rgba(0,0,0,.5);
      border:2px solid rgba(255,255,255,.4);
      letter-spacing:-.2px;line-height:1;
      font-family:-apple-system,sans-serif;
    ">\${shop.name}</div>
    <div style="
      width:6px;height:6px;border-radius:50%;
      background:\${color};margin-top:3px;
      box-shadow:0 0 0 2px rgba(255,255,255,.3);
    "></div>
  </div>\`;
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(shop.lat, shop.lng),
    map: map,
    icon: {
      content: html,
      anchor: new naver.maps.Point(0, 0),
    },
    zIndex: shop.featured ? 100 : 10,
  });
  naver.maps.Event.addListener(marker, 'click', (e) => {
    e.domEvent?.stopPropagation?.();
    openCard(shop);
  });
  return marker;
}

/* 마커 렌더링 */
let allShops = [];
function renderMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
  const list = curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat);
  list.forEach(s => markers.push(makeMarker(s)));
  // 업체 전체가 보이도록 자동 범위 조정
  fitToBounds(list);
}

/* 전체 업체가 화면에 들어오도록 범위 조정 */
function fitToBounds(list) {
  if (!list.length || !map) return;
  if (list.length === 1) {
    // 업체 1개: 적당한 줌(14)으로 중앙 표시
    map.setCenter(new naver.maps.LatLng(list[0].lat, list[0].lng));
    map.setZoom(14);
  } else {
    const lats = list.map(s => s.lat);
    const lngs = list.map(s => s.lng);
    const sw = new naver.maps.LatLng(Math.min(...lats), Math.min(...lngs));
    const ne = new naver.maps.LatLng(Math.max(...lats), Math.max(...lngs));
    const bounds = new naver.maps.LatLngBounds(sw, ne);
    map.fitBounds(bounds, { top:80, right:60, bottom:140, left:60 });
    // fitBounds 후 너무 가까이 줌인됐으면 최대 줌 14로 제한
    setTimeout(() => {
      if (map.getZoom() > 14) map.setZoom(14);
    }, 350);
  }
}

/* 지도 초기화 — 네이버 지도 스크립트 완전 로드 후 실행 */
function waitNaver(cb, t=0) {
  if (window.naver && window.naver.maps && window.naver.maps.Map) { cb(); return; }
  if (t > 50) return; // 10초 초과 포기
  setTimeout(() => waitNaver(cb, t+1), 200);
}

async function initMap() {
  map = new naver.maps.Map('naverMap', {
    center: new naver.maps.LatLng(36.5, 127.5),
    zoom: 7,
    mapTypeControl:  false,
    scaleControl:    false,
    logoControl:     false,
    mapDataControl:  false,
  });
  map.addListener('click', closeCard);

  const res = await fetch('/api/shops');
  allShops  = await res.json();
  renderMarkers();
}

window.onload = () => waitNaver(initMap);
<\/script>
</body>
</html>`;
}
function reportPage(token) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>마이뷰티맵 · 업체 리포트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
:root{
  --purple:#7c3aed;--purple-l:#a78bfa;--purple-ll:#c4b5fd;
  --green:#10b981;--pink:#FF4D7D;
  --bg:#09090f;--card:rgba(255,255,255,.04);--border:rgba(255,255,255,.08);
  --t1:#f1f5f9;--t2:#94a3b8;--t3:#475569;
}
body{background:var(--bg);color:var(--t1);font-family:'Pretendard',-apple-system,sans-serif;min-height:100vh}

/* ── 잠금 ── */
#lockScreen{display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-height:100vh;padding:24px}
.lock-logo{font-size:11px;font-weight:700;letter-spacing:3px;color:var(--purple-l);
  text-transform:uppercase;margin-bottom:28px}
.lock-card{background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:24px;
  padding:36px 28px;width:100%;max-width:340px;text-align:center}
.lock-icon{font-size:42px;margin-bottom:14px}
.lock-title{font-size:19px;font-weight:800;margin-bottom:8px}
.lock-desc{font-size:13px;color:var(--t2);margin-bottom:26px;line-height:1.7}
.lock-input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);
  border-radius:14px;padding:16px;color:#fff;font-size:22px;letter-spacing:8px;
  text-align:center;outline:none;transition:.2s;font-family:inherit}
.lock-input:focus{border-color:var(--purple-l);background:rgba(167,139,250,.08)}
.lock-btn{width:100%;margin-top:14px;padding:15px;
  background:linear-gradient(135deg,var(--purple),var(--purple-l));
  border:none;border-radius:14px;color:#fff;font-size:15px;font-weight:800;
  cursor:pointer;font-family:inherit}
.lock-btn:active{opacity:.8}
.lock-error{margin-top:10px;font-size:13px;color:#f87171;min-height:18px}

/* ── 리포트 ── */
#reportScreen{display:none;max-width:460px;margin:0 auto;padding-bottom:60px}

/* 헤더 */
.rp-header{padding:36px 20px 28px;text-align:center}
.rp-logo{font-size:10px;font-weight:700;letter-spacing:3px;color:var(--purple-l);
  text-transform:uppercase;margin-bottom:12px}
.rp-name{font-size:26px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:6px}
.rp-cat{font-size:13px;color:var(--t2);margin-bottom:18px}
.rp-period{display:inline-flex;align-items:center;gap:6px;
  background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.25);
  border-radius:20px;padding:7px 16px;font-size:12px;font-weight:600;color:var(--purple-ll)}

/* 구분선 */
.divider{height:1px;background:var(--border);margin:0 16px}

/* ── 빅 조회수 카드 ── */
.hero-card{margin:24px 16px 0;
  background:linear-gradient(135deg,rgba(124,58,237,.18),rgba(167,139,250,.07));
  border:1px solid rgba(167,139,250,.25);border-radius:22px;padding:28px 24px}
.hero-lbl{font-size:12px;font-weight:600;color:rgba(196,181,253,.7);margin-bottom:12px;
  display:flex;align-items:center;gap:6px}
.hero-num{font-size:56px;font-weight:900;color:#fff;line-height:1;letter-spacing:-3px;margin-bottom:12px}
.hero-num small{font-size:22px;font-weight:600;color:rgba(167,139,250,.6);margin-left:4px;letter-spacing:0}
.hero-badge{display:inline-flex;align-items:center;gap:6px;
  font-size:14px;font-weight:800;padding:6px 14px;border-radius:20px;margin-bottom:8px}
.badge-up{background:rgba(52,211,153,.14);color:#34d399}
.badge-down{background:rgba(248,113,113,.14);color:#f87171}
.badge-same{background:rgba(148,163,184,.1);color:var(--t2)}
.hero-sub{font-size:13px;color:var(--t2);line-height:1.5}

/* ── 액션 수 카드 ── */
.action-card{margin:12px 16px 0;
  background:var(--card);border:1px solid var(--border);
  border-radius:18px;padding:22px 24px;
  display:flex;align-items:center;gap:20px}
.action-left{flex:1}
.action-lbl{font-size:12px;font-weight:600;color:var(--t2);margin-bottom:10px;
  display:flex;align-items:center;gap:6px}
.action-num{font-size:40px;font-weight:900;color:var(--green);line-height:1;letter-spacing:-1px}
.action-num small{font-size:18px;font-weight:600;color:rgba(16,185,129,.6);margin-left:3px;letter-spacing:0}
.action-sub{font-size:12px;color:var(--t2);margin-top:6px}
.action-right{text-align:right}
.action-prev-lbl{font-size:10px;color:var(--t3);margin-bottom:4px}
.action-prev{font-size:13px;color:var(--t2);font-weight:600}
.action-badge{font-size:12px;font-weight:800;padding:4px 10px;border-radius:12px;margin-top:6px;display:inline-block}

/* ── 30일 차트 ── */
.chart-section{margin:20px 16px 0}
.chart-title{font-size:12px;font-weight:700;color:var(--t2);margin-bottom:12px;
  display:flex;align-items:center;gap:6px}
.chart-box{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:18px 12px 12px}
.chart-legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;padding:0 4px}
.leg{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--t2)}
.leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

/* ── 누적 한줄 ── */
.total-bar{margin:16px 16px 0;background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:16px 20px;
  display:flex;align-items:center;justify-content:space-between}
.total-lbl{font-size:12px;color:var(--t2)}
.total-num{font-size:18px;font-weight:900;color:var(--purple-l)}
.total-unit{font-size:12px;color:var(--t3);margin-left:2px}

/* ── 응원 메시지 ── */
.cheer-box{margin:20px 16px 0;
  background:linear-gradient(135deg,rgba(255,77,125,.1),rgba(255,143,163,.05));
  border:1px solid rgba(255,77,125,.2);border-radius:18px;padding:22px 20px;
  display:flex;gap:14px;align-items:flex-start}
.cheer-icon{font-size:26px;flex-shrink:0}
.cheer-head{font-size:16px;font-weight:800;color:#fff;margin-bottom:5px;line-height:1.3}
.cheer-sub{font-size:13px;color:rgba(255,255,255,.5);line-height:1.6}

/* 푸터 */
.rp-footer{margin:28px 16px 0;text-align:center;font-size:11px;color:var(--t3);line-height:1.9}
.rp-footer a{color:var(--purple-l);text-decoration:none}
</style>
</head>
<body>

<!-- 잠금 -->
<div id="lockScreen">
  <div class="lock-logo">✦ 마이뷰티맵</div>
  <div class="lock-card">
    <div class="lock-icon">🔐</div>
    <div class="lock-title">업체 리포트</div>
    <div class="lock-desc">등록하신 전화번호의<br><strong>마지막 4자리</strong>를 입력해주세요</div>
    <input class="lock-input" id="phoneInput" type="number" placeholder="••••"
      oninput="if(this.value.length>4)this.value=this.value.slice(0,4)"
      onkeydown="if(event.key==='Enter')doVerify()"/>
    <button class="lock-btn" id="lockBtn" onclick="doVerify()">확인</button>
    <div class="lock-error" id="lockError"></div>
  </div>
</div>

<!-- 리포트 -->
<div id="reportScreen" style="display:none">

  <div class="rp-header">
    <div class="rp-logo">✦ 마이뷰티맵 리포트</div>
    <div class="rp-name" id="rName">—</div>
    <div class="rp-cat"  id="rCat">—</div>
    <div class="rp-period" id="rPeriod">📅 이번 달 기준</div>
  </div>

  <div class="divider"></div>

  <!-- 영상 조회수 (핵심) -->
  <div class="hero-card">
    <div class="hero-lbl">👁 이번 달 영상 조회수</div>
    <div class="hero-num"><span id="kViews">0</span><small>명</small></div>
    <div class="hero-badge badge-same" id="kViewsBadge">—</div>
    <div class="hero-sub" id="kViewsSub"></div>
  </div>

  <!-- 예약+지도 합산 액션 -->
  <div class="action-card">
    <div class="action-left">
      <div class="action-lbl">🎯 이번 달 고객 액션</div>
      <div class="action-num"><span id="kAction">0</span><small>건</small></div>
      <div class="action-sub">예약 버튼 + 지도 클릭 합산</div>
    </div>
    <div class="action-right">
      <div class="action-prev-lbl">지난달</div>
      <div class="action-prev" id="kActionPrev">—</div>
      <div class="action-badge badge-same" id="kActionBadge"></div>
    </div>
  </div>

  <!-- 30일 추이 차트 -->
  <div class="chart-section">
    <div class="chart-title">📈 최근 30일 추이</div>
    <div class="chart-box">
      <canvas id="trendChart" height="160"></canvas>
      <div class="chart-legend">
        <div class="leg"><span class="leg-dot" style="background:#a78bfa"></span>영상조회</div>
        <div class="leg"><span class="leg-dot" style="background:#34d399"></span>고객액션</div>
      </div>
    </div>
  </div>

  <!-- 누적 조회수 한줄 -->
  <div class="total-bar">
    <div class="total-lbl">📊 서비스 시작 이후 누적 조회수</div>
    <div><span class="total-num" id="tViews">0</span><span class="total-unit">명</span></div>
  </div>

  <!-- 응원 메시지 -->
  <div class="cheer-box" id="cheerBox">
    <div class="cheer-icon" id="cheerIcon">💡</div>
    <div>
      <div class="cheer-head" id="cheerHead">—</div>
      <div class="cheer-sub"  id="cheerSub">—</div>
    </div>
  </div>

  <div class="rp-footer">
    마이뷰티맵 · 뷰티 숏폼 보고 바로 예약<br>
    <a href="/">mybeautymap.co.kr</a>
  </div>
</div>

<script>
const TOKEN = '${token}';

async function doVerify() {
  const v = document.getElementById('phoneInput').value.trim();
  if (v.length !== 4) { document.getElementById('lockError').textContent = '4자리를 입력해주세요'; return; }
  document.getElementById('lockError').textContent = '';
  const btn = document.getElementById('lockBtn');
  btn.disabled = true; btn.textContent = '확인 중...';
  try {
    const res = await fetch('/api/report/' + TOKEN + '/verify', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ phone4: v })
    });
    if (res.status === 401) { document.getElementById('lockError').textContent = '전화번호가 일치하지 않아요'; btn.disabled=false; btn.textContent='확인'; return; }
    if (!res.ok)            { document.getElementById('lockError').textContent = '잘못된 링크예요';           btn.disabled=false; btn.textContent='확인'; return; }
    renderReport(await res.json());
  } catch(e) {
    document.getElementById('lockError').textContent = '오류가 발생했어요. 다시 시도해주세요';
    btn.disabled=false; btn.textContent='확인';
  }
}

const fmt = n => (n||0).toLocaleString();

function pctBadge(curr, prev) {
  if (!prev) return { text:'첫 달 데이터', cls:'badge-same' };
  const p = Math.round(((curr-prev)/prev)*100);
  if (p > 0) return { text:'▲ '+p+'% 지난달보다 상승', cls:'badge-up' };
  if (p < 0) return { text:'▼ '+Math.abs(p)+'% 지난달보다 하락', cls:'badge-down' };
  return { text:'→ 지난달과 동일', cls:'badge-same' };
}

function renderReport(d) {
  document.getElementById('lockScreen').style.display   = 'none';
  document.getElementById('reportScreen').style.display = 'block';

  const now = new Date();
  const tm  = d.thisMonth || {};
  const lm  = d.lastMonth || {};

  /* 헤더 */
  document.getElementById('rName').textContent   = d.shop.name;
  document.getElementById('rCat').textContent    = d.shop.category + ' · ' + (d.shop.address||'').split(' ').slice(0,2).join(' ');
  document.getElementById('rPeriod').textContent = '📅 ' + now.getFullYear() + '년 ' + (now.getMonth()+1) + '월 기준';

  /* ── 영상 조회수 ── */
  document.getElementById('kViews').textContent = fmt(tm.views);

  const vb = pctBadge(tm.views, lm.views);
  const badge = document.getElementById('kViewsBadge');
  badge.textContent = vb.text; badge.className = 'hero-badge ' + vb.cls;

  document.getElementById('kViewsSub').textContent = tm.views > 0
    ? '이번 달 내 영상을 시청한 잠재 고객 수예요'
    : '아직 이번 달 데이터가 쌓이는 중이에요';

  /* ── 고객 액션 (예약+지도 합산) ── */
  const thisAction = (tm.feedSP||0) + (tm.mapSP||0);
  const lastAction = (lm.feedSP||0) + (lm.mapSP||0);
  document.getElementById('kAction').textContent    = fmt(thisAction);
  document.getElementById('kActionPrev').textContent = fmt(lastAction) + '건';

  const ab = pctBadge(thisAction, lastAction);
  const abadge = document.getElementById('kActionBadge');
  abadge.textContent = ab.text; abadge.className = 'action-badge ' + ab.cls;

  /* ── 30일 차트 (조회 + 액션 합산) ── */
  const rows   = d.daily30 || [];
  const labels = [], views = [], actions = [];
  rows.forEach(r => {
    const dt = new Date(r.d);
    labels.push((dt.getMonth()+1)+'/'+dt.getDate());
    views.push(parseInt(r.views)   || 0);
    actions.push((parseInt(r.feed_sp)||0) + (parseInt(r.map_sp)||0));
  });
  new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: { labels, datasets: [
      { label:'영상조회', data:views,   borderColor:'#a78bfa', backgroundColor:'rgba(167,139,250,.12)',
        tension:.4, fill:true, pointRadius:2, borderWidth:2 },
      { label:'고객액션', data:actions, borderColor:'#34d399', backgroundColor:'rgba(52,211,153,.08)',
        tension:.4, fill:true, pointRadius:2, borderWidth:2 },
    ]},
    options: {
      responsive:true, maintainAspectRatio:true,
      plugins:{ legend:{ display:false } },
      scales:{
        x:{ ticks:{ color:'#475569', font:{ size:9 }, maxTicksLimit:8 }, grid:{ color:'rgba(255,255,255,.04)' } },
        y:{ ticks:{ color:'#475569', font:{ size:10 } }, grid:{ color:'rgba(255,255,255,.05)' }, min:0 }
      }
    }
  });

  /* ── 누적 조회수 ── */
  document.getElementById('tViews').textContent = fmt(d.total.views);

  /* ── 응원 메시지 ── */
  const cPct = lm.views > 0 ? Math.round(((tm.views - lm.views) / lm.views) * 100) : null;
  const totalAct = (tm.views||0) + thisAction;
  let icon = '💡', head = '', sub = '';

  if (totalAct === 0) {
    icon = '🌱'; head = '데이터가 쌓이는 중이에요';
    sub  = '곧 결과가 나타날 거예요. 영상을 최신으로 유지해보세요!';
  } else if (cPct !== null && cPct >= 30) {
    icon = '🚀'; head = '이번 달 조회수가 크게 올랐어요! +' + cPct + '%';
    sub  = '지난달보다 훨씬 많은 잠재 고객이 업체를 발견하고 있어요.';
  } else if (thisAction >= 5) {
    icon = '🎉'; head = fmt(thisAction) + '명이 직접 행동했어요!';
    sub  = '영상을 보고 예약 또는 지도를 클릭한 실질적인 관심 고객이에요.';
  } else if ((tm.views||0) >= 20) {
    icon = '📣'; head = fmt(tm.views) + '명이 내 영상을 봤어요';
    sub  = '많은 잠재 고객이 관심을 보이고 있어요. 꾸준히 노출되는 중이에요.';
  } else {
    icon = '📈'; head = '꾸준히 노출되고 있어요';
    sub  = '마이뷰티맵에서 업체 정보가 고객들에게 전달되고 있어요.';
  }
  document.getElementById('cheerIcon').textContent = icon;
  document.getElementById('cheerHead').textContent = head;
  document.getElementById('cheerSub').textContent  = sub;
}
<\/script>
</body>
</html>`;
}
function adminPage() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>관리자 – 마이뷰티맵</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF4D7D;--green:#03C75A;--blue:#6495ed;--amber:#f59e0b;
  --bg:#0a0a0a;--card:#141414;--card2:#1a1a1a;--border:rgba(255,255,255,.07);
  --t1:#fff;--t2:rgba(255,255,255,.6);--t3:rgba(255,255,255,.3);--t4:rgba(255,255,255,.15)
}
body{font-family:'Pretendard',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh}

/* ── 상단바 ── */
.top{background:rgba(14,14,14,.98);border-bottom:1px solid var(--border);
  padding:0 16px;height:54px;display:flex;align-items:center;gap:10px;
  position:sticky;top:0;z-index:50;backdrop-filter:blur(12px)}
.back{font-size:20px;color:var(--t3);text-decoration:none;display:flex;align-items:center}
.back:hover{color:var(--t1)}
.ttl{font-size:16px;font-weight:800;flex:1}
.add-btn{background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:6px;font-family:inherit;white-space:nowrap}

/* ── 탭바 ── */
.tabbar{display:flex;border-bottom:1px solid var(--border);background:rgba(14,14,14,.92);
  position:sticky;top:54px;z-index:40;backdrop-filter:blur(8px)}
.tabbtn{flex:1;padding:12px 4px;text-align:center;font-size:11px;font-weight:700;
  color:var(--t3);background:none;border:none;cursor:pointer;
  font-family:inherit;border-bottom:2px solid transparent;transition:all .2s;
  display:flex;flex-direction:column;align-items:center;gap:3px}
.tabbtn i{font-size:15px}
.tabbtn.on{color:var(--pink);border-bottom-color:var(--pink)}

/* ── 공통 레이아웃 ── */
.wrap{max-width:640px;margin:0 auto;padding:14px 14px 100px}
.section-title{font-size:11px;font-weight:700;color:var(--t3);
  letter-spacing:.6px;text-transform:uppercase;margin:18px 0 10px 2px;
  display:flex;align-items:center;gap:6px}
.section-title::after{content:'';flex:1;height:1px;background:var(--border)}

/* ── 오늘 KPI 그리드 (2x2) ── */
.kpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.kpi-card{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px 14px 12px;position:relative;overflow:hidden}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.kpi-visit::before{background:linear-gradient(90deg,#a78bfa,#7c3aed)}
.kpi-view::before{background:linear-gradient(90deg,#FF8FA3,#FF4D7D)}
.kpi-feed::before{background:linear-gradient(90deg,#6ee7b7,#03C75A)}
.kpi-map::before{background:linear-gradient(90deg,#93c5fd,#6495ed)}
.kpi-icon{font-size:18px;margin-bottom:6px}
.kpi-val{font-size:26px;font-weight:800;line-height:1;margin-bottom:4px}
.kpi-visit .kpi-val{color:#a78bfa}
.kpi-view  .kpi-val{color:#FF8FA3}
.kpi-feed  .kpi-val{color:var(--green)}
.kpi-map   .kpi-val{color:var(--blue)}
.kpi-lbl{font-size:10px;color:var(--t3);font-weight:600;margin-bottom:6px}
.kpi-delta{font-size:9px;font-weight:700;display:inline-flex;align-items:center;
  gap:3px;padding:2px 7px;border-radius:20px}
.kpi-delta.up  {background:rgba(3,199,90,.12);color:#03C75A}
.kpi-delta.down{background:rgba(255,77,125,.12);color:var(--pink)}
.kpi-delta.flat{background:rgba(255,255,255,.05);color:var(--t3)}

/* ── 오늘 vs 누적 요약바 ── */
.summary-bar{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
.sb-item{background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:10px 8px;text-align:center}
.sb-val{font-size:18px;font-weight:800;color:rgba(255,255,255,.85)}
.sb-lbl{font-size:9px;color:var(--t3);font-weight:600;margin-top:3px}

/* ── 차트 섹션 ── */
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px;margin-bottom:8px}
.chart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.chart-title{font-size:12px;font-weight:700;color:var(--t2)}
.chart-tabs{display:flex;gap:4px}
.ctab{font-size:10px;font-weight:700;padding:4px 10px;border-radius:6px;
  cursor:pointer;border:1px solid var(--border);color:var(--t3);
  background:none;transition:all .15s;font-family:inherit}
.ctab.on-v{background:rgba(255,143,163,.15);border-color:rgba(255,143,163,.4);color:#FF8FA3}
.ctab.on-f{background:rgba(3,199,90,.15);border-color:rgba(3,199,90,.4);color:var(--green)}
.ctab.on-m{background:rgba(100,149,237,.15);border-color:rgba(100,149,237,.4);color:var(--blue)}
.ctab.on-a{background:rgba(167,139,250,.15);border-color:rgba(167,139,250,.4);color:#a78bfa}
.chart-body{display:flex;align-items:flex-end;gap:3px;height:80px;
  overflow-x:auto;overflow-y:hidden;padding-bottom:0;scrollbar-width:none}
.chart-body::-webkit-scrollbar{display:none}
.bar-col{display:flex;flex-direction:column;align-items:center;gap:2px;
  flex-shrink:0;min-width:20px;cursor:default}
.bar-col:hover .bar-fill{opacity:.75}
.bar-fill{border-radius:3px 3px 0 0;width:14px;min-height:2px;transition:height .3s}
.bar-visit{background:linear-gradient(180deg,#c4b5fd,#7c3aed)}
.bar-view {background:linear-gradient(180deg,#FFB6C8,#FF4D7D)}
.bar-feed {background:linear-gradient(180deg,#6ee7b7,#03C75A)}
.bar-map  {background:linear-gradient(180deg,#93c5fd,#6495ed)}
.bar-today{background:linear-gradient(180deg,#fde68a,#f59e0b)!important}
.bar-date{font-size:7px;color:var(--t4);white-space:nowrap;margin-top:2px}
.bar-cnt{font-size:7px;color:var(--t3);font-weight:700;min-height:10px}
.chart-footer{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
.chart-legend{font-size:9px;color:var(--t4);font-weight:500}
.reset-btn{font-size:10px;font-weight:700;padding:4px 10px;
  background:rgba(255,77,125,.1);color:var(--pink);
  border:1px solid rgba(255,77,125,.25);border-radius:7px;cursor:pointer;
  transition:all .2s;white-space:nowrap}
.reset-btn:active{background:rgba(255,77,125,.22)}
.chart-empty{color:var(--t3);font-size:11px;text-align:center;padding:20px 0;height:80px;display:flex;align-items:center;justify-content:center}

/* ── 업체별 오늘 랭킹 ── */
.rank-tabs{display:flex;gap:4px;margin-bottom:10px}
.rank-tab{font-size:10px;font-weight:700;padding:5px 12px;border-radius:7px;
  cursor:pointer;border:1px solid var(--border);color:var(--t3);
  background:none;transition:all .15s;font-family:inherit}
.rank-tab.on{background:rgba(255,77,125,.12);border-color:rgba(255,77,125,.35);color:var(--pink)}
.rank-item{background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:12px;margin-bottom:8px;display:flex;gap:10px;align-items:center}
.rank-num{width:24px;height:24px;border-radius:50%;font-size:11px;font-weight:800;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.rn1{background:#FFD700;color:#000}.rn2{background:#C0C0C0;color:#000}
.rn3{background:#CD7F32;color:#fff}.rnN{background:rgba(255,255,255,.08);color:var(--t3)}
.rank-thumb{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;
  background:rgba(255,255,255,.05)}
.rank-info{flex:1;min-width:0}
.rank-name{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}
.rank-cat{font-size:10px;color:var(--t3);font-weight:500}
.rank-stats{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.rank-stat{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px}
.rs-view{background:rgba(255,143,163,.1);color:#FF8FA3}
.rs-feed{background:rgba(3,199,90,.1);color:var(--green)}
.rs-map {background:rgba(100,149,237,.1);color:var(--blue)}
.rs-zero{color:var(--t4)}
.rank-total{font-size:12px;font-weight:800;color:var(--t2);white-space:nowrap;text-align:right}
.rank-total small{display:block;font-size:9px;color:var(--t4);font-weight:500}

/* ── 투자자 지표 섹션 ── */
.insight-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.insight-card{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px;position:relative;overflow:hidden}
.insight-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.ic-cvr::before  {background:linear-gradient(90deg,#f59e0b,#d97706)}
.ic-growth::before{background:linear-gradient(90deg,#34d399,#059669)}
.ic-pay::before  {background:linear-gradient(90deg,#a78bfa,#7c3aed)}
.ic-daumau::before{background:linear-gradient(90deg,#60a5fa,#2563eb)}
.insight-icon{font-size:16px;margin-bottom:5px}
.insight-val{font-size:22px;font-weight:800;line-height:1;margin-bottom:3px}
.ic-cvr   .insight-val{color:#f59e0b}
.ic-growth .insight-val{color:#34d399}
.ic-pay   .insight-val{color:#a78bfa}
.ic-daumau .insight-val{color:#60a5fa}
.insight-lbl{font-size:10px;color:var(--t3);font-weight:600;margin-bottom:6px}
.insight-sub{font-size:9px;color:var(--t4);font-weight:500;line-height:1.5}
.insight-sub b{font-weight:700}
/* 전환율 게이지 바 */
.cvr-gauge{margin-top:8px;height:4px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
.cvr-gauge-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#f59e0b,#d97706);transition:width .6s}
/* 업체별 인사이트 리스트 */
.shop-insight-list{margin-bottom:8px}
.si-card{background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:11px 13px;margin-bottom:6px;display:flex;align-items:center;gap:10px}
.si-rank{font-size:11px;font-weight:800;width:20px;flex-shrink:0;text-align:center}
.si-name{flex:1;font-size:12px;font-weight:700;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.si-cat{font-size:10px;color:var(--t3);font-weight:500;white-space:nowrap}
.si-right{text-align:right;flex-shrink:0}
.si-cvr{font-size:13px;font-weight:800}
.si-cvr.hi{color:#34d399}.si-cvr.mid{color:#f59e0b}.si-cvr.lo{color:#f87171}
.si-sub{font-size:9px;color:var(--t4);margin-top:1px}
.si-alert{font-size:9px;font-weight:700;padding:2px 7px;border-radius:5px;
  background:rgba(248,113,113,.12);color:#f87171;border:1px solid rgba(248,113,113,.2);
  white-space:nowrap}
/* 수익화 퍼널 */
.funnel-bar{background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:14px;margin-bottom:8px}
.funnel-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.funnel-row:last-child{margin-bottom:0}
.funnel-label{font-size:11px;font-weight:600;color:var(--t3);width:60px;flex-shrink:0}
.funnel-track{flex:1;height:10px;background:rgba(255,255,255,.05);border-radius:10px;overflow:hidden}
.funnel-fill{height:100%;border-radius:10px;transition:width .6s}
.f-visit{background:linear-gradient(90deg,#c4b5fd,#7c3aed)}
.f-view {background:linear-gradient(90deg,#FFB6C8,#FF4D7D)}
.f-feed {background:linear-gradient(90deg,#6ee7b7,#03C75A)}
.f-map  {background:linear-gradient(90deg,#93c5fd,#6495ed)}
.funnel-num{font-size:11px;font-weight:800;color:var(--t2);width:46px;text-align:right;flex-shrink:0}
.funnel-pct{font-size:9px;color:var(--t4);width:34px;text-align:right;flex-shrink:0}

/* ── 업체 관리 카드 ── */
.shop-card{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:14px;margin-bottom:10px}
.sc-top{display:flex;gap:10px;align-items:flex-start}
.sc-thumb{width:58px;height:58px;border-radius:10px;object-fit:cover;flex-shrink:0;
  background:rgba(255,255,255,.05)}
.sc-info{flex:1;min-width:0}
.sc-name{font-size:14px;font-weight:700;display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.sc-cat{font-size:11px;color:var(--pink);font-weight:600;margin-top:3px}
.sc-addr{font-size:10px;color:var(--t3);margin-top:2px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc-mode{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;
  padding:2px 7px;border-radius:6px;margin-top:4px}
.mode-both{background:rgba(3,199,90,.1);color:var(--green)}
.mode-feed{background:rgba(255,77,125,.1);color:var(--pink)}
.mode-map{background:rgba(100,149,237,.12);color:var(--blue)}
.sc-mid{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;
  padding-top:10px;border-top:1px solid var(--border)}
.badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px}
.b-feat{background:rgba(255,77,125,.13);color:var(--pink)}
.b-hide{background:rgba(255,255,255,.06);color:var(--t3)}
.b-plan-shoot{background:rgba(3,199,90,.13);color:var(--green);border:1px solid rgba(3,199,90,.25)}
.b-plan-basic{background:rgba(255,77,125,.1);color:var(--pink);border:1px solid rgba(255,77,125,.2)}
.b-paid{background:rgba(3,199,90,.12);color:var(--green)}
.b-unpaid{background:rgba(255,165,0,.12);color:#FFA500}
.b-expired{background:rgba(255,77,125,.12);color:var(--pink)}
.b-free{background:rgba(100,149,237,.12);color:var(--blue)}
.sc-nums{display:flex;flex-direction:column;gap:6px;
  margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
/* 클릭 주요 지표 (피드+지도) */
.sc-click-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.sc-num{background:rgba(255,255,255,.03);border:1px solid var(--border);
  border-radius:8px;padding:8px 6px;text-align:center}
.sc-num.main{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.15)}
.sn-v{font-size:18px;font-weight:800}
.sn-v.sub{font-size:12px;font-weight:700;color:var(--t3)}
.sn-l{font-size:9px;color:var(--t3);margin-top:2px;font-weight:600}
.sn-l.main-lbl{font-size:10px;font-weight:700}
.c-view .sn-v{color:#94a3b8}
.c-feed .sn-v{color:var(--green)}
.c-map  .sn-v{color:var(--blue)}
/* 클릭 합계 강조 */
.sc-total-click{display:flex;align-items:center;justify-content:space-between;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
  border-radius:8px;padding:7px 10px}
.stc-val{font-size:16px;font-weight:900;color:#fff}
.stc-lbl{font-size:10px;color:var(--t3);font-weight:600}
/* 출처별 영상조회 분석 칩 */
.sc-view-src{margin-top:6px;padding:7px 10px;background:rgba(167,139,250,.06);
  border:1px solid rgba(167,139,250,.18);border-radius:8px}
.vsrc-title{font-size:9px;color:#a78bfa;font-weight:700;margin-bottom:5px;letter-spacing:.4px}
.vsrc-row{display:flex;gap:5px;flex-wrap:wrap}
.vsrc-chip{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap}
.vsrc-feed{background:rgba(16,185,129,.12);color:#10B981;border:1px solid rgba(16,185,129,.25)}
.vsrc-cat{background:rgba(245,158,11,.12);color:#f59e0b;border:1px solid rgba(245,158,11,.25)}
.vsrc-map{background:rgba(99,102,241,.12);color:#818cf8;border:1px solid rgba(99,102,241,.25)}
/* 출처별 전환율 */
.sc-cvr-wrap{margin-top:6px;padding:8px 10px;background:rgba(56,189,248,.05);
  border:1px solid rgba(56,189,248,.15);border-radius:8px}
.sc-cvr-title{font-size:9px;color:#38bdf8;font-weight:700;margin-bottom:7px;letter-spacing:.4px}
.sc-cvr-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.sc-cvr-item{text-align:center}
.sc-cvr-src{font-size:9px;color:var(--t3);font-weight:600;margin-bottom:2px}
.sc-cvr-val{font-size:15px;font-weight:900}
.sc-cvr-sub{font-size:9px;color:var(--t3);margin-top:1px}
.sc-btns{display:flex;gap:6px;margin-top:10px}
.btn-edit{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
  color:var(--t1);border-radius:8px;padding:8px 0;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-pay-edit{background:rgba(3,199,90,.1);border:1px solid rgba(3,199,90,.22);
  color:var(--green);border-radius:8px;padding:8px 0;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-report{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.25);
  color:#a78bfa;border-radius:8px;padding:8px 0;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-del{background:rgba(255,77,125,.08);border:1px solid rgba(255,77,125,.18);
  color:var(--pink);border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit}
.btn-rec{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);
  color:#fbbf24;border-radius:8px;padding:8px 10px;font-size:12px;font-weight:700;
  cursor:pointer;font-family:inherit;flex:1}
.btn-rec-on{background:rgba(251,191,36,.18);border-color:rgba(251,191,36,.5);color:#f59e0b}

/* ── 구독관리 ── */
.pay-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:14px}
.pay-sv{background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:10px 8px;text-align:center}
.pay-sv-n{font-size:20px;font-weight:800}
.pay-sv-l{font-size:9px;color:var(--t3);margin-top:3px;font-weight:600}
.pay-filter{display:flex;gap:5px;margin-bottom:12px;flex-wrap:wrap}
.pf-btn{background:rgba(255,255,255,.05);border:1px solid var(--border);
  color:var(--t3);border-radius:8px;padding:5px 11px;font-size:11px;
  font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.pf-btn.on{background:rgba(255,77,125,.13);border-color:rgba(255,77,125,.3);color:var(--pink)}
.pay-card{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:14px;margin-bottom:10px}
.pay-card.status-expired{border-color:rgba(255,77,125,.3)}
.pay-card.status-unpaid{border-color:rgba(255,165,0,.25)}
.pay-card.status-paid{border-color:rgba(3,199,90,.2)}
.pay-card.status-free{border-color:rgba(100,149,237,.25)}
.pay-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.pay-thumb{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;background:rgba(255,255,255,.05)}
.pay-info{flex:1;min-width:0}
.pay-name{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pay-sub{font-size:11px;color:var(--t3);margin-top:2px}
.pay-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}
.pay-body{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.pay-kv{font-size:10px;color:var(--t3);background:rgba(255,255,255,.03);border-radius:8px;padding:7px 10px}
.pay-kv strong{display:block;font-size:12px;color:var(--t1);font-weight:700;margin-top:2px}
.pay-memo{font-size:11px;color:var(--t3);background:rgba(255,255,255,.03);
  border-radius:8px;padding:8px 10px;margin-bottom:10px;line-height:1.5;
  display:flex;gap:6px;align-items:flex-start}
.pay-btns{display:flex;gap:6px}

/* ── 입점문의 ── */
.inq-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px}
.inq-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.inq-name{font-size:14px;font-weight:700}
.inq-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;background:rgba(255,77,125,.1);color:var(--pink)}
.inq-time{font-size:10px;color:var(--t3);margin-left:auto}
.inq-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:5px}
.inq-kv{font-size:11px;color:var(--t3)}
.inq-kv strong{color:var(--t2);font-weight:600}
.inq-msg{font-size:12px;color:var(--t3);line-height:1.6;border-top:1px solid var(--border);margin-top:8px;padding-top:8px}

/* ── 빈 상태 ── */
.empty{text-align:center;padding:44px 16px;color:var(--t3);font-size:13px}

/* ── 모달 ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:200;
  display:flex;align-items:flex-end;justify-content:center}
.modal-bg.hidden{display:none}
.modal{background:#1b1b1b;border-radius:22px 22px 0 0;width:100%;max-width:640px;
  max-height:92vh;overflow-y:auto;padding:18px 16px 48px}
.modal-handle{width:36px;height:4px;background:rgba(255,255,255,.08);border-radius:4px;margin:0 auto 16px}
.modal-ttl{font-size:18px;font-weight:800;margin-bottom:16px}
.field{margin-bottom:12px}
.field label{display:block;font-size:11px;font-weight:700;color:var(--t3);margin-bottom:5px;letter-spacing:.3px}
.field input,.field select,.field textarea{
  width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);
  border-radius:10px;padding:10px 12px;color:var(--t1);font-size:14px;
  font-family:inherit;outline:none;transition:border-color .2s}
.field input:focus,.field textarea:focus{border-color:var(--pink)}
.field select option{background:#1b1b1b}
.field textarea{resize:vertical;min-height:70px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal-actions{display:flex;gap:10px;margin-top:18px}
.btn-save{flex:1;background:var(--pink);color:#fff;border:none;border-radius:12px;
  padding:14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}
.btn-cancel{background:rgba(255,255,255,.06);color:var(--t2);
  border:1.5px solid rgba(255,255,255,.09);border-radius:12px;
  padding:14px 18px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.thumb-wrap{display:flex;gap:10px;align-items:flex-start}
.thumb-preview{width:70px;height:70px;border-radius:10px;object-fit:cover;
  background:rgba(255,255,255,.05);border:1.5px solid var(--border);flex-shrink:0}
.thumb-right{flex:1;display:flex;flex-direction:column;gap:6px}
.upload-btn{background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);
  color:var(--t1);border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;text-align:center}
.thumb-url-inp{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);
  border-radius:8px;padding:8px 10px;color:var(--t1);font-size:12px;font-family:inherit;outline:none}
.thumb-url-inp::placeholder{color:var(--t3)}
.yt-preview{margin-top:6px;border-radius:10px;overflow:hidden;background:#000;aspect-ratio:16/9;display:none}
.yt-preview iframe{width:100%;height:100%;border:none}
.geo-row{display:flex;gap:8px}
.geo-btn{flex-shrink:0;background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:0 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;
  height:42px;display:flex;align-items:center;gap:5px;white-space:nowrap}
.geo-status{margin-top:6px;font-size:11px;display:none}
.mode-select{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mode-opt{border:1.5px solid var(--border);border-radius:10px;padding:10px 6px;
  text-align:center;cursor:pointer;transition:all .2s;font-size:11px;font-weight:700;color:var(--t3)}
.mode-opt .mo-icon{font-size:20px;margin-bottom:4px}
.mode-opt.sel-both{border-color:var(--green);background:rgba(3,199,90,.07);color:var(--green)}
.mode-opt.sel-feed{border-color:var(--pink);background:rgba(255,77,125,.07);color:var(--pink)}
.mode-opt.sel-map{border-color:var(--blue);background:rgba(100,149,237,.07);color:var(--blue)}

/* ── 결제 모달 ── */
.pay-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:300;
  display:flex;align-items:flex-end;justify-content:center}
.pay-modal-bg.hidden{display:none}
.pay-modal{background:#1b1b1b;border-radius:22px 22px 0 0;width:100%;max-width:640px;
  max-height:88vh;overflow-y:auto;padding:20px 16px 48px}
.pm-handle{width:36px;height:4px;background:rgba(255,255,255,.08);border-radius:4px;margin:0 auto 18px}
.pm-ttl{font-size:18px;font-weight:800;margin-bottom:5px}
.pm-sub{font-size:12px;color:var(--t3);margin-bottom:20px}
.pm-plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.pm-plan-opt{border:2px solid var(--border);border-radius:12px;padding:14px 10px;text-align:center;cursor:pointer;transition:all .2s}
.pm-plan-opt .po-icon{font-size:24px;margin-bottom:6px}
.pm-plan-opt .po-name{font-size:13px;font-weight:800;margin-bottom:3px}
.pm-plan-opt .po-price{font-size:11px;color:var(--t3)}
.pm-plan-opt.sel-shoot{border-color:var(--green);background:rgba(3,199,90,.08)}
.pm-plan-opt.sel-shoot .po-name{color:var(--green)}
.pm-plan-opt.sel-basic{border-color:var(--pink);background:rgba(255,77,125,.08)}
.pm-plan-opt.sel-basic .po-name{color:var(--pink)}
.pm-status-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:16px}
.pm-status-opt{border:1.5px solid var(--border);border-radius:10px;padding:10px 4px;
  text-align:center;cursor:pointer;font-size:11px;font-weight:700;color:var(--t3);transition:all .2s}
.pm-status-opt.sel-paid{border-color:var(--green);background:rgba(3,199,90,.08);color:var(--green)}
.pm-status-opt.sel-free{border-color:var(--blue);background:rgba(100,149,237,.08);color:var(--blue)}
.pm-status-opt.sel-unpaid{border-color:#FFA500;background:rgba(255,165,0,.08);color:#FFA500}
.pm-status-opt.sel-expired{border-color:var(--pink);background:rgba(255,77,125,.08);color:var(--pink)}
</style>
</head>
<body>

<!-- 상단바 -->
<div class="top">
  <a class="back" href="/"><i class="fas fa-arrow-left"></i></a>
  <span class="ttl">마이뷰티맵 관리자</span>
  <button class="add-btn" onclick="openModal()"><i class="fas fa-plus"></i> 업체 추가</button>
</div>

<!-- 탭바 -->
<div class="tabbar">
  <button class="tabbtn on" id="tab-stats" onclick="switchTab('stats')">
    <i class="fas fa-chart-line"></i>통계
  </button>
  <button class="tabbtn" id="tab-ranking" onclick="switchTab('ranking')">
    <i class="fas fa-trophy"></i>업체순위
  </button>
  <button class="tabbtn" id="tab-shops" onclick="switchTab('shops')">
    <i class="fas fa-store"></i>업체
  </button>
  <button class="tabbtn" id="tab-shorts-admin" onclick="switchTab('shorts-admin')">
    <i class="fas fa-bolt" style="font-size:11px"></i>숏폼
  </button>
  <button class="tabbtn" id="tab-inq" onclick="switchTab('inq')">
    <i class="fas fa-envelope"></i>문의
  </button>
  <button class="tabbtn" id="tab-pay" onclick="switchTab('pay')">
    <i class="fas fa-credit-card"></i>구독
  </button>
</div>

<!-- 콘텐츠 -->
<div class="wrap">
  <div id="panel-stats"></div>
  <div id="panel-ranking"     style="display:none"></div>
  <div id="panel-visitors"    style="display:none"></div>
  <div id="panel-shops"       style="display:none"></div>
  <div id="panel-shorts-admin" style="display:none"></div>
  <div id="panel-inq"         style="display:none"></div>
  <div id="panel-pay"         style="display:none"></div>
  <div id="panel-cal"         style="display:none"></div>
</div>

<!-- 업체 추가/수정 모달 -->
<div class="modal-bg hidden" id="modalBg" onclick="bgClick(event)">
<div class="modal" id="modal">
  <div class="modal-handle"></div>
  <div class="modal-ttl" id="modalTtl">업체 추가</div>
  <div class="field">
    <label>📡 노출 방식</label>
    <div class="mode-select">
      <div class="mode-opt sel-both" id="mo-both" onclick="setMode('both')"><div class="mo-icon">🎬🗺️</div>영상+지도</div>
      <div class="mode-opt" id="mo-feed" onclick="setMode('feed')"><div class="mo-icon">🎬</div>영상만</div>
      <div class="mode-opt" id="mo-map"  onclick="setMode('map')"><div class="mo-icon">🗺️</div>지도만</div>
    </div>
    <input type="hidden" id="f-mode" value="both"/>
  </div>
  <div class="field"><label>업체명 *</label><input id="f-name" type="text" placeholder="예: 밸런스 엘 스트레칭"/></div>
  <div class="row2">
    <div class="field"><label>카테고리 *</label>
      <select id="f-cat">
        <option>마사지</option><option>헤드스파</option><option>피부관리</option>
        <option>헤어</option><option>메이크업</option><option>왁싱</option>
        <option>반영구</option><option>병원</option><option>그외</option>
      </select>
    </div>
    <div class="field"><label>가격대</label><input id="f-price" type="text" placeholder="예: 5만원~"/></div>
  </div>
  <div class="field">
    <label>🖼️ 썸네일 이미지</label>
    <div class="thumb-wrap">
      <img id="thumbPreview" class="thumb-preview"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E"/>
      <div class="thumb-right">
        <label class="upload-btn" for="thumbFile"><i class="fas fa-upload"></i> 파일 선택</label>
        <input type="file" id="thumbFile" accept="image/*" style="display:none" onchange="handleThumbFile(event)"/>
        <input class="thumb-url-inp" id="f-thumb" type="text" placeholder="또는 이미지 URL" oninput="updateThumbPreview(this.value)"/>
      </div>
    </div>
  </div>
  <div class="field" id="ytField">
    <label>🎬 유튜브 URL (또는 영상 ID)</label>
    <input id="f-yt" type="text" placeholder="https://youtu.be/xxxxx" oninput="previewYt(this.value)"/>
    <div class="yt-preview" id="ytPreview"><iframe id="ytFrame" src="" allow="autoplay;encrypted-media" allowfullscreen></iframe></div>
  </div>
  <div class="field" id="addrField">
    <label>📍 주소 *</label>
    <div class="geo-row">
      <input id="f-addr" type="text" placeholder="예: 서울 강남구 논현로 123" style="flex:1"
        onkeydown="if(event.key==='Enter'){event.preventDefault();geocodeAddr()}"/>
      <button class="geo-btn" onclick="geocodeAddr()" id="geoBtn"><i class="fas fa-crosshairs"></i> 좌표찾기</button>
    </div>
    <div class="geo-status" id="geoStatus"></div>
  </div>
  <div class="row2" id="distRow">
    <div class="field"><label>구/지역 <small style="color:var(--t4)">(자동)</small></label><input id="f-dist" type="text" placeholder="강남구"/></div>
    <div class="field"><label>전화번호</label><input id="f-phone" type="text" placeholder="02-1234-5678"/></div>
  </div>
  <div class="row2" id="latRow">
    <div class="field"><label>위도 <small style="color:var(--t4)">(자동)</small></label><input id="f-lat" type="number" step="0.000001" placeholder="자동입력"/></div>
    <div class="field"><label>경도 <small style="color:var(--t4)">(자동)</small></label><input id="f-lng" type="number" step="0.000001" placeholder="자동입력"/></div>
  </div>
  <div class="field"><label>📅 네이버 예약 URL</label><input id="f-url" type="text" placeholder="https://naver.me/xxxxx"/></div>
  <div class="field"><label>태그 (쉼표로 구분)</label><input id="f-tags" type="text" placeholder="리프팅, 보습, 트러블케어"/></div>
  <div class="field"><label>업체 소개</label><textarea id="f-desc" placeholder="업체 간단 소개"></textarea></div>
  <div class="row2">
    <div class="field"><label>상단 노출</label>
      <select id="f-feat"><option value="false">일반</option><option value="true">⭐ 추천 상단</option></select>
    </div>
    <div class="field"><label>공개 여부</label>
      <select id="f-active"><option value="true">공개</option><option value="false">비공개</option></select>
    </div>
  </div>
  <!-- ⭐ 추천탭 토글 -->
  <div class="field" style="margin-bottom:18px">
    <label>⭐ 추천탭 노출</label>
    <div id="rec-toggle-wrap" onclick="toggleRecInModal()" style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:2px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);transition:all .25s" id="recToggleWrap">
      <div id="rec-toggle-track" style="width:44px;height:24px;border-radius:12px;background:#374151;position:relative;transition:background .25s;flex-shrink:0">
        <div id="rec-toggle-thumb" style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .25s"></div>
      </div>
      <div>
        <div id="rec-toggle-label" style="font-size:13px;font-weight:700;color:#94a3b8">추천탭 미노출</div>
        <div style="font-size:11px;color:#475569;margin-top:1px">⭐추천 탭에 이 업체를 노출합니다</div>
      </div>
    </div>
    <input type="hidden" id="f-rec" value="false"/>
  </div>
  <div class="modal-actions">
    <button class="btn-cancel" onclick="closeModal()">취소</button>
    <button class="btn-save" onclick="saveShop()"><i class="fas fa-save"></i> 저장하기</button>
  </div>
</div>
</div>

<!-- 결제 수정 모달 -->
<div class="pay-modal-bg hidden" id="payModalBg" onclick="if(event.target===this)closePayModal()">
<div class="pay-modal" id="payModal">
  <div class="pm-handle"></div>
  <div class="pm-ttl">💳 구독 관리</div>
  <div class="pm-sub" id="pmShopName">업체명</div>
  <div class="field"><label>📦 플랜</label></div>
  <div class="pm-plan-grid">
    <div class="pm-plan-opt sel-shoot" id="pm-plan-shoot" onclick="setPmPlan('shoot')">
      <div class="po-icon">🎬</div><div class="po-name">촬영 플랜</div>
      <div class="po-price">촬영비 3만원 · 6개월 무료<br>이후 월 10,000원</div>
    </div>
    <div class="pm-plan-opt" id="pm-plan-basic" onclick="setPmPlan('basic')">
      <div class="po-icon">📍</div><div class="po-name">기본 플랜</div>
      <div class="po-price">영상 없이 맵만<br>월 10,000원</div>
    </div>
  </div>
  <div class="field"><label>📊 결제 상태</label></div>
  <div class="pm-status-grid">
    <div class="pm-status-opt" id="pm-st-paid"    onclick="setPmStatus('paid')">✅<br>결제완료</div>
    <div class="pm-status-opt" id="pm-st-free"    onclick="setPmStatus('free')">🎁<br>무료기간</div>
    <div class="pm-status-opt" id="pm-st-unpaid"  onclick="setPmStatus('unpaid')">💳<br>미결제</div>
    <div class="pm-status-opt" id="pm-st-expired" onclick="setPmStatus('expired')">⚠️<br>만료</div>
  </div>
  <div class="field">
    <label>📆 구독 만료일</label>
    <input id="pm-until" type="date" style="width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:14px;font-family:inherit;outline:none"/>
  </div>
  <div style="display:flex;gap:6px;margin-top:-6px;margin-bottom:14px">
    <button onclick="addMonths(1)"  style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+1개월</button>
    <button onclick="addMonths(3)"  style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+3개월</button>
    <button onclick="addMonths(6)"  style="flex:1;background:rgba(3,199,90,.1);border:1px solid rgba(3,199,90,.22);color:var(--green);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+6개월</button>
    <button onclick="addMonths(12)" style="flex:1;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+12개월</button>
  </div>
  <div class="field">
    <label>📝 메모</label>
    <textarea id="pm-memo" placeholder="예) 홍길동 계좌이체 30,000원 24.01.15"
      style="width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-family:inherit;outline:none;resize:vertical;min-height:60px"></textarea>
  </div>
  <div class="modal-actions">
    <button class="btn-cancel" onclick="closePayModal()">취소</button>
    <button class="btn-save" onclick="savePayment()"><i class="fas fa-save"></i> 저장하기</button>
  </div>
</div>
</div>

<script>
// ── 전역 상태
let editId = null, payEditId = null;
let pmPlan = 'shoot', pmStatus = 'unpaid';
let curTab = 'stats';
let shopData = [];
let thumbDataUrl = '';
let _stats = null, _dvRows = [], _chartMode = 'view', _rankMode = 'today', _insightMode = 'top';

// ── 탭 전환
function switchTab(t) {
  curTab = t;
  ['stats','ranking','shops','pay','inq','cal','shorts-admin','visitors'].forEach(x => {
    const tabEl = document.getElementById('tab-'+x);
    const panEl = document.getElementById('panel-'+x);
    if (tabEl) tabEl.classList.toggle('on', x===t);
    if (panEl) panEl.style.display = x===t ? 'block' : 'none';
  });
  document.querySelector('.add-btn').style.display = t==='shops' ? 'flex' : 'none';
  if (t==='stats')        loadStats();
  if (t==='ranking')      loadRanking();
  if (t==='shops')        renderShops(shopData);
  if (t==='inq')          loadInquiries();
  if (t==='pay')          renderPayTab();
  if (t==='cal')          renderCalendar();
  if (t==='shorts-admin') loadShortsAdmin();
}

// ── 토스트
let _toastTmr;
function toast(msg) {
  let el = document.getElementById('_toast');
  if (!el) {
    el = document.createElement('div'); el.id = '_toast';
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:700;z-index:9999;transition:opacity .3s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.5)';
    document.body.appendChild(el);
  }
  el.textContent = msg; el.style.opacity = '1';
  clearTimeout(_toastTmr);
  _toastTmr = setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

// ══════════════════════════════════════════════════════════════════════════
// ⚡ 관리자 숏폼 관리
// ══════════════════════════════════════════════════════════════════════════
let _shortsAdminItems = [];
let _shortsAdminEditId = null;
let _shortsAdminTab = 'overview'; // overview | items | daily

const CAT_OPTIONS = ['마사지','헤드스파','피부관리','헤어','메이크업','왁싱','반영구','병원','그외'];

async function loadShortsAdmin() {
  const p = document.getElementById('panel-shorts-admin');
  p.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b">불러오는 중...</div>';
  _shortsAdminItems = await fetch('/api/admin/shorts').then(r=>r.json());
  renderShortsAdminShell();
  switchShortsAdminTab(_shortsAdminTab);
}

// ── 외부 껍데기(탭바 + 컨텐츠 영역 + 모달) ──────────────────────────────
function renderShortsAdminShell() {
  const p = document.getElementById('panel-shorts-admin');
  const tabBtn = (key, label, icon) =>
    '<button onclick="switchShortsAdminTab(&quot;'+key+'&quot;)" id="sat-'+key+'" style="flex:1;border:none;border-bottom:2px solid transparent;background:none;color:#64748b;font-size:12px;font-weight:700;padding:10px 4px;cursor:pointer;font-family:inherit;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px"><i class="fas '+icon+'" style="font-size:14px"></i>'+label+'</button>';

  p.innerHTML =
    // 탭 헤더
    '<div style="position:sticky;top:0;z-index:10;background:#111;border-bottom:1px solid rgba(255,255,255,.08)">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0">' +
        '<div style="font-size:15px;font-weight:800;color:#e879f9">⚡ 숏폼 관리</div>' +
        '<button onclick="openShortsModal(null)" style="background:linear-gradient(135deg,#c026d3,#e879f9);color:#fff;border:none;border-radius:10px;padding:7px 13px;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit">+ 추가</button>' +
      '</div>' +
      '<div style="display:flex;margin-top:8px">' +
        tabBtn('overview','현황요약','fa-chart-pie') +
        tabBtn('items','업체별','fa-list') +
        tabBtn('daily','일별추이','fa-chart-bar') +
      '</div>' +
    '</div>' +
    '<div id="shorts-admin-body" style="padding:14px"></div>' +
    // 모달
    _shortsAdminModalHtml();

  // 파일 onchange는 인라인으로 처리 (innerHTML 교체 시 리스너 유실 방지)
}

function _shortsAdminModalHtml() {
  const inp = adminInputStyle();
  return (
    '<div id="shortsModalBg" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;align-items:flex-end;backdrop-filter:blur(4px)" onclick="if(event.target===this)closeShortsModal()">' +
    '<div id="shortsAdminModal" style="background:#161616;border-radius:24px 24px 0 0;padding:22px 20px 32px;width:100%;max-height:92vh;overflow-y:auto">' +

      // ── 헤더
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">' +
        '<div id="shortsModalTitle" style="font-size:16px;font-weight:900;color:#fff">숏폼 추가</div>' +
        '<button onclick="closeShortsModal()" style="background:rgba(255,255,255,.08);border:none;color:#94a3b8;border-radius:50%;width:30px;height:30px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit">✕</button>' +
      '</div>' +

      // ── STEP 1: 영상
      '<div style="margin-bottom:16px">' +
        '<div style="font-size:11px;font-weight:800;color:#e879f9;letter-spacing:.05em;margin-bottom:8px">STEP 1 · 영상 선택</div>' +
        // 파일 업로드 드롭존
        '<label for="s-vid-file" id="s-vid-label" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;padding:20px 12px;border:2px dashed rgba(232,121,249,.35);border-radius:16px;cursor:pointer;background:rgba(232,121,249,.04);transition:all .2s;box-sizing:border-box">' +
          '<i class="fas fa-cloud-upload-alt" style="font-size:26px;color:#e879f9"></i>' +
          '<span style="font-size:13px;font-weight:700;color:#e879f9">영상 파일 선택</span>' +
          '<span style="font-size:11px;color:#475569">MP4 / MOV</span>' +
        '</label>' +
        '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>' +
        // 선택 후 미리보기 + 업로드 버튼
        // 업로드 진행 상태 (파일 선택 즉시 표시)
        '<div id="s-upload-status" style="display:none;font-size:12px;color:#94a3b8;margin-top:10px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.04);text-align:center"></div>' +
        // 업로드 완료 후 영상 미리보기
        '<div id="s-cl-preview" style="display:none;margin-top:12px">' +
          '<div style="display:flex;align-items:center;gap:10px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.2);border-radius:12px;padding:10px 12px">' +
            '<i class="fas fa-circle-check" style="color:#22c55e;font-size:18px;flex-shrink:0"></i>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-size:11px;font-weight:700;color:#22c55e;margin-bottom:2px">영상 등록됨</div>' +
              '<div id="s-cl-id-label" style="font-size:10px;color:#475569;word-break:break-all"></div>' +
            '</div>' +
            '<video id="s-cl-vid" style="width:44px;height:78px;border-radius:6px;object-fit:cover;flex-shrink:0" muted playsinline></video>' +
          '</div>' +
          // 숨겨진 실제 ID input (saveShorts에서 읽음)
          '<input id="s-clid" style="display:none"/>' +
        '</div>' +
      '</div>' +

      // ── STEP 2: 네이버 예약링크
      '<div style="margin-bottom:16px">' +
        '<div style="font-size:11px;font-weight:800;color:#e879f9;letter-spacing:.05em;margin-bottom:8px">STEP 2 · 네이버 예약링크</div>' +
        '<input id="s-place" placeholder="https://naver.me/xxxxx  또는  스마트플레이스 URL" style="'+inp+'" oninput="autoFetchNaverInfo(this.value)"/>' +
        // 자동 추출 상태
        '<div id="s-naver-status" style="display:none;font-size:11px;margin-top:6px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,.04)"></div>' +
      '</div>' +

      // ── 추가 정보 (접기 가능)
      '<details id="s-extra-details" style="border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:12px 14px;margin-bottom:16px">' +
        '<summary style="font-size:12px;font-weight:700;color:#64748b;cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between">' +
          '<span><i class="fas fa-sliders" style="margin-right:6px;opacity:.6"></i>추가 정보 (선택)</span>' +
          '<i class="fas fa-chevron-down" style="font-size:10px;opacity:.4"></i>' +
        '</summary>' +
        '<div style="display:flex;flex-direction:column;gap:12px;margin-top:14px">' +
          // 업체명
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">업체명</label>' +
            '<input id="s-name" placeholder="자동 입력 또는 직접 입력" style="'+inp+'"/>' +
          '</div>' +
          // 카테고리
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">카테고리</label>' +
            '<select id="s-cat" style="'+inp+'background:#1b1b1b;color:#fff;appearance:auto"><option value="" style="background:#1b1b1b;color:#fff">선택 안함</option></select>' +
          '</div>' +
          // 주소
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">주소</label>' +
            '<input id="s-addr" placeholder="자동 입력 또는 직접 입력" style="'+inp+'"/>' +
          '</div>' +
          // 유튜브 fallback
          '<div>' +
            '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">유튜브 링크 (Cloudinary 없을 때 대체)</label>' +
            '<input id="s-ytid" placeholder="https://youtube.com/shorts/xxxxx" style="'+inp+'"/>' +
          '</div>' +
          // 순서 + 노출
          '<div style="display:flex;gap:10px;align-items:center">' +
            '<div style="flex:1">' +
              '<label style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:5px">정렬 순서</label>' +
              '<input id="s-order" type="number" value="0" style="'+inp+'"/>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding-top:16px">' +
              '<label style="font-size:11px;color:#64748b;font-weight:700">노출</label>' +
              '<input id="s-active" type="checkbox" checked style="width:22px;height:22px;cursor:pointer;accent-color:#c026d3"/>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</details>' +

      // ── 저장 버튼
      '<button onclick="saveShorts()" style="width:100%;background:linear-gradient(135deg,#c026d3,#e879f9);color:#fff;border:none;border-radius:16px;padding:16px;font-size:15px;font-weight:900;cursor:pointer;font-family:inherit;letter-spacing:.01em">등록하기</button>' +

    '</div>' +
  '</div>'
  );
}

// ── 탭 전환 ──────────────────────────────────────────────────────────────
function switchShortsAdminTab(tab) {
  _shortsAdminTab = tab;
  ['overview','items','daily'].forEach(k => {
    const btn = document.getElementById('sat-'+k);
    if (!btn) return;
    btn.style.color       = k===tab ? '#e879f9' : '#64748b';
    btn.style.borderColor = k===tab ? '#e879f9' : 'transparent';
  });
  const body = document.getElementById('shorts-admin-body');
  if (!body) return;
  body.innerHTML = '<div style="text-align:center;padding:20px;color:#475569">불러오는 중...</div>';
  if (tab==='overview') renderShortsOverview();
  else if (tab==='items') renderShortsItems();
  else if (tab==='daily') renderShortsDaily();
}

// ── 탭1: 현황 요약 ────────────────────────────────────────────────────────
async function renderShortsOverview() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const s = await fetch('/api/admin/shorts/stats/summary').then(r=>r.json());
    if (s.error) throw new Error(s.error);

    const todayVsDiff = s.yest_views > 0 ? Math.round((s.today_views - s.yest_views) / s.yest_views * 100) : null;
    const todaySpDiff = s.yest_sp   > 0 ? Math.round((s.today_sp   - s.yest_sp)   / s.yest_sp   * 100) : null;
    const totalCtr    = s.total_views > 0 ? (s.total_sp / s.total_views * 100).toFixed(1) : '0.0';
    const weekCtr     = s.week_views  > 0 ? (s.week_sp  / s.week_views  * 100).toFixed(1) : '0.0';

    const diffBadge = (v) => v===null ? '' :
      '<span style="font-size:10px;padding:1px 6px;border-radius:6px;margin-left:5px;background:'+(v>=0?'rgba(52,211,153,.15)':'rgba(248,113,113,.15)')+';color:'+(v>=0?'#34d399':'#f87171')+'">'+(v>=0?'▲':'▼')+Math.abs(v)+'%</span>';

    const kpiCard = (icon, label, val, sub, color) =>
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;flex:1;min-width:0">' +
        '<div style="font-size:10px;color:#64748b;font-weight:700;margin-bottom:6px"><i class="fas '+icon+'" style="color:'+color+';margin-right:4px"></i>'+label+'</div>' +
        '<div style="font-size:22px;font-weight:900;color:#f1f5f9">'+val+'</div>' +
        '<div style="font-size:10px;color:#475569;margin-top:3px">'+sub+'</div>' +
      '</div>';

    body.innerHTML =
      // KPI 4개
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' +
        kpiCard('fa-eye','오늘 조회',s.today_views.toLocaleString()+'회', '어제 '+s.yest_views.toLocaleString()+'회'+diffBadge(todayVsDiff), '#6366f1') +
        kpiCard('fa-calendar-check','오늘 예약클릭',s.today_sp.toLocaleString()+'회', '어제 '+s.yest_sp.toLocaleString()+'회'+diffBadge(todaySpDiff), '#FF4D7D') +
        kpiCard('fa-chart-line','7일 조회',s.week_views.toLocaleString()+'회', 'CTR '+weekCtr+'%', '#f59e0b') +
        kpiCard('fa-video','총 숏폼',s.total_items+'개', '노출중 '+s.active_items+'개', '#e879f9') +
      '</div>' +
      // 누적 합계 바
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:14px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:10px">📊 누적 전체 실적</div>' +
        '<div style="display:flex;justify-content:space-around;text-align:center">' +
          '<div><div style="font-size:20px;font-weight:900;color:#6366f1">'+s.total_views.toLocaleString()+'</div><div style="font-size:10px;color:#64748b;margin-top:2px">총 조회수</div></div>' +
          '<div style="width:1px;background:rgba(255,255,255,.08)"></div>' +
          '<div><div style="font-size:20px;font-weight:900;color:#FF4D7D">'+s.total_sp.toLocaleString()+'</div><div style="font-size:10px;color:#64748b;margin-top:2px">총 예약클릭</div></div>' +
          '<div style="width:1px;background:rgba(255,255,255,.08)"></div>' +
          '<div><div style="font-size:20px;font-weight:900;color:#f59e0b">'+totalCtr+'%</div><div style="font-size:10px;color:#64748b;margin-top:2px">전체 CTR</div></div>' +
        '</div>' +
      '</div>' +
      // TOP 3
      await _shortsTop3Html();
  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">오류: '+e.message+'</div>';
  }
}

async function _shortsTop3Html() {
  try {
    const items = await fetch('/api/admin/shorts/stats/items').then(r=>r.json());
    if (!items.length) return '';
    const top3 = items.slice(0,3);
    const rows = top3.map((it,i) => {
      const medals = ['🥇','🥈','🥉'];
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<div style="font-size:18px;flex-shrink:0">'+medals[i]+'</div>' +
        '<img src="https://img.youtube.com/vi/'+it.youtube_id+'/mqdefault.jpg" style="width:52px;height:34px;object-fit:cover;border-radius:6px;flex-shrink:0"/>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(it.name||'-')+'</div>' +
          '<div style="font-size:10px;color:#64748b">'+(it.category||'')+'</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-size:12px;font-weight:800;color:#6366f1">'+Number(it.total_views).toLocaleString()+'<span style="font-size:9px;color:#475569">회</span></div>' +
          '<div style="font-size:10px;color:#FF4D7D">CTR '+it.ctr+'%</div>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px">🏆 조회수 TOP 3</div>' +
      rows +
    '</div>';
  } catch(_) { return ''; }
}

// ── 탭2: 업체별 실적 ──────────────────────────────────────────────────────
async function renderShortsItems() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const items = await fetch('/api/admin/shorts/stats/items').then(r=>r.json());
    if (!items.length) {
      body.innerHTML = '<div style="padding:40px;text-align:center;color:#475569">등록된 숏폼이 없습니다</div>';
      return;
    }

    const maxViews = Math.max(...items.map(it=>Number(it.total_views)||0), 1);

    const cards = items.map(item => {
      const pct = Math.round((Number(item.total_views)||0) / maxViews * 100);
      const thumb = item.youtube_id
        ? '<img src="https://img.youtube.com/vi/'+item.youtube_id+'/mqdefault.jpg" style="width:72px;height:46px;object-fit:cover;border-radius:7px;flex-shrink:0"/>'
        : '<div style="width:72px;height:46px;background:rgba(255,255,255,.06);border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center">📭</div>';
      return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;margin-bottom:8px">' +
        '<div style="display:flex;gap:10px;align-items:flex-start">' +
          thumb +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
              '<div style="font-size:13px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+(item.name||'(업체명 없음)')+'</div>' +
              '<span style="font-size:9px;padding:1px 5px;border-radius:5px;flex-shrink:0;background:'+(item.active?'rgba(52,211,153,.15)':'rgba(255,255,255,.06)')+';color:'+(item.active?'#34d399':'#64748b')+'">'+(item.active?'노출':'숨김')+'</span>' +
            '</div>' +
            '<div style="font-size:10px;color:#64748b;margin-bottom:6px">'+(item.category||'')+'</div>' +
            // 조회수 바
            '<div style="background:rgba(255,255,255,.06);border-radius:4px;height:4px;margin-bottom:6px">' +
              '<div style="width:'+pct+'%;height:4px;border-radius:4px;background:linear-gradient(90deg,#6366f1,#a78bfa)"></div>' +
            '</div>' +
            '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#6366f1">'+Number(item.total_views).toLocaleString()+'</div><div style="font-size:9px;color:#475569">전체조회</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#f59e0b">'+Number(item.week_views).toLocaleString()+'</div><div style="font-size:9px;color:#475569">7일조회</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#FF4D7D">'+Number(item.total_sp).toLocaleString()+'</div><div style="font-size:9px;color:#475569">예약클릭</div></div>' +
              '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#34d399">'+item.ctr+'%</div><div style="font-size:9px;color:#475569">CTR</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end">' +
          '<button onclick="showShortsItemDaily('+item.id+',&quot;'+((item.name||'').replace(/"/g,''))+'&quot;)" style="background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit"><i class="fas fa-chart-bar" style="margin-right:3px"></i>일별</button>' +
          '<button onclick="openShortsModal('+item.id+')" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#f1f5f9;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">수정</button>' +
          '<button onclick="delShorts('+item.id+')" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">삭제</button>' +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML = '<div style="font-size:11px;color:#64748b;margin-bottom:10px">총 <b style="color:#e879f9">'+items.length+'</b>개 · 조회수 높은 순</div>' + cards;
  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">오류: '+e.message+'</div>';
  }
}

// 특정 업체 일별 팝업
async function showShortsItemDaily(id, name) {
  const data = await fetch('/api/admin/shorts/stats/item/'+id).then(r=>r.json());
  const body = document.getElementById('shorts-admin-body');

  if (!data.length) {
    alert(name+' - 아직 일별 데이터가 없습니다. (오늘부터 조회수가 쌓이면 표시됩니다)');
    return;
  }

  // 간단한 텍스트 바 차트 오버레이
  const maxV = Math.max(...data.map(d=>Number(d.views)||0), 1);
  const rows = data.slice(-14).map(d => {  // 최근 14일
    const pct = Math.round((Number(d.views)||0) / maxV * 100);
    const dd  = d.date.slice(5);  // MM-DD
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">' +
      '<div style="font-size:10px;color:#64748b;width:32px;flex-shrink:0">'+dd+'</div>' +
      '<div style="flex:1;background:rgba(255,255,255,.06);border-radius:3px;height:18px;position:relative">' +
        '<div style="width:'+pct+'%;height:100%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#a78bfa)"></div>' +
        '<span style="position:absolute;right:6px;top:2px;font-size:10px;color:#f1f5f9;font-weight:700">'+Number(d.views).toLocaleString()+'</span>' +
      '</div>' +
      '<div style="font-size:10px;color:#FF4D7D;width:28px;text-align:right;flex-shrink:0">'+Number(d.sp)+'클</div>' +
    '</div>';
  }).join('');

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:2000;display:flex;align-items:flex-end';
  overlay.innerHTML =
    '<div style="background:#161616;border-radius:20px 20px 0 0;padding:20px;width:100%;max-height:80vh;overflow-y:auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<div style="font-size:14px;font-weight:800;color:#f1f5f9">📊 '+name+' · 최근 14일</div>' +
        '<button id="shorts-daily-close-btn" style="background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;padding:0 4px">✕</button>' +
      '</div>' +
      '<div style="font-size:10px;color:#64748b;margin-bottom:10px;display:flex;gap:14px">' +
        '<span><span style="color:#6366f1">■</span> 조회수</span>' +
        '<span><span style="color:#FF4D7D">■</span> 예약클릭</span>' +
      '</div>' +
      rows +
    '</div>';
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  const closeBtn = overlay.querySelector('#shorts-daily-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
}

// ── 탭3: 일별 추이 ────────────────────────────────────────────────────────
async function renderShortsDaily() {
  const body = document.getElementById('shorts-admin-body');
  try {
    const data = await fetch('/api/admin/shorts/stats/daily').then(r=>r.json());

    if (!data.length) {
      body.innerHTML =
        '<div style="text-align:center;padding:40px 20px;color:#475569">' +
          '<div style="font-size:32px;margin-bottom:10px">📊</div>' +
          '<div style="font-size:13px">아직 일별 데이터가 없습니다</div>' +
          '<div style="font-size:11px;color:#334155;margin-top:6px">숏폼이 조회되면 자동으로 기록됩니다</div>' +
        '</div>';
      return;
    }

    const recent = data.slice(-30);
    const maxV = Math.max(...recent.map(d=>Number(d.views)||0), 1);
    const maxS = Math.max(...recent.map(d=>Number(d.sp)||0), 1);
    const totalV = recent.reduce((s,d)=>s+Number(d.views),0);
    const totalS = recent.reduce((s,d)=>s+Number(d.sp),0);

    // 바 차트 (수평)
    const rows = recent.map(d => {
      const pctV = Math.round((Number(d.views)||0) / maxV * 100);
      const pctS = Math.max(1, Math.round((Number(d.sp)||0) / maxV * 100));
      const dd   = d.date.slice(5);
      return '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
        '<div style="font-size:9px;color:#64748b;width:28px;flex-shrink:0;text-align:right">'+dd+'</div>' +
        '<div style="flex:1;display:flex;flex-direction:column;gap:2px">' +
          '<div style="background:rgba(255,255,255,.06);border-radius:3px;height:14px;position:relative">' +
            '<div style="width:'+pctV+'%;height:100%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#818cf8)"></div>' +
            (Number(d.views)>0?'<span style="position:absolute;left:'+(pctV>50?'auto':'calc('+pctV+'% + 4px)')+';right:'+(pctV>50?'6px':'auto')+';top:1px;font-size:9px;color:#f1f5f9;font-weight:700">'+Number(d.views).toLocaleString()+'</span>':'') +
          '</div>' +
          (Number(d.sp)>0?
          '<div style="background:rgba(255,255,255,.06);border-radius:3px;height:8px;position:relative">' +
            '<div style="width:'+pctS+'%;height:100%;border-radius:3px;background:#FF4D7D88"></div>' +
          '</div>':'') +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML =
      // 요약 배지
      '<div style="display:flex;gap:8px;margin-bottom:14px">' +
        '<div style="flex:1;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#818cf8">'+totalV.toLocaleString()+'</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">30일 총 조회</div>' +
        '</div>' +
        '<div style="flex:1;background:rgba(255,77,125,.1);border:1px solid rgba(255,77,125,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#FF4D7D">'+totalS.toLocaleString()+'</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">30일 예약클릭</div>' +
        '</div>' +
        '<div style="flex:1;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);border-radius:12px;padding:10px;text-align:center">' +
          '<div style="font-size:16px;font-weight:900;color:#f59e0b">'+(totalV>0?(totalS/totalV*100).toFixed(1):'0.0')+'%</div>' +
          '<div style="font-size:10px;color:#475569;margin-top:2px">평균 CTR</div>' +
        '</div>' +
      '</div>' +
      // 범례
      '<div style="font-size:10px;color:#64748b;margin-bottom:8px;display:flex;gap:12px">' +
        '<span><span style="color:#818cf8">■</span> 조회수 (위)</span>' +
        '<span><span style="color:#FF4D7D">■</span> 예약클릭 (아래)</span>' +
      '</div>' +
      // 차트
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:12px">' +
        rows +
      '</div>';

  } catch(e) {
    body.innerHTML = '<div style="padding:20px;color:#f87171;font-size:12px">오류: '+e.message+'</div>';
  }
}

function renderShortsAdmin() { renderShortsAdminShell(); switchShortsAdminTab(_shortsAdminTab); }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👁️ 방문자 현황 관리자 UI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _visitorsRefreshTimer = null;

async function loadVisitors() {
  const p = document.getElementById('panel-visitors');
  p.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;font-size:13px">불러오는 중...</div>';
  clearInterval(_visitorsRefreshTimer);

  try {
    const [summary, sessions] = await Promise.all([
      fetch('/api/admin/sessions/summary').then(r => r.json()),
      fetch('/api/admin/sessions').then(r => r.json()),
    ]);
    renderVisitors(summary, sessions);

    // 30초마다 자동 새로고침
    _visitorsRefreshTimer = setInterval(async () => {
      if (curTab !== 'visitors') { clearInterval(_visitorsRefreshTimer); return; }
      const [s2, ses2] = await Promise.all([
        fetch('/api/admin/sessions/summary').then(r => r.json()),
        fetch('/api/admin/sessions').then(r => r.json()),
      ]);
      renderVisitors(s2, ses2);
    }, 30000);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">오류: ' + e.message + '</div>';
  }
}

function renderVisitors(s, sessions) {
  const p = document.getElementById('panel-visitors');
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'초'; return Math.floor(sec/60)+'분 '+(sec%60)+'초'; };
  const tabLabel = (t) => ({'shorts':'⚡릴스','feed':'🎬영상','map':'🗺️지도','inquiry':'✉️문의'}[t] || t);

  const total    = sessions.length;
  const nowActive = sessions.filter(x => Date.now() - new Date(x.last_seen).getTime() < 5*60*1000).length;
  const pct = (a,b) => b > 0 ? Math.round(a/b*100) : 0;

  // ── 배지 헬퍼
  const badge = (bg, color, text) =>
    '<span style="background:'+bg+';color:'+color+';padding:2px 6px;border-radius:5px;font-size:9px;font-weight:700">'+text+'</span>';

  const badgeHtml = (sess) => {
    const parts = [];
    if (n(sess.shorts_count) > 0) parts.push(badge('rgba(232,121,249,.15)','#e879f9','⚡'+n(sess.shorts_count)));
    if (n(sess.shorts_book)  > 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','릴스예약'+n(sess.shorts_book)));
    if (n(sess.feed_card_cnt)> 0) parts.push(badge('rgba(99,102,241,.15)','#818cf8','🎬'+n(sess.feed_card_cnt)));
    if (n(sess.feed_book_cnt)> 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','영상예약'+n(sess.feed_book_cnt)));
    if (n(sess.map_pin_cnt)  > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','📍'+n(sess.map_pin_cnt)));
    if (n(sess.map_book_cnt) > 0) parts.push(badge('rgba(255,77,125,.15)','#FF4D7D','지도예약'+n(sess.map_book_cnt)));
    if (n(sess.search_cnt)   > 0) parts.push(badge('rgba(245,158,11,.15)','#fbbf24','🔍'+n(sess.search_cnt)));
    if (n(sess.inquiry_cnt)  > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','✉️'+n(sess.inquiry_cnt)));
    return parts.length ? parts.join(' ') : '<span style="color:#334155;font-size:10px">조용한 방문</span>';
  };

  // ── 세션 카드
  const cards = sessions.map(sess => {
    const isNow  = Date.now() - new Date(sess.last_seen).getTime() < 5*60*1000;
    const entered = new Date(sess.entered_at);
    const timeStr = entered.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    const dateStr = entered.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'});
    const dur    = fmtSec(sess.duration_sec);
    const device = sess.device === 'mobile' ? '📱' : '🖥️';
    const tabs   = (sess.tabs_visited||[]).map(tabLabel).join(' → ') || '진입만';
    const sid    = sess.id;
    const totalActs = n(sess.shorts_count)+n(sess.feed_card_cnt)+n(sess.map_pin_cnt)+n(sess.book_count);
    const hasBook = n(sess.book_count) > 0 || n(sess.shorts_book) > 0 || n(sess.feed_book_cnt) > 0 || n(sess.map_book_cnt) > 0;

    return (
      '<div style="border:1px solid rgba(255,255,255,'+(isNow?'.18':'.06')+');border-radius:14px;margin-bottom:7px;overflow:hidden;background:rgba(255,255,255,.02)'+(hasBook?';border-color:rgba(255,77,125,.3)':'')+(isNow?';box-shadow:0 0 0 1px rgba(52,211,153,.2)':'')+'">' +
        // 카드 헤더 클릭 영역
        '<div onclick="toggleSessTimeline(&quot;'+sid+'&quot;)" style="padding:10px 12px;cursor:pointer">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
            '<div style="display:flex;align-items:center;gap:6px">' +
              '<span style="font-size:13px">'+device+'</span>' +
              '<div>' +
                '<div style="display:flex;align-items:center;gap:4px">' +
                  '<span style="font-size:12px;font-weight:800;color:#f1f5f9">'+timeStr+'</span>' +
                  '<span style="font-size:10px;color:#475569">'+dateStr+'</span>' +
                  (isNow ? '<span style="font-size:9px;background:rgba(52,211,153,.2);color:#34d399;padding:1px 5px;border-radius:4px;font-weight:700;animation:pulse 2s infinite">● 접속중</span>' : '') +
                  (hasBook ? '<span style="font-size:9px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 5px;border-radius:4px;font-weight:700">🎯예약</span>' : '') +
                '</div>' +
                '<div style="font-size:10px;color:#475569;margin-top:1px">'+tabs+'</div>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="font-size:11px;color:#64748b">'+dur+'</div>' +
              '<div style="font-size:10px;color:'+(totalActs>0?'#818cf8':'#334155')+';background:rgba(99,102,241,.08);padding:1px 6px;border-radius:4px;margin-top:2px">'+totalActs+'행동 ▾</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:3px;flex-wrap:wrap">'+badgeHtml(sess)+'</div>' +
        '</div>' +
        // 타임라인 (숨김)
        '<div id="tl-'+sid+'" style="display:none;border-top:1px solid rgba(255,255,255,.06);padding:10px 12px;background:rgba(0,0,0,.25)">' +
          '<div style="font-size:10px;color:#475569">로딩 중...</div>' +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div style="text-align:center;padding:40px;color:#334155;font-size:13px">방문자 데이터가 없습니다</div>';

  p.innerHTML =
    '<div style="padding:14px">' +
      // 헤더
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<div style="font-size:16px;font-weight:900;color:#f1f5f9">👁️ 방문자 목록</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.15);color:#34d399;padding:3px 8px;border-radius:20px;font-weight:700">● 지금 '+nowActive+'명</span>' : '') +
          '<button onclick="loadVisitors()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
        '</div>' +
      '</div>' +
      // 미니 KPI
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">' +
        '<div style="background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#818cf8">'+total+'</div><div style="font-size:9px;color:#64748b">오늘·어제</div></div>' +
        '<div style="background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#34d399">'+nowActive+'</div><div style="font-size:9px;color:#64748b">접속중</div></div>' +
        '<div style="background:rgba(232,121,249,.08);border:1px solid rgba(232,121,249,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#e879f9">'+sessions.filter(x=>Number(x.shorts_count)>0||Number(x.feed_card_cnt)>0).length+'</div><div style="font-size:9px;color:#64748b">콘텐츠시청</div></div>' +
        '<div style="background:rgba(255,77,125,.08);border:1px solid rgba(255,77,125,.15);border-radius:10px;padding:8px;text-align:center"><div style="font-size:16px;font-weight:800;color:#FF4D7D">'+sessions.filter(x=>Number(x.book_count)>0||Number(x.shorts_book)>0||Number(x.feed_book_cnt)>0||Number(x.map_book_cnt)>0).length+'</div><div style="font-size:9px;color:#64748b">예약클릭</div></div>' +
      '</div>' +
      // 안내
      '<div style="font-size:10px;color:#334155;text-align:right;margin-bottom:8px">▾ 카드 클릭 시 업체별 행동 타임라인</div>' +
      cards +
    '</div>';
}
// 세션 타임라인 펼치기/접기
const _tlOpen = {};
async function toggleSessTimeline(sid) {
  const tl = document.getElementById('tl-' + sid);
  if (!tl) return;
  const isOpen = _tlOpen[sid];
  _tlOpen[sid] = !isOpen;
  tl.style.display = isOpen ? 'none' : 'block';
  if (isOpen) return; // 접기는 끝

  // 타임라인 로드
  tl.innerHTML = '<div style="font-size:10px;color:#475569;padding:4px 0">불러오는 중...</div>';
  try {
    const evts = await fetch('/api/admin/sessions/' + sid + '/events').then(r => r.json());
    if (!evts.length) {
      tl.innerHTML = '<div style="font-size:11px;color:#334155;padding:4px 0">기록된 업체 행동이 없습니다</div>';
      return;
    }
    const evtIcon  = {shorts_view:'⚡',shorts_view_end:'⏱️',shorts_book:'🎯 ',feed_card:'🎬',feed_book:'🎯 ',map_pin:'📍',map_book:'🎯 '};
    const evtLabel = {shorts_view:'릴스 시청',shorts_view_end:'릴스 이탈',shorts_book:'릴스 예약클릭',
                      feed_card:'영상 업체 조회',feed_book:'영상 예약클릭',
                      map_pin:'지도 핀 선택',map_book:'지도 예약클릭'};
    const evtColor = {shorts_view:'#e879f9',shorts_view_end:'#a855f7',shorts_book:'#FF4D7D',
                      feed_card:'#818cf8',feed_book:'#FF4D7D',map_pin:'#34d399',map_book:'#FF4D7D'};
    const fmtSec = (s) => { s=Number(s)||0; if(!s) return ''; return s<60?s+'초':Math.floor(s/60)+'분'+(s%60)+'초'; };

    const rows = evts.map((e, i) => {
      const t    = new Date(e.occurred_at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const icon = evtIcon[e.event_type] || '●';
      const lbl  = evtLabel[e.event_type] || e.event_type;
      const col  = evtColor[e.event_type] || '#64748b';
      const isBook = e.event_type.endsWith('_book');
      const secStr = e.viewed_sec > 0 ? ' <span style="color:#64748b;font-size:9px">('+fmtSec(e.viewed_sec)+')</span>' : '';
      return (
        '<div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)">' +
          // 타임라인 선
          '<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">' +
            '<div style="width:20px;height:20px;border-radius:50%;background:'+col+';display:flex;align-items:center;justify-content:center;font-size:9px">'+icon+'</div>' +
            (i < evts.length-1 ? '<div style="width:1px;background:rgba(255,255,255,.08);flex:1;min-height:6px"></div>' : '') +
          '</div>' +
          // 내용
          '<div style="flex:1;padding-bottom:4px">' +
            '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
              '<span style="font-size:10px;font-weight:700;color:'+col+'">'+lbl+'</span>' +
              (isBook ? '<span style="font-size:8px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:0 4px;border-radius:3px">예약</span>' : '') +
              secStr +
            '</div>' +
            (e.shop_name ? '<div style="font-size:11px;color:#f1f5f9;font-weight:600">'+e.shop_name+'</div>' : '') +
            (e.shop_cat  ? '<div style="font-size:10px;color:#475569">'+e.shop_cat+'</div>' : '') +
            '<div style="font-size:9px;color:#334155;margin-top:2px">'+t+'</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    tl.innerHTML = '<div style="font-size:10px;color:#475569;margin-bottom:6px">업체별 행동 기록 ('+evts.length+'건)</div>' + rows;
  } catch(e) {
    tl.innerHTML = '<div style="font-size:10px;color:#f87171">로드 실패: ' + e.message + '</div>';
  }
}

function _kpiCard(icon, label, val, sub, color) {
  return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px">' +
    '<div style="font-size:10px;color:#64748b;font-weight:700;margin-bottom:5px"><i class="fas ' + icon + '" style="color:' + color + ';margin-right:4px"></i>' + label + '</div>' +
    '<div style="font-size:20px;font-weight:900;color:#f1f5f9">' + val + '</div>' +
    '<div style="font-size:10px;color:#475569;margin-top:3px">' + sub + '</div>' +
  '</div>';
}

function _statChip(label, val, color) {
  return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:8px 10px;text-align:center">' +
    '<div style="font-size:9px;color:#64748b;margin-bottom:4px">' + label + '</div>' +
    '<div style="font-size:15px;font-weight:800;color:' + color + '">' + val + '</div>' +
  '</div>';
}

function _funnelBar(label, count, pct, color) {
  return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">' +
    '<div style="font-size:11px;color:#94a3b8;width:60px;flex-shrink:0">' + label + '</div>' +
    '<div style="flex:1;background:rgba(255,255,255,.06);border-radius:4px;height:20px;position:relative">' +
      '<div style="width:' + pct + '%;height:100%;border-radius:4px;background:' + color + ';opacity:.8"></div>' +
      '<span style="position:absolute;left:8px;top:2px;font-size:11px;color:#fff;font-weight:700">' + count + '명</span>' +
    '</div>' +
    '<div style="font-size:11px;color:#64748b;width:32px;text-align:right">' + pct + '%</div>' +
  '</div>';
}

function adminInputStyle() {
  return 'width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;';
}

function openShortsModal(id) {
  _shortsAdminEditId = id;
  const item = id ? _shortsAdminItems.find(x=>x.id===id) : null;

  // 제목
  document.getElementById('shortsModalTitle').textContent = id ? '숏폼 수정' : '숏폼 추가';

  // 기본 필드
  (document.getElementById('s-name')).value = item?.name             || '';
  (document.getElementById('s-addr')).value = item?.address          || '';
  (document.getElementById('s-place')).value = item?.smart_place_url  || '';
  (document.getElementById('s-ytid')).value = item?.youtube_id       || '';
  (document.getElementById('s-order')).value = String(item?.sort_order ?? 0);
  (document.getElementById('s-active')).checked = item ? item.active : true;

  // 카테고리
  const sCat = document.getElementById('s-cat');
  sCat.innerHTML = '<option value="" style="background:#1b1b1b;color:#fff">선택 안함</option>' +
    CAT_OPTIONS.map(c => '<option value="'+c+'" style="background:#1b1b1b;color:#fff"'+(item?.category===c?' selected':'')+'>'+c+'</option>').join('');

  // Cloudinary 영상 상태 초기화
  const clId      = item?.cloudinary_public_id || '';
  const clPreview = document.getElementById('s-cl-preview');
  const clVid     = document.getElementById('s-cl-vid');
  const clIdInp   = document.getElementById('s-clid');
  const naverSt   = document.getElementById('s-naver-status');
  // 업로드 상태 div 항상 초기화 (이전 에러 메시지 제거)
  const uploadSt  = document.getElementById('s-upload-status');
  if (uploadSt) { uploadSt.style.display = 'none'; uploadSt.textContent = ''; }
  // 파일 선택 라벨 초기화
  const vidLabel = document.getElementById('s-vid-label');
  if (vidLabel) vidLabel.innerHTML =
    '<i class="fas fa-cloud-upload-alt" style="font-size:26px;color:#e879f9"></i>' +
    '<span style="font-size:13px;font-weight:700;color:#e879f9">영상 파일 선택</span>' +
    '<span style="font-size:11px;color:#475569">MP4 / MOV</span>' +
    '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';
  if (clId) {
    clIdInp.value = clId;
    clVid.src = 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + clId + '.mp4';
    const lbl = document.getElementById('s-cl-id-label');
    if (lbl) lbl.textContent = clId;
    if (clPreview) clPreview.style.display = 'block';
  } else {
    clIdInp.value = '';
    clVid.src = '';
    if (clPreview) clPreview.style.display = 'none';
  }
  if (naverSt) naverSt.style.display = 'none';

  // 수정 시 추가정보 펼치기
  const details = document.getElementById('s-extra-details');
  if (details) details.open = !!id;

  document.getElementById('shortsModalBg').style.display = 'flex';
}

// 네이버 링크 입력 → 업체명/주소 자동추출 시도
let _naverFetchTimer;
function autoFetchNaverInfo(val) {
  clearTimeout(_naverFetchTimer);
  const st = document.getElementById('s-naver-status');
  if (!val.trim()) { if(st) st.style.display='none'; return; }
  if (st) { st.style.display='block'; st.style.color='#94a3b8'; st.textContent='🔍 업체 정보 조회 중...'; }
  _naverFetchTimer = setTimeout(async () => {
    try {
      const r = await fetch('/api/admin/fetch-naver-info', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: val.trim() })
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || '조회 실패');
      const nameEl = document.getElementById('s-name');
      const addrEl = document.getElementById('s-addr');
      if (d.name  && !nameEl.value) nameEl.value = d.name;
      if (d.address && !addrEl.value) addrEl.value = d.address;
      // 카테고리 자동 매핑
      if (d.category) {
        const sCat = document.getElementById('s-cat');
        const matched = CAT_OPTIONS.find(c => d.category.includes(c));
        if (matched && !sCat.value) sCat.value = matched;
      }
      if (st) { st.style.color='#22c55e'; st.textContent='✅ ' + (d.name||'') + (d.address?' · '+d.address:'') + ' 자동 입력됨'; }
      // 추가정보 자동 펼치기
      const details = document.getElementById('s-extra-details');
      if (details) details.open = true;
    } catch(e) {
      if (st) { st.style.color='#64748b'; st.textContent='직접 입력하세요 (자동추출 불가)'; }
    }
  }, 800);
}

function closeShortsModal() {
  document.getElementById('shortsModalBg').style.display = 'none';
}

// 유튜브 URL → 영상 ID 추출 (정규식 없이 문자열 파싱)
function extractYtId(raw) {
  if (!raw) return '';
  raw = raw.trim();
  // shorts/XXXXXXXXXXX 형태
  var si = raw.indexOf('shorts/');
  if (si !== -1) return raw.slice(si + 7, si + 18);
  // youtu.be/XXXXXXXXXXX 형태
  var bi = raw.indexOf('youtu.be/');
  if (bi !== -1) return raw.slice(bi + 9, bi + 20).split('?')[0];
  // watch?v=XXXXXXXXXXX 형태
  var vi = raw.indexOf('v=');
  if (vi !== -1) return raw.slice(vi + 2, vi + 13).split('&')[0];
  // embed/XXXXXXXXXXX 형태
  var ei = raw.indexOf('embed/');
  if (ei !== -1) return raw.slice(ei + 6, ei + 17).split('?')[0];
  // 11자리 ID만 입력한 경우
  if (raw.length === 11) return raw;
  return '';
}

// Cloudinary 업로드 핸들러
// 파일 선택 즉시 자동 호출 (file 파라미터로 받음)
async function uploadShortsVideo(file) {
  if (!file) return;

  // UI 상태: 업로드 중
  const label  = document.getElementById('s-vid-label');
  const status = document.getElementById('s-upload-status');

  if (label) label.innerHTML =
    '<i class="fas fa-spinner fa-spin" style="font-size:20px;color:#e879f9"></i>' +
    '<span style="font-size:12px;font-weight:700;color:#e879f9">업로드 중...</span>' +
    '<span style="font-size:11px;color:#475569">' + file.name + '</span>' +
    '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';
  if (status) { status.style.display = 'block'; status.style.color = '#94a3b8'; status.textContent = '서버에서 서명 받는 중...'; }

  try {
    // 1) 서버에서 서명만 받기 (파일 전송 없음)
    const signRes = await fetch('/api/admin/cloudinary-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'mybeautymap/shorts' })
    });
    const signJson = await signRes.json();
    if (!signRes.ok || signJson.error) throw new Error(signJson.error || '서명 발급 실패');
    const sign = signJson;

    if (status) status.textContent = 'Cloudinary 업로드 중... (파일 크기에 따라 30초~2분 소요)';

    // 2) 브라우저에서 Cloudinary로 직접 업로드 (multipart)
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sign.apiKey);
    fd.append('timestamp', sign.timestamp);
    fd.append('signature', sign.signature);
    fd.append('folder', sign.folder);
    fd.append('resource_type', 'video');

    const upRes = await fetch('https://api.cloudinary.com/v1_1/' + sign.cloudName + '/video/upload', {
      method: 'POST', body: fd
    });
    const json = await upRes.json();
    if (!upRes.ok || !json.public_id) throw new Error(json.error?.message || '업로드 실패');

    // 3) 성공 UI
    const clIdInp = document.getElementById('s-clid');
    if (clIdInp) clIdInp.value = json.public_id;

    const clPreview = document.getElementById('s-cl-preview');
    const clVid     = document.getElementById('s-cl-vid');
    const lbl       = document.getElementById('s-cl-id-label');
    if (clPreview) clPreview.style.display = 'block';
    if (clVid)     clVid.src = 'https://res.cloudinary.com/dc0ouozcd/video/upload/' + json.public_id + '.mp4';
    if (lbl)       lbl.textContent = json.public_id;
    if (status)    { status.style.color = '#22c55e'; status.textContent = '✅ 업로드 완료!'; }
    if (label) label.innerHTML =
      '<i class="fas fa-circle-check" style="font-size:20px;color:#22c55e"></i>' +
      '<span style="font-size:12px;font-weight:700;color:#22c55e">업로드 완료</span>' +
      '<span style="font-size:11px;color:#475569">' + file.name + '</span>' +
      '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';

    toast('🎬 영상 업로드 완료! 등록하기를 눌러 저장하세요');
  } catch(e) {
    if (status) { status.style.color = '#ef4444'; status.textContent = '❌ ' + e.message; }
    if (label) label.innerHTML =
      '<i class="fas fa-cloud-upload-alt" style="font-size:26px;color:#e879f9"></i>' +
      '<span style="font-size:13px;font-weight:700;color:#e879f9">다시 선택</span>' +
      '<span style="font-size:11px;color:#475569">MP4 / MOV</span>' +
      '<input id="s-vid-file" type="file" accept="video/mp4,video/quicktime,video/*" style="display:none" onchange="if(this.files&&this.files[0])uploadShortsVideo(this.files[0])"/>';
    toast('업로드 실패: ' + e.message);
  }
}

async function saveShorts() {
  const clId  = (document.getElementById('s-clid'))?.value.trim() || '';
  const rawYt = (document.getElementById('s-ytid'))?.value.trim() || '';
  const ytId  = extractYtId(rawYt) || rawYt;
  const place = (document.getElementById('s-place'))?.value.trim() || '';

  // 영상(Cloudinary) 또는 네이버링크 중 하나는 필수
  if (!clId && !ytId && !place) {
    toast('영상을 업로드하거나 네이버 링크를 입력하세요'); return;
  }

  // 업체명: 자동입력 → 네이버링크 있으면 임시명 → 기본값
  let name = (document.getElementById('s-name'))?.value.trim() || '';
  if (!name && place) name = '미등록업체';
  if (!name && clId)  name = '미등록업체';
  if (!name) name = '미등록업체'; // 어떤 경우도 통과

  const body = {
    name,
    category:           (document.getElementById('s-cat'))?.value || '',
    address:            (document.getElementById('s-addr'))?.value.trim() || '',
    smartPlaceUrl:      place,
    cloudinaryPublicId: clId,
    youtubeId:          ytId,
    sortOrder:          parseInt((document.getElementById('s-order'))?.value) || 0,
    active:             (document.getElementById('s-active'))?.checked ?? true,
  };
  const url    = _shortsAdminEditId ? '/api/admin/shorts/'+_shortsAdminEditId : '/api/admin/shorts';
  const method = _shortsAdminEditId ? 'PUT' : 'POST';
  try {
    const r = await fetch(url, {method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    if (r.ok) {
      closeShortsModal();
      toast(_shortsAdminEditId ? '✅ 수정 완료!' : '🎬 숏폼 등록 완료!');
      await loadShortsAdmin();
    } else {
      let errMsg = '저장 실패';
      try { const ej = await r.json(); errMsg = ej.error || ej.message || errMsg; } catch(_) {}
      toast('❌ ' + errMsg);
    }
  } catch(e) {
    toast('❌ 네트워크 오류: ' + e.message);
  }
}

async function delShorts(id) {
  const found = _shortsAdminItems.find(x => x.id === id);
  const name = found ? found.name : '이 숏폼을';
  if (!confirm(name+' 삭제할까요?')) return;
  const r = await fetch('/api/admin/shorts/'+id, {method:'DELETE'});
  if (r.ok) { toast('삭제 완료'); await loadShortsAdmin(); }
  else toast('삭제 실패');
}

// ── 증감 헬퍼
function deltaHtml(today, yest) {
  if (yest===0 && today===0) return '<span class="kpi-delta flat">—</span>';
  if (yest===0 && today>0)   return '<span class="kpi-delta up">▲ NEW</span>';
  const d = today-yest, p = Math.round(Math.abs(d)/yest*100);
  if (d>0) return '<span class="kpi-delta up">▲ +' + d.toLocaleString() + ' (' + p + '%)</span>';
  if (d<0) return '<span class="kpi-delta down">▼ ' + d.toLocaleString() + ' (' + p + '%)</span>';
  return '<span class="kpi-delta flat">— 동일</span>';
}

// ── 데이터 로드
async function loadAll() {
  const [d, dv] = await Promise.all([
    fetch('/api/admin/stats').then(r=>r.json()),
    fetch('/api/admin/daily-visits').then(r=>r.json()),
  ]);
  _stats  = d;
  _dvRows = Array.isArray(dv) ? dv : [];
  shopData = d.stats || [];
  if (curTab==='shops') renderShops(shopData);
  if (curTab==='pay')   renderPayTab();
  if (curTab==='stats') loadStats();
}

// ── 신규: 통계 탭 로드 (방문자 요약 + 일별추이 + 기존stats 병합)
let _visitorSummary = null;
let _dailyTrend = [];
async function loadStats() {
  const p = document.getElementById('panel-stats');
  if (!p) return;
  p.innerHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:13px"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>';
  try {
    const [vs, trend, sessions] = await Promise.all([
      fetch('/api/admin/sessions/summary').then(r=>r.json()),
      fetch('/api/admin/daily-trend').then(r=>r.json()),
      fetch('/api/admin/sessions').then(r=>r.json()),
    ]);
    _visitorSummary = vs;
    _dailyTrend = Array.isArray(trend) ? trend : [];
    _statsSessions = Array.isArray(sessions) ? sessions : [];
    renderStatsTab(vs, _dailyTrend, _statsSessions);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">로드 실패: '+e.message+'</div>';
  }
}
let _statsSessions = [];

// ── 신규: 업체 랭킹 탭 로드
let _rankingData = [];
let _rankingDays = 7;
async function loadRanking(days) {
  if (days) _rankingDays = days;
  const p = document.getElementById('panel-ranking');
  if (!p) return;
  p.innerHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:13px"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>';
  try {
    const data = await fetch('/api/admin/shop-ranking?days='+_rankingDays).then(r=>r.json());
    _rankingData = Array.isArray(data) ? data : [];
    renderRankingTab(_rankingData);
  } catch(e) {
    p.innerHTML = '<div style="padding:20px;color:#f87171">로드 실패: '+e.message+'</div>';
  }
}

// ======================================================
// 통계 탭 렌더링 (KPI + 1인당평균 + 퍼널 + 7일차트 + 세션카드 통합)
// ======================================================
function renderStatsTab(s, trend, sessions) {
  const p = document.getElementById('panel-stats');
  if (!p) return;
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'초'; return Math.floor(sec/60)+'분 '+(sec%60)+'초'; };
  const pct = (a,b) => b>0 ? Math.round(a/b*100) : 0;
  const nowMs = Date.now();

  // ── KPI 4칸
  const total    = n(s.today_total);
  const nowActive = (sessions||[]).filter(x => nowMs - new Date(x.last_seen).getTime() < 5*60*1000).length;
  const kpiSection =
    '<div style="padding:14px 14px 0">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
      '<div style="font-size:16px;font-weight:900;color:#f1f5f9">📊 오늘 통계</div>' +
      '<div style="display:flex;align-items:center;gap:6px">' +
        (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.15);color:#34d399;padding:3px 8px;border-radius:20px;font-weight:700">● 지금 '+nowActive+'명</span>' : '') +
        '<button onclick="loadStats()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
      '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px">' +
      _kpiCard('fa-user-friends','오늘 방문자', n(s.today_total)+'명', '어제 '+n(s.yest_total)+'명 · 7일 '+n(s.week_total)+'명', '#6366f1') +
      _kpiCard('fa-clock','평균 체류시간', fmtSec(n(s.today_avg_sec)), '모바일 '+n(s.today_mobile)+' / PC '+n(s.today_desktop), '#f59e0b') +
      _kpiCard('fa-fire','예약 클릭', n(s.today_booked)+'명', '릴스 '+n(s.sum_shorts_book)+' · 영상 '+n(s.sum_feed_book)+' · 지도 '+n(s.sum_map_book), '#FF4D7D') +
      _kpiCard('fa-mobile-alt','모바일 비율', total>0?Math.round(n(s.today_mobile)/total*100)+'%':'-', '콘텐츠이용 '+n(s.today_watched)+'명', '#e879f9') +
    '</div>' +
    '</div>';

  // ── 1인당 평균 행동량
  const avgSection =
    '<div style="margin:0 14px 10px;background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(168,85,247,.08));border:1px solid rgba(99,102,241,.25);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#a5b4fc;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="fas fa-chart-bar"></i> 1인당 평균 행동량</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">' +
        _avgChip('⚡ 릴스', n(s.avg_shorts).toFixed(1)+'개', n(s.today_watched)+'명 이용', '#e879f9') +
        _avgChip('🎬 영상', n(s.avg_feed_card).toFixed(1)+'개', n(s.used_feed)+'명 이용', '#818cf8') +
        _avgChip('🗺️ 지도', n(s.avg_map_pin).toFixed(1)+'곳', n(s.used_map)+'명 이용', '#34d399') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">' +
        _miniChip('릴스예약', n(s.sum_shorts_book)+'회', '#FF4D7D') +
        _miniChip('영상예약', n(s.sum_feed_book)+'회', '#FF4D7D') +
        _miniChip('지도예약', n(s.sum_map_book)+'회', '#FF4D7D') +
        _miniChip('🔍검색', n(s.sum_search)+'회', '#fbbf24') +
      '</div>' +
    '</div>';

  // ── 전환 퍼널
  const watched = n(s.today_watched) + n(s.used_feed);
  const mapUsed = n(s.used_map);
  const booked  = n(s.today_booked);
  const funnelSection =
    '<div style="margin:0 14px 10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
      '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:10px"><i class="fas fa-filter" style="margin-right:5px"></i>전환 퍼널</div>' +
      _funnelRow('👣 진입', total, 100, '#6366f1', '') +
      _funnelRow('📹 콘텐츠 시청', watched, pct(watched,total), '#e879f9', total>0?'진입의 '+pct(watched,total)+'%':'') +
      _funnelRow('🗺️ 지도 탐색', mapUsed, pct(mapUsed,total), '#34d399', watched>0?'시청의 '+pct(mapUsed,watched)+'%':'') +
      _funnelRow('🔍 검색 사용', n(s.sum_search), pct(n(s.sum_search),total), '#fbbf24', '') +
      _funnelRow('🎯 예약 클릭', booked, pct(booked,total), '#FF4D7D', total>0?'진입의 '+pct(booked,total)+'%':'') +
    '</div>';

  // ── 7일 추이 차트
  const trendSection = _buildTrendChart(trend);

  // ── 방문자 세션 카드 (통합)
  const sessSection = _buildSessionCards(sessions || [], s);

  p.innerHTML = kpiSection + avgSection + funnelSection + trendSection + sessSection;
}

// ── 세션 카드 빌더 (통계 탭 하단 통합용)
function _buildSessionCards(sessions, s) {
  const n = (v) => Number(v) || 0;
  const fmtSec = (sec) => { sec=n(sec); if(sec<=0) return '-'; if(sec<60) return sec+'초'; return Math.floor(sec/60)+'분 '+(sec%60)+'초'; };
  const tabLabel = (t) => ({'shorts':'⚡릴스','feed':'🎬영상','map':'🗺️지도','inquiry':'✉️문의'}[t] || t);
  const nowMs = Date.now();
  const nowActive = sessions.filter(x => nowMs - new Date(x.last_seen).getTime() < 5*60*1000).length;

  const badge = (bg, color, text) =>
    '<span style="background:'+bg+';color:'+color+';padding:2px 5px;border-radius:4px;font-size:9px;font-weight:700">'+text+'</span>';

  const badgeHtml = (sess) => {
    const parts = [];
    if (n(sess.shorts_count)  > 0) parts.push(badge('rgba(232,121,249,.15)','#e879f9','⚡'+n(sess.shorts_count)));
    if (n(sess.shorts_book)   > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','릴스예약'+n(sess.shorts_book)));
    if (n(sess.feed_card_cnt) > 0) parts.push(badge('rgba(99,102,241,.15)','#818cf8','🎬'+n(sess.feed_card_cnt)));
    if (n(sess.feed_book_cnt) > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','영상예약'+n(sess.feed_book_cnt)));
    if (n(sess.map_pin_cnt)   > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','📍'+n(sess.map_pin_cnt)));
    if (n(sess.map_book_cnt)  > 0) parts.push(badge('rgba(255,77,125,.18)','#FF4D7D','지도예약'+n(sess.map_book_cnt)));
    if (n(sess.search_cnt)    > 0) parts.push(badge('rgba(245,158,11,.15)','#fbbf24','🔍'+n(sess.search_cnt)));
    if (n(sess.inquiry_cnt)   > 0) parts.push(badge('rgba(52,211,153,.15)','#34d399','✉️'+n(sess.inquiry_cnt)));
    return parts.length ? parts.join(' ') : '<span style="color:#334155;font-size:9px">조용한 방문</span>';
  };

  const cards = sessions.map(sess => {
    const isNow   = nowMs - new Date(sess.last_seen).getTime() < 5*60*1000;
    const entered = new Date(sess.entered_at);
    const timeStr = entered.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    const dateStr = entered.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'});
    const dur     = fmtSec(sess.duration_sec);
    const device  = sess.device === 'mobile' ? '📱' : '🖥️';
    const tabs    = (sess.tabs_visited||[]).map(tabLabel).join(' → ') || '진입만';
    const sid     = sess.id;
    const totalActs = n(sess.shorts_count)+n(sess.feed_card_cnt)+n(sess.map_pin_cnt)+n(sess.book_count);
    const hasBook   = n(sess.book_count)>0||n(sess.shorts_book)>0||n(sess.feed_book_cnt)>0||n(sess.map_book_cnt)>0;

    return (
      '<div style="border:1px solid rgba(255,255,255,'+(isNow?'.18':hasBook?'.0':'.05')+');border-radius:12px;margin-bottom:6px;overflow:hidden;background:rgba(255,255,255,.02)'+(hasBook?';border-color:rgba(255,77,125,.28)':'')+(isNow?';box-shadow:0 0 0 1px rgba(52,211,153,.2)':'')+'">' +
        '<div onclick="toggleSessTimeline(&quot;'+sid+'&quot;)" style="padding:10px 12px;cursor:pointer">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">' +
            '<div style="display:flex;align-items:center;gap:5px">' +
              '<span style="font-size:12px">'+device+'</span>' +
              '<div>' +
                '<div style="display:flex;align-items:center;gap:4px">' +
                  '<span style="font-size:12px;font-weight:800;color:#f1f5f9">'+timeStr+'</span>' +
                  '<span style="font-size:10px;color:#475569">'+dateStr+'</span>' +
                  (isNow ? '<span style="font-size:9px;background:rgba(52,211,153,.2);color:#34d399;padding:1px 4px;border-radius:3px;font-weight:700">● 접속중</span>' : '') +
                  (hasBook ? '<span style="font-size:9px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 4px;border-radius:3px;font-weight:700">🎯예약</span>' : '') +
                '</div>' +
                '<div style="font-size:9px;color:#475569;margin-top:1px">'+tabs+'</div>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right;flex-shrink:0">' +
              '<div style="font-size:10px;color:#64748b">'+dur+'</div>' +
              '<div style="font-size:9px;color:'+(totalActs>0?'#818cf8':'#2d3748')+';background:rgba(99,102,241,.07);padding:1px 5px;border-radius:3px;margin-top:1px">'+totalActs+'행동 ▾</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:3px;flex-wrap:wrap">'+badgeHtml(sess)+'</div>' +
        '</div>' +
        '<div id="tl-'+sid+'" style="display:none;border-top:1px solid rgba(255,255,255,.06);padding:10px 12px;background:rgba(0,0,0,.2)">' +
          '<div style="font-size:10px;color:#475569">로딩 중...</div>' +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div style="text-align:center;padding:30px;color:#334155;font-size:12px">오늘·어제 방문자 없음</div>';

  return (
    '<div style="margin:0 14px 14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">' +
        '<div style="font-size:12px;font-weight:800;color:#94a3b8">👁️ 방문자 목록 <span style="font-size:10px;font-weight:500;color:#475569">(오늘·어제 최대 200명)</span></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (nowActive > 0 ? '<span style="font-size:10px;background:rgba(52,211,153,.12);color:#34d399;padding:2px 7px;border-radius:10px;font-weight:700">● '+nowActive+'명 접속중</span>' : '') +
          '<span style="font-size:9px;color:#334155">▾클릭 시 타임라인</span>' +
        '</div>' +
      '</div>' +
      cards +
    '</div>'
  );
}

function _avgChip(label, val, sub, color) {
  return '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:10px;text-align:center">' +
    '<div style="font-size:10px;color:#64748b;margin-bottom:4px">'+label+'</div>' +
    '<div style="font-size:20px;font-weight:900;color:'+color+'">'+val+'</div>' +
    '<div style="font-size:9px;color:#475569;margin-top:3px">'+sub+'</div>' +
  '</div>';
}

function _miniChip(label, val, color) {
  return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:6px;text-align:center">' +
    '<div style="font-size:9px;color:#475569;margin-bottom:2px">'+label+'</div>' +
    '<div style="font-size:13px;font-weight:800;color:'+color+'">'+val+'</div>' +
  '</div>';
}

function _funnelRow(label, count, pctVal, color, sub) {
  return '<div style="margin-bottom:8px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">' +
      '<span style="font-size:11px;color:#cbd5e1">'+label+'</span>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        (sub ? '<span style="font-size:9px;color:#475569">'+sub+'</span>' : '') +
        '<span style="font-size:12px;font-weight:700;color:'+color+'">'+count+'명 <span style="font-size:10px;font-weight:500;color:#64748b">'+pctVal+'%</span></span>' +
      '</div>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,.06);border-radius:6px;height:8px;overflow:hidden">' +
      '<div style="width:'+pctVal+'%;height:100%;background:'+color+';border-radius:6px;transition:width .5s"></div>' +
    '</div>' +
  '</div>';
}

function _buildTrendChart(trend) {
  if (!trend || !trend.length) return '<div style="margin:0 14px 10px;padding:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;text-align:center;color:#334155;font-size:12px">7일 추이 데이터 없음</div>';
  const maxVal = Math.max(...trend.map(r => r.total), 1);
  const days = ['일','월','화','수','목','금','토'];
  const bars = trend.map(r => {
    const h = Math.max(4, Math.round(r.total/maxVal*80));
    const d = new Date(r.day);
    const dayLabel = (d.getMonth()+1)+'/'+(d.getDate())+'<br><span style="font-size:8px;color:#475569">'+days[d.getDay()]+'</span>';
    const bookBar = r.total>0 ? Math.round(r.booked/r.total*h) : 0;
    return '<div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:3px">' +
      '<div style="font-size:9px;color:#6366f1;font-weight:700">'+(r.total||0)+'</div>' +
      '<div style="width:100%;max-width:28px;height:80px;display:flex;flex-direction:column;justify-content:flex-end;gap:1px">' +
        '<div style="width:100%;border-radius:4px 4px 0 0;background:rgba(255,77,125,.7);height:'+bookBar+'px"></div>' +
        '<div style="width:100%;border-radius:4px 4px 0 0;background:#6366f1;height:'+(h-bookBar)+'px"></div>' +
      '</div>' +
      '<div style="font-size:9px;color:#64748b;text-align:center;line-height:1.2">'+dayLabel+'</div>' +
    '</div>';
  }).join('');
  const legend =
    '<div style="display:flex;gap:10px;justify-content:flex-end;margin-bottom:6px">' +
      '<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:#6366f1;border-radius:2px"></div><span style="font-size:9px;color:#64748b">방문</span></div>' +
      '<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;background:rgba(255,77,125,.7);border-radius:2px"></div><span style="font-size:9px;color:#64748b">예약클릭</span></div>' +
    '</div>';
  return '<div style="margin:0 14px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px">' +
    '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px"><i class="fas fa-chart-bar" style="margin-right:5px"></i>7일 방문 추이</div>' +
    legend +
    '<div style="display:flex;align-items:flex-end;gap:4px;height:96px">'+bars+'</div>' +
  '</div>';
}

// ======================================================
// 업체 랭킹 탭 렌더링
// ======================================================
function renderRankingTab(data) {
  const p = document.getElementById('panel-ranking');
  if (!p) return;

  const fmtSec = (s) => { s=Number(s)||0; if(!s) return '-'; if(s<60) return s+'초'; return Math.floor(s/60)+'분'+(s%60?+(s%60)+'초':''); };
  const dayBtns =
    '<div style="display:flex;gap:6px;margin-bottom:12px">' +
      [['7일','7'],['30일','30'],['전체','365']].map(([label,d]) =>
        '<button onclick="loadRanking('+d+')" style="flex:1;padding:7px;border:1px solid rgba(255,255,255,'+(String(_rankingDays)===d?'.3':'.08')+');border-radius:8px;background:rgba(255,255,255,'+(String(_rankingDays)===d?'.1':'.03')+');color:'+(String(_rankingDays)===d?'#f1f5f9':'#64748b')+';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">'+label+'</button>'
      ).join('') +
    '</div>';

  if (!data.length) {
    p.innerHTML = '<div style="padding:14px">'+dayBtns+'<div style="padding:40px;text-align:center;color:#334155;font-size:13px">업체 행동 데이터가 없습니다<br><span style="font-size:11px;color:#475569">방문자가 업체를 조회하면 여기에 표시됩니다</span></div></div>';
    return;
  }

  // 상위 3개 하이라이트
  const top3 = data.slice(0,3);
  const medals = ['🥇','🥈','🥉'];
  const top3Html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">' +
    top3.map((shop, i) =>
      '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,'+(i===0?'.2':'.08')+');border-radius:14px;padding:12px;text-align:center'+(i===0?';box-shadow:0 0 0 1px rgba(251,191,36,.2)':'')+'">' +
        '<div style="font-size:18px">'+medals[i]+'</div>' +
        '<div style="font-size:11px;font-weight:800;color:#f1f5f9;margin:4px 0;line-height:1.3">'+shop.shop_name+'</div>' +
        '<div style="font-size:9px;color:#64748b;margin-bottom:5px">'+shop.shop_cat+'</div>' +
        '<div style="font-size:16px;font-weight:900;color:#e879f9">'+shop.view_cnt+'</div>' +
        '<div style="font-size:9px;color:#64748b">총 조회</div>' +
        '<div style="margin-top:5px;font-size:10px;color:#FF4D7D;font-weight:700">'+(shop.book_cnt>0?'🎯 예약'+shop.book_cnt+'회':'')+'</div>' +
      '</div>'
    ).join('') +
  '</div>';

  // 전체 순위 테이블
  const maxView = Math.max(...data.map(r => r.view_cnt), 1);
  const rows = data.map((shop, i) => {
    const convRate = shop.uniq_sessions > 0 ? Math.round(shop.book_cnt/shop.uniq_sessions*100) : 0;
    const barW = Math.round(shop.view_cnt/maxView*100);
    const catColors = {'마사지':'#e879f9','헤드스파':'#818cf8','피부관리':'#34d399','헤어':'#fbbf24','메이크업':'#f87171','왁싱':'#fb923c','반영구':'#a78bfa','병원':'#38bdf8','그외':'#64748b'};
    const catColor = catColors[shop.shop_cat] || '#64748b';
    return '<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)'+(i===data.length-1?';border-bottom:none':'')+'">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">' +
        '<span style="font-size:12px;font-weight:900;color:'+(i<3?'#fbbf24':'#475569');+';width:18px;flex-shrink:0">'+(i+1)+'</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">' +
            '<span style="font-size:12px;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+shop.shop_name+'</span>' +
            '<span style="font-size:9px;background:'+catColor+'22;color:'+catColor+';padding:1px 5px;border-radius:4px;flex-shrink:0">'+shop.shop_cat+'</span>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,.06);border-radius:3px;height:4px;overflow:hidden">' +
            '<div style="width:'+barW+'%;height:100%;background:linear-gradient(90deg,#6366f1,#e879f9);border-radius:3px"></div>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-size:13px;font-weight:800;color:#e879f9">'+shop.view_cnt+'</div>' +
          '<div style="font-size:9px;color:#475569">조회</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;padding-left:26px">' +
        '<span style="font-size:10px;background:rgba(232,121,249,.1);color:#e879f9;padding:1px 6px;border-radius:4px">⚡릴스 '+shop.shorts_cnt+'</span>' +
        '<span style="font-size:10px;background:rgba(99,102,241,.1);color:#818cf8;padding:1px 6px;border-radius:4px">🎬영상 '+shop.feed_cnt+'</span>' +
        '<span style="font-size:10px;background:rgba(52,211,153,.1);color:#34d399;padding:1px 6px;border-radius:4px">📍지도 '+shop.map_cnt+'</span>' +
        (shop.book_cnt>0 ? '<span style="font-size:10px;background:rgba(255,77,125,.15);color:#FF4D7D;padding:1px 6px;border-radius:4px;font-weight:700">🎯예약 '+shop.book_cnt+'회</span>' : '') +
        '<span style="font-size:10px;background:rgba(255,255,255,.05);color:#64748b;padding:1px 6px;border-radius:4px">👥'+shop.uniq_sessions+'명</span>' +
        (shop.total_view_sec>0 ? '<span style="font-size:10px;background:rgba(251,191,36,.1);color:#fbbf24;padding:1px 6px;border-radius:4px">⏱'+fmtSec(shop.total_view_sec)+'</span>' : '') +
        (convRate>0 ? '<span style="font-size:10px;background:rgba(255,77,125,.2);color:#FF4D7D;padding:1px 6px;border-radius:4px;font-weight:800">전환 '+convRate+'%</span>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  p.innerHTML =
    '<div style="padding:14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
        '<div style="font-size:16px;font-weight:900;color:#f1f5f9">🏆 업체 인기 순위</div>' +
        '<button onclick="loadRanking()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit"><i class="fas fa-sync-alt" style="font-size:10px"></i></button>' +
      '</div>' +
      dayBtns +
      (data.length >= 3 ? top3Html : '') +
      '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px">' +
        '<div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:8px">전체 순위 ('+data.length+'개 업체)</div>' +
        rows +
      '</div>' +
    '</div>';
}

// ======================================================
// 대시보드 탭 (기존 유지 — loadAll에서 호출)
// ======================================================
function renderDashboard() {
  const d   = _stats;
  const dv  = _dvRows;
  const p   = document.getElementById('panel-stats');
  if (!d) return;

  const todayStr = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  const yestStr  = new Date(Date.now()+9*60*60*1000-86400000).toISOString().slice(0,10);
  const todayRow = dv.find(r=>r.visit_date===todayStr);
  const yestRow  = dv.find(r=>r.visit_date===yestStr);
  const todayVisit = todayRow ? (parseInt(todayRow.visit_cnt)||0) : 0;
  const yestVisit  = yestRow  ? (parseInt(yestRow.visit_cnt)||0)  : 0;

  const tV  = d.todayViews   ||0, yV  = d.yestViews   ||0;
  const tF  = d.todayFeedSP  ||0, yF  = d.yestFeedSP  ||0;
  const tM  = d.todayMapSP   ||0, yM  = d.yestMapSP   ||0;
  const tR  = d.todayRecView ||0, yR  = d.yestRecView  ||0;
  const todayLabel = new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'});

  // 1) 오늘 KPI
  const kpi =
    '<div class="section-title">📅 오늘 현황 <span style="font-size:10px;font-weight:500;color:var(--t3);margin-left:4px">' + todayLabel + '</span></div>' +
    '<div class="kpi-grid" style="grid-template-columns:repeat(2,1fr)">' +
      '<div class="kpi-card kpi-visit"><div class="kpi-icon">🙋</div><div class="kpi-val">' + todayVisit.toLocaleString() + '</div><div class="kpi-lbl">방문자</div>' + deltaHtml(todayVisit,yestVisit) + '</div>' +
      '<div class="kpi-card kpi-view"><div class="kpi-icon">👁</div><div class="kpi-val">' + tV.toLocaleString() + '</div><div class="kpi-lbl">영상 조회</div>' + deltaHtml(tV,yV) + '</div>' +
      '<div class="kpi-card kpi-feed"><div class="kpi-icon">📹</div><div class="kpi-val">' + tF.toLocaleString() + '</div><div class="kpi-lbl">피드 클릭</div>' + deltaHtml(tF,yF) + '</div>' +
      '<div class="kpi-card kpi-map"><div class="kpi-icon">🗺️</div><div class="kpi-val">' + tM.toLocaleString() + '</div><div class="kpi-lbl">지도 클릭</div>' + deltaHtml(tM,yM) + '</div>' +
    '</div>' +
    // ⭐ 추천탭 조회 별도 강조 배너
    (tR > 0 || yR > 0
      ? '<div style="margin-top:10px;padding:12px 16px;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);border-radius:12px;display:flex;align-items:center;justify-content:space-between">' +
          '<div><span style="font-size:18px">⭐</span> <strong style="color:#fbbf24;font-size:15px">' + tR.toLocaleString() + '</strong> <span style="font-size:12px;color:#94a3b8">추천탭 조회 (오늘)</span></div>' +
          deltaHtml(tR, yR) +
        '</div>'
      : '<div style="margin-top:10px;padding:10px 16px;background:rgba(251,191,36,.05);border:1px dashed rgba(251,191,36,.2);border-radius:12px;font-size:12px;color:#64748b;text-align:center">⭐ 추천탭 조회 데이터 없음 (오늘)</div>'
    );

  // 2) 누적 요약
  const totalClicks = (d.totalFeedSP||0)+(d.totalMapSP||0);
  const accum =
    '<div class="section-title">📊 누적 합계</div>' +
    '<div class="summary-bar">' +
      '<div class="sb-item"><div class="sb-val" style="color:#FF8FA3">' + (d.totalViews||0).toLocaleString() + '</div><div class="sb-lbl">총 영상조회</div></div>' +
      '<div class="sb-item"><div class="sb-val" style="color:var(--green)">' + totalClicks.toLocaleString() + '</div><div class="sb-lbl">총 예약클릭</div></div>' +
      '<div class="sb-item"><div class="sb-val" style="color:#a78bfa">' + (d.totalShops||0) + '</div><div class="sb-lbl">등록 업체</div></div>' +
    '</div>';

  // 3) 투자자 지표
  const invest = buildInvestMetrics(d, dv);

  // 4) 14일 차트
  const chart = buildChart14(_chartMode);

  // 5) 업체별 전환율 인사이트
  const shopInsight = buildShopInsight();

  // 6) 오늘 업체 랭킹
  const rank = buildRank(_rankMode);

  // 7) 추천탭 조회 랭킹 (7일)
  const recRank = buildRecRank();

  p.innerHTML = kpi + accum + invest + chart + shopInsight + rank + recRank;
}

// ── 추천탭 전체 현황 섹션
function buildRecRank() {
  const all  = shopData || [];
  const recOn = all.filter(s => s.isRecommended);
  // 전체 7일/오늘 합계
  const totalWeek  = recOn.reduce((a,s) => a + (s.weekRecView||0), 0);
  const totalToday = recOn.reduce((a,s) => a + (s.todayRecView||0), 0);
  // 14일 차트 (weekChart에서 recView 추출)
  const chart = (_stats && _stats.weekChart) ? _stats.weekChart : [];

  // 헤더 KPI
  const header =
    '<div class="section-title" style="margin-top:20px">⭐ 추천탭 현황</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#fbbf24">' + recOn.length + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">노출 업체 수</div>' +
      '</div>' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#fbbf24">' + (totalWeek > 0 ? totalWeek.toLocaleString() : '—') + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">7일 전체 조회</div>' +
      '</div>' +
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px;text-align:center">' +
        '<div style="font-size:20px;font-weight:800;color:#f59e0b">' + (totalToday > 0 ? '+'+totalToday : '—') + '</div>' +
        '<div style="font-size:10px;color:#92400e;margin-top:2px">오늘 조회</div>' +
      '</div>' +
    '</div>';

  // 14일 추이 미니 바 차트
  let chartHtml = '';
  if (chart.length > 0) {
    const maxRec = Math.max(...chart.map(r => r.recView||0), 1);
    const bars = chart.map(r => {
      const v   = r.recView || 0;
      const h   = Math.max(Math.round((v / maxRec) * 40), v > 0 ? 3 : 1);
      const dt  = r.date ? r.date.slice(5) : '';
      return '<div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:3px">' +
        '<div style="font-size:9px;color:#fbbf24;font-weight:700">' + (v > 0 ? v : '') + '</div>' +
        '<div style="width:100%;display:flex;align-items:flex-end;justify-content:center;height:40px">' +
          '<div style="width:70%;border-radius:3px 3px 0 0;background:' + (v > 0 ? 'linear-gradient(180deg,#fbbf24,#f59e0b)' : 'rgba(255,255,255,.06)') + ';height:' + h + 'px"></div>' +
        '</div>' +
        '<div style="font-size:8px;color:#475569">' + dt + '</div>' +
      '</div>';
    }).join('');
    chartHtml =
      '<div style="margin-bottom:12px;padding:10px 12px;background:rgba(251,191,36,.03);border:1px solid rgba(251,191,36,.1);border-radius:12px">' +
        '<div style="font-size:10px;color:#92400e;font-weight:700;margin-bottom:8px">📈 추천탭 일별 조회 추이 (14일)</div>' +
        '<div style="display:flex;gap:2px;align-items:flex-end">' + bars + '</div>' +
      '</div>';
  }

  // 업체별 랭킹
  const list = recOn.filter(s => (s.weekRecView||0) > 0 || (s.todayRecView||0) > 0);
  const noData = recOn.filter(s => (s.weekRecView||0) === 0 && (s.todayRecView||0) === 0);
  let rankHtml = '';
  if (list.length > 0) {
    const sorted = [...list].sort((a,b) => ((b.weekRecView||0)+(b.todayRecView||0)) - ((a.weekRecView||0)+(a.todayRecView||0)));
    const maxW = sorted[0].weekRecView || 1;
    rankHtml = sorted.map((s,i) => {
      const w    = s.weekRecView  || 0;
      const t    = s.todayRecView || 0;
      const bar  = Math.min(Math.round((w / maxW) * 100), 100);
      const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+'위';
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<span style="font-size:12px;min-width:26px;text-align:center">' + medal + '</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12px;font-weight:600;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + s.name + '</div>' +
          '<div style="height:3px;border-radius:2px;background:rgba(255,255,255,.06);margin-top:5px">' +
            '<div style="height:3px;border-radius:2px;background:linear-gradient(90deg,#f59e0b,#fbbf24);width:' + bar + '%"></div>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;min-width:80px">' +
          '<div style="font-size:13px;font-weight:700;color:#fbbf24">' + w.toLocaleString() + ' <span style="font-size:9px;color:#92400e">7일</span></div>' +
          (t > 0
            ? '<div style="font-size:10px;color:#f59e0b;font-weight:600">오늘 +' + t + '</div>'
            : '<div style="font-size:10px;color:#374151">오늘 —</div>') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 데이터 없는 추천 업체 (조회 0)
  let noDataHtml = '';
  if (noData.length > 0) {
    noDataHtml =
      '<div style="margin-top:8px;padding:8px 12px;background:rgba(255,255,255,.02);border-radius:8px">' +
        '<div style="font-size:10px;color:#475569;margin-bottom:4px">조회 0 (노출 중)</div>' +
        '<div style="font-size:11px;color:#64748b">' + noData.map(s=>s.name).join(' · ') + '</div>' +
      '</div>';
  }

  const body = list.length > 0
    ? '<div style="background:rgba(251,191,36,.04);border:1px solid rgba(251,191,36,.15);border-radius:12px;padding:12px 16px">' + rankHtml + noDataHtml + '</div>'
    : '<div style="padding:16px;text-align:center;font-size:12px;color:#475569;background:rgba(251,191,36,.03);border:1px dashed rgba(251,191,36,.15);border-radius:12px">아직 추천탭 조회 데이터가 없습니다</div>';

  return header + chartHtml + body;
}

// ── 투자자 지표 섹션
function buildInvestMetrics(d, dv) {
  const list = shopData || [];

  // ① 전환율 (누적 view → feed클릭)
  const totalV = d.totalViews  || 0;
  const totalF = d.totalFeedSP || 0;
  const totalM = d.totalMapSP  || 0;
  const cvr    = totalV ? ((totalF / totalV) * 100) : 0;
  const cvrStr = cvr.toFixed(1) + '%';
  const cvrW   = Math.min(cvr * 5, 100).toFixed(1); // 게이지 (20%=풀)
  const cvrComment = cvr >= 5 ? '우수' : cvr >= 2 ? '보통' : '개선 필요';
  const cvrColor   = cvr >= 5 ? '#34d399' : cvr >= 2 ? '#f59e0b' : '#f87171';

  // ② 주간 성장률 (어제 기준 7일 전 대비)
  const chart = d.weekChart || [];
  const chartMap = {};
  chart.forEach(r => { chartMap[r.date] = r.views || 0; });
  const todayKST = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  // 최근 3일 합계 vs 그 이전 3일
  const recent3 = [-2,-1,0].map(i => {
    const dt = new Date(Date.now()+9*60*60*1000+i*86400000).toISOString().slice(0,10);
    return chartMap[dt] || 0;
  }).reduce((a,b)=>a+b,0);
  const prev3 = [-5,-4,-3].map(i => {
    const dt = new Date(Date.now()+9*60*60*1000+i*86400000).toISOString().slice(0,10);
    return chartMap[dt] || 0;
  }).reduce((a,b)=>a+b,0);
  const growthPct = prev3 > 0 ? (((recent3 - prev3) / prev3) * 100) : (recent3 > 0 ? 100 : 0);
  const growthStr = (growthPct >= 0 ? '+' : '') + growthPct.toFixed(0) + '%';
  const growthColor = growthPct >= 0 ? '#34d399' : '#f87171';
  const growthComment = growthPct >= 10 ? '성장 중 🚀' : growthPct >= 0 ? '유지 중 →' : '감소 중 ⚠️';

  // ③ DAU/MAU (방문자 기준)
  const dvRows = Array.isArray(dv) ? dv : [];
  const mau30  = dvRows.slice(0, 30).reduce((s, r) => s + (parseInt(r.visit_cnt)||0), 0);
  const dau    = dvRows[0] ? (parseInt(dvRows[0].visit_cnt)||0) : 0; // 어제(최근 완성일)
  const dauMau = mau30 > 0 ? ((dau / (mau30 / 30)) * 100).toFixed(0) : '—';
  const dauMauComment = mau30 > 0 ? '일평균 ' + Math.round(mau30/Math.min(dvRows.length,30)).toLocaleString() + '명' : '데이터 누적 중';

  // ④ 수익화 현황
  const paid    = list.filter(s => s.paymentStatus === 'paid').length;
  const free    = list.filter(s => s.paymentStatus === 'free').length;
  const total   = list.length;
  const payRate = total > 0 ? ((paid / total) * 100).toFixed(0) : 0;
  const payComment = paid > 0 ? paid + '개 결제 · ' + free + '개 무료' : '무료 ' + free + '개 · 미결제 ' + (total-free) + '개';

  // ── 렌더링
  const insightCards =
    '<div class="insight-grid">' +
      // 전환율
      '<div class="insight-card ic-cvr">' +
        '<div class="insight-icon">🎯</div>' +
        '<div class="insight-val">' + cvrStr + '</div>' +
        '<div class="insight-lbl">예약 전환율</div>' +
        '<div class="cvr-gauge"><div class="cvr-gauge-fill" style="width:' + cvrW + '%"></div></div>' +
        '<div class="insight-sub" style="margin-top:5px">view→피드클릭 <b style="color:' + cvrColor + '">' + cvrComment + '</b><br>' +
          '조회 ' + totalV.toLocaleString() + ' → 클릭 ' + totalF.toLocaleString() + '</div>' +
      '</div>' +
      // 성장률
      '<div class="insight-card ic-growth">' +
        '<div class="insight-icon">📈</div>' +
        '<div class="insight-val" style="color:' + growthColor + '">' + growthStr + '</div>' +
        '<div class="insight-lbl">주간 성장률</div>' +
        '<div class="insight-sub">최근 3일 vs 이전 3일<br>' +
          '<b>' + recent3.toLocaleString() + '</b> vs <b>' + prev3.toLocaleString() + '</b> 영상조회<br>' +
          '<b style="color:' + growthColor + '">' + growthComment + '</b></div>' +
      '</div>' +
      // DAU/MAU
      '<div class="insight-card ic-daumau">' +
        '<div class="insight-icon">🔁</div>' +
        '<div class="insight-val">' + dauMau + (mau30 > 0 ? '%' : '') + '</div>' +
        '<div class="insight-lbl">재방문 지수</div>' +
        '<div class="insight-sub">일방문 / 월평균 비율<br>' + dauMauComment + '<br>' +
          '<b style="color:var(--t3)">높을수록 습관성 앱</b></div>' +
      '</div>' +
      // 수익화
      '<div class="insight-card ic-pay">' +
        '<div class="insight-icon">💰</div>' +
        '<div class="insight-val">' + payRate + '%</div>' +
        '<div class="insight-lbl">유료 전환율</div>' +
        '<div class="insight-sub">전체 ' + total + '개 업체 중<br>' + payComment + '<br>' +
          (paid > 0 ? '<b style="color:#a78bfa">수익화 진행 중</b>' : '<b style="color:var(--t3)">수익화 준비 단계</b>') + '</div>' +
      '</div>' +
    '</div>';

  // ── 수익화 퍼널 (방문→조회→클릭 드롭오프)
  const maxFunnel = Math.max(mau30 || dau || 1, totalV || 1);
  const funnelVisit = mau30 || dau;
  const funnelView  = totalV;
  const funnelFeed  = totalF;
  const funnelMap   = totalM;
  const fw = (n) => Math.max((n / (maxFunnel || 1) * 100), n > 0 ? 2 : 0).toFixed(1);
  const drop1 = funnelVisit > 0 ? ((funnelView / funnelVisit)*100).toFixed(0) + '% 진입' : '—';
  const drop2 = funnelView  > 0 ? ((funnelFeed / funnelView)*100).toFixed(1) + '% 전환' : '—';

  const funnel =
    '<div class="section-title">🔽 사용자 퍼널</div>' +
    '<div class="funnel-bar">' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">방문자</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-visit" style="width:100%"></div></div>' +
        '<div class="funnel-num">' + (funnelVisit||0).toLocaleString() + '</div>' +
        '<div class="funnel-pct">100%</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">영상조회</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-view" style="width:' + fw(funnelView) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelView.toLocaleString() + '</div>' +
        '<div class="funnel-pct" style="color:#f59e0b">' + drop1 + '</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">피드클릭</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-feed" style="width:' + fw(funnelFeed) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelFeed.toLocaleString() + '</div>' +
        '<div class="funnel-pct" style="color:#34d399">' + drop2 + '</div>' +
      '</div>' +
      '<div class="funnel-row">' +
        '<div class="funnel-label">지도클릭</div>' +
        '<div class="funnel-track"><div class="funnel-fill f-map" style="width:' + fw(funnelMap) + '%"></div></div>' +
        '<div class="funnel-num">' + funnelMap.toLocaleString() + '</div>' +
        '<div class="funnel-pct">' + (funnelView > 0 ? ((funnelMap/funnelView)*100).toFixed(1)+'%' : '—') + '</div>' +
      '</div>' +
    '</div>';

  return '<div class="section-title">💡 핵심 지표</div>' + insightCards + funnel;
}

// ── 업체별 전환율 인사이트
function buildShopInsight() {
  const list = shopData || [];
  if (!list.length) return '';

  // 전환율 계산 (view→feed, 조회 50 이상만)
  const withCvr = list
    .filter(s => (s.views||0) >= 50)
    .map(s => ({
      ...s,
      cvr: s.views > 0 ? (s.feedSP / s.views * 100) : 0
    }))
    .sort((a, b) => b.cvr - a.cvr);

  if (!withCvr.length) return '';

  const top3  = withCvr.slice(0, 3);
  const bot3  = [...withCvr].sort((a,b) => a.cvr - b.cvr).slice(0, 3);

  const renderRow = (s, i, isAlert) => {
    const cvrN = s.cvr;
    const cls  = cvrN >= 5 ? 'hi' : cvrN >= 2 ? 'mid' : 'lo';
    return '<div class="si-card">' +
      '<div class="si-rank" style="color:' + (isAlert ? '#f87171' : '#34d399') + '">' + (isAlert ? '⚠' : '✓') + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<div class="si-name">' + s.name + '</div>' +
        '<div class="si-cat">' + s.category + ' · 조회 ' + (s.views||0).toLocaleString() + '</div>' +
      '</div>' +
      '<div class="si-right">' +
        '<div class="si-cvr ' + cls + '">' + cvrN.toFixed(1) + '%</div>' +
        '<div class="si-sub">전환율</div>' +
      '</div>' +
    '</div>';
  };

  return '<div class="section-title">🔬 업체별 전환율</div>' +
    '<div style="display:flex;gap:6px;margin-bottom:8px">' +
      '<button class="rank-tab' + (_insightMode==='top'?' on':'') + '" data-m="top" onclick="switchInsight(this.dataset.m)">🏆 전환율 TOP</button>' +
      '<button class="rank-tab' + (_insightMode==='bot'?' on':'') + '" data-m="bot" onclick="switchInsight(this.dataset.m)">⚠️ 개선 필요</button>' +
    '</div>' +
    '<div class="shop-insight-list">' +
    (_insightMode === 'top' ? top3 : bot3).map((s,i) => renderRow(s, i, _insightMode==='bot')).join('') +
    '</div>';
}

// ── 14일 차트 빌드
function buildChart14(mode) {
  const today = new Date(Date.now()+9*60*60*1000);
  const days = [];
  for (let i=13;i>=0;i--) {
    const d = new Date(Date.now()+9*60*60*1000-i*86400000);
    days.push(d.toISOString().slice(0,10));
  }
  const todayStr = today.toISOString().slice(0,10);
  const chart = (_stats && _stats.weekChart) || [];
  const dv    = _dvRows;

  let counts, barClass, chartLabel;
  if (mode==='view') {
    const m={}; chart.forEach(r=>{m[r.date]=r.views||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-view'; chartLabel='👁 영상조회';
  } else if (mode==='feed') {
    const m={}; chart.forEach(r=>{m[r.date]=r.feedSP||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-feed'; chartLabel='📹 피드클릭';
  } else if (mode==='map') {
    const m={}; chart.forEach(r=>{m[r.date]=r.mapSP||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-map'; chartLabel='🗺️ 지도클릭';
  } else {
    const m={}; dv.forEach(r=>{m[r.visit_date]=parseInt(r.visit_cnt)||0;});
    counts=days.map(d=>m[d]||0); barClass='bar-visit'; chartLabel='🙋 방문자';
  }

  const maxV = Math.max(...counts,1);
  const total = counts.reduce((a,b)=>a+b,0);
  const empty = counts.every(c=>c===0);

  const tabOn = {view:'on-v', feed:'on-f', map:'on-m', visit:'on-a'};

  const barsHtml = empty ? '<div class="chart-empty">데이터가 쌓이면 여기에 표시돼요</div>' :
    '<div class="chart-body">' +
    days.map((d,i)=>{
      const c=counts[i], h=Math.max(Math.round((c/maxV)*72),c>0?4:2);
      const isT=d===todayStr;
      return '<div class="bar-col">' +
        '<div class="bar-cnt">'+(c>0?c:'')+'</div>' +
        '<div class="bar-fill '+(isT?'bar-today':barClass)+'" style="height:'+h+'px"></div>' +
        '<div class="bar-date">'+(isT?'오늘':d.slice(5))+'</div>' +
      '</div>';
    }).join('') +
    '</div>';

  return '<div class="section-title">📈 14일 추이</div>' +
    '<div class="chart-card">' +
      '<div class="chart-header">' +
        '<span class="chart-title">' + chartLabel + ' · 14일 합계 ' +
          '<strong style="color:var(--t1)">' + total.toLocaleString() + '</strong></span>' +
        '<div class="chart-tabs">' +
          '<button class="ctab '+(mode==='visit'?tabOn.visit:'')+'" data-m="visit" onclick="switchChart(this.dataset.m)">방문</button>' +
          '<button class="ctab '+(mode==='view'?tabOn.view:'')+'" data-m="view" onclick="switchChart(this.dataset.m)">영상</button>' +
          '<button class="ctab '+(mode==='feed'?tabOn.feed:'')+'" data-m="feed" onclick="switchChart(this.dataset.m)">피드</button>' +
          '<button class="ctab '+(mode==='map'?tabOn.map:'')+'" data-m="map" onclick="switchChart(this.dataset.m)">지도</button>' +
        '</div>' +
      '</div>' +
      barsHtml +
      '<div class="chart-footer">' +
        '<span class="chart-legend">🟡 오늘</span>' +
        '<button class="reset-btn" onclick="confirmReset()">🗑 통계 초기화</button>' +
      '</div>' +
    '</div>';
}

function switchChart(m) { _chartMode=m; renderDashboard(); }
function switchInsight(m) { _insightMode=m; renderDashboard(); }

// ── 업체 랭킹 빌드
function buildRank(mode) {
  const list = shopData || [];
  if (!list.length) return '<div class="empty">등록된 업체가 없어요</div>';
  const fb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";

  // 정렬: 오늘 or 누적
  const sorted = [...list].sort((a,b) => {
    if (mode==='today') {
      const at=(a.todayViews||0)+(a.todayFeedSP||0)+(a.todayMapSP||0);
      const bt=(b.todayViews||0)+(b.todayFeedSP||0)+(b.todayMapSP||0);
      return bt-at;
    }
    return ((b.views||0)+(b.feedSP||0)+(b.mapSP||0)) - ((a.views||0)+(a.feedSP||0)+(a.mapSP||0));
  });

  const tabOn_today = mode==='today'?' on':'';
  const tabOn_total = mode==='total'?' on':'';

  const header =
    '<div class="section-title">🏆 업체별 성과</div>' +
    '<div class="rank-tabs">' +
      '<button class="rank-tab'+tabOn_today+'" data-m="today" onclick="switchRank(this.dataset.m)">오늘 성과</button>' +
      '<button class="rank-tab'+tabOn_total+'" data-m="total" onclick="switchRank(this.dataset.m)">누적 성과</button>' +
    '</div>';

  const items = sorted.map((s,i) => {
    const img = s.thumbnail || (s.youtubeId ? 'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg' : fb);
    const hq  = img;
    const rc  = i===0?'rn1':i===1?'rn2':i===2?'rn3':'rnN';
    const vv  = mode==='today' ? (s.todayViews||0)  : (s.views||0);
    const fv  = mode==='today' ? (s.todayFeedSP||0) : (s.feedSP||0);
    const mv  = mode==='today' ? (s.todayMapSP||0)  : (s.mapSP||0);
    const tot = vv+fv+mv;
    const unit = mode==='today' ? '오늘' : '누적';
    return '<div class="rank-item">' +
      '<div class="rank-num '+rc+'">'+(i+1)+'</div>' +
      '<img class="rank-thumb" src="'+img+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+hq+'" data-fb="'+fb+'"/>' +
      '<div class="rank-info">' +
        '<div class="rank-name">'+s.name+'</div>' +
        '<div class="rank-cat">'+s.category+(s.district?' · '+s.district:'')+'</div>' +
        '<div class="rank-stats">' +
          '<span class="rank-stat rs-view">👁 '+vv.toLocaleString()+'</span>' +
          '<span class="rank-stat rs-feed">📹 '+fv.toLocaleString()+'</span>' +
          '<span class="rank-stat rs-map">🗺️ '+mv.toLocaleString()+'</span>' +
        '</div>' +
      '</div>' +
      '<div class="rank-total">'+tot.toLocaleString()+'<small>'+unit+' 합계</small></div>' +
    '</div>';
  }).join('');

  return header + items;
}

function switchRank(m) { _rankMode=m; renderDashboard(); }

async function confirmReset() {
  if (!confirm('통계를 초기화할까요? (방문자/영상조회/예약클릭 모두 리셋)')) return;
  const r = await fetch('/api/admin/reset-stats', {method:'POST'});
  if (r.ok) { toast('통계가 초기화됐어요'); loadAll(); }
  else toast('초기화 실패');
}

// ======================================================
// 업체 관리 탭
// ======================================================
function modeLabel(m) {
  if (m==='feed') return '<span class="sc-mode mode-feed">🎬 영상전용</span>';
  if (m==='map')  return '<span class="sc-mode mode-map">🗺️ 지도전용</span>';
  return '<span class="sc-mode mode-both">🎬🗺️ 영상+지도</span>';
}
function planBadge(s) {
  const plan = s.plan||'basic', st = s.paymentStatus||'unpaid';
  const pB = plan==='shoot'
    ? '<span class="badge b-plan-shoot">🎬 촬영플랜</span>'
    : '<span class="badge b-plan-basic">📍 기본플랜</span>';
  let sB = '';
  if (st==='paid')    sB='<span class="badge b-paid">✅ 결제완료</span>';
  else if (st==='free') sB='<span class="badge b-free">🎁 무료기간</span>';
  else if (st==='expired') sB='<span class="badge b-expired">⚠️ 만료</span>';
  else sB='<span class="badge b-unpaid">💳 미결제</span>';
  let exp='';
  if (s.paidUntil) {
    const d=new Date(s.paidUntil), diff=Math.ceil((d-new Date())/86400000);
    const ds=d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'});
    exp = diff>0
      ? '<span class="badge" style="background:rgba(255,255,255,.06);color:var(--t3)">📆 '+ds+' ('+diff+'일)</span>'
      : '<span class="badge b-expired">📆 만료 ('+Math.abs(diff)+'일 경과)</span>';
  }
  return pB+sB+exp;
}

function renderShops(list) {
  const p = document.getElementById('panel-shops');
  if (!list.length) { p.innerHTML='<div class="empty">등록된 업체가 없어요</div>'; return; }
  const fb="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";
  const thumb   = s => s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg':fb);
  const thumbHq = thumb;
  p.innerHTML = '<div class="section-title">🏪 업체 목록 <span style="font-weight:500;font-size:10px">'+list.length+'개</span></div>' +
  list.map(s => {
    const totToday=(s.todayViews||0)+(s.todayFeedSP||0)+(s.todayMapSP||0);
    return '<div class="shop-card" id="card-'+s.id+'">' +
      '<div class="sc-top">' +
        '<img class="sc-thumb" src="'+thumb(s)+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+thumbHq(s)+'" data-fb="'+fb+'"/>' +
        '<div class="sc-info">' +
          '<div class="sc-name">'+s.name+
            (s.featured?'<span class="badge b-feat">추천</span>':'')+
            (!s.active?'<span class="badge b-hide">비공개</span>':'') +
          '</div>' +
          '<div class="sc-cat">'+s.category+'</div>' +
          '<div class="sc-addr">'+( s.address||'')+'</div>' +
          modeLabel(s.displayMode||'both') +
        '</div>' +
      '</div>' +
      '<div class="sc-mid">'+planBadge(s)+
        (s.paymentMemo?'<span class="badge" style="background:rgba(255,255,255,.05);color:var(--t3);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+s.paymentMemo+'">📝 '+s.paymentMemo+'</span>':'')+
      '</div>' +
      '<div class="sc-nums">' +
        // ── 주요 지표: 피드클릭 + 지도클릭 (크게)
        '<div class="sc-click-row">' +
          '<div class="sc-num main c-feed">' +
            '<div class="sn-v">📅 '+(s.feedSP||0).toLocaleString()+'</div>' +
            '<div class="sn-l main-lbl">피드 예약클릭</div>' +
          '</div>' +
          '<div class="sc-num main c-map">' +
            '<div class="sn-v">📍 '+(s.mapSP||0).toLocaleString()+'</div>' +
            '<div class="sn-l main-lbl">지도 예약클릭</div>' +
          '</div>' +
        '</div>' +
        // ── 총 클릭 + 보조: 영상조회 합계
        '<div class="sc-total-click">' +
          '<div><div class="stc-lbl">총 예약클릭</div><div class="stc-val">'+((s.feedSP||0)+(s.mapSP||0)).toLocaleString()+'</div></div>' +
          '<div style="text-align:right"><div class="stc-lbl">👁 영상조회</div><div class="sn-v sub">'+(s.views||0).toLocaleString()+'</div></div>' +
        '</div>' +
        // ── 출처별 영상조회 분석 (오늘)
        ((s.todayFeedView||0)+(s.todayCatalogView||0)+(s.todayMapView||0) > 0
          ? '<div class="sc-view-src">' +
              '<div class="vsrc-title">오늘 영상조회 출처</div>' +
              '<div class="vsrc-row">' +
                '<span class="vsrc-chip vsrc-feed">📜 피드 '+(s.todayFeedView||0)+'</span>' +
                '<span class="vsrc-chip vsrc-cat">📂 카탈로그 '+(s.todayCatalogView||0)+'</span>' +
                '<span class="vsrc-chip vsrc-map">🗺 지도 '+(s.todayMapView||0)+'</span>' +
              '</div>' +
            '</div>'
          : '') +
        // ── 출처별 전환율 (영상→예약, 오늘)
        (function(){
          const vF=s.todayFeedView||0, vC=s.todayCatalogView||0, vM=s.todayMapView||0;
          const tF=s.todayVtsFeed||0,  tC=s.todayVtsCatalog||0,  tM=s.todayVtsMap||0;
          if (tF+tC+tM === 0) return '';
          const cvr = (v,t) => v>0 ? Math.round(t/v*100)+'%' : '—';
          const bar = (pct,col) => {
            const n = parseInt(pct)||0;
            return '<div style="height:4px;border-radius:2px;background:rgba(255,255,255,.06);margin-top:3px">'
              +'<div style="height:4px;border-radius:2px;background:'+col+';width:'+Math.min(n,100)+'%"></div></div>';
          };
          return '<div class="sc-cvr-wrap">'
            +'<div class="sc-cvr-title">오늘 영상→예약 전환율</div>'
            +'<div class="sc-cvr-row">'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">📜 피드</div>'
                +'<div class="sc-cvr-val" style="color:#10b981">'+cvr(vF,tF)+'</div>'
                +'<div class="sc-cvr-sub">'+tF+'/'+vF+'명'+'</div>'
                +bar(parseInt(cvr(vF,tF)),'#10b981')
              +'</div>'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">📂 카탈로그</div>'
                +'<div class="sc-cvr-val" style="color:#f59e0b">'+cvr(vC,tC)+'</div>'
                +'<div class="sc-cvr-sub">'+tC+'/'+vC+'명'+'</div>'
                +bar(parseInt(cvr(vC,tC)),'#f59e0b')
              +'</div>'
              +'<div class="sc-cvr-item">'
                +'<div class="sc-cvr-src">🗺 지도</div>'
                +'<div class="sc-cvr-val" style="color:#818cf8">'+cvr(vM,tM)+'</div>'
                +'<div class="sc-cvr-sub">'+tM+'/'+vM+'명'+'</div>'
                +bar(parseInt(cvr(vM,tM)),'#818cf8')
              +'</div>'
            +'</div>'
          +'</div>';
        }()) +
      '</div>' +
      (totToday>0?'<div style="margin-top:6px;padding:6px 10px;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2);border-radius:8px;font-size:10px;color:#f59e0b;font-weight:700">' +
        '오늘 📅'+(s.todayFeedSP||0)+' 📍'+(s.todayMapSP||0)+' <span style="color:#64748b;font-weight:500">👁'+(s.todayViews||0)+'</span></div>':'') +
      // ── 추천탭 어필 배너
      (function(){
        const totalViews = s.views || 0;
        const totalClicks = (s.feedSP||0) + (s.mapSP||0);
        const weekRec = s.weekRecView || 0;
        const todayRec = s.todayRecView || 0;

        if (s.isRecommended) {
          // ─ 추천중: 7일/오늘 rec_view만 표시
          return '<div style="margin-top:8px;border-radius:12px;overflow:hidden;border:1.5px solid rgba(251,191,36,.3)">' +
            '<div style="background:linear-gradient(90deg,rgba(251,191,36,.15),rgba(251,191,36,.05));padding:7px 12px;display:flex;align-items:center;justify-content:space-between">' +
              '<span style="font-size:11px;font-weight:700;color:#fbbf24">⭐ 추천탭 노출 중</span>' +
              '<span style="font-size:10px;color:#92400e;background:rgba(251,191,36,.2);padding:1px 7px;border-radius:20px">ON</span>' +
            '</div>' +
            '<div style="padding:8px 12px;background:rgba(251,191,36,.04);display:grid;grid-template-columns:repeat(2,1fr);gap:4px;text-align:center">' +
              '<div><div style="font-size:17px;font-weight:800;color:#fbbf24">'+(weekRec>0?weekRec.toLocaleString():'—')+'</div><div style="font-size:9px;color:#64748b;margin-top:1px">7일 조회</div></div>' +
              '<div><div style="font-size:17px;font-weight:800;color:#f59e0b">'+(todayRec>0?'+'+todayRec:'—')+'</div><div style="font-size:9px;color:#64748b;margin-top:1px">오늘 조회</div></div>' +
            '</div>' +
          '</div>';
        } else {
          // ─ 미추천: 잠재 성과로 어필
          const potentialMsg = totalViews >= 500
            ? '영상 조회 '+totalViews.toLocaleString()+'회 — 추천탭 추가 시 상단 노출 가능'
            : totalClicks > 0
            ? '예약클릭 '+totalClicks+'회 실적 — 추천탭으로 더 많은 고객 유입 가능'
            : '추천탭 노출 시 잠재 고객에게 바로 보입니다';
          return '<div style="margin-top:8px;border-radius:12px;overflow:hidden;border:1.5px dashed rgba(251,191,36,.2)">' +
            '<div style="background:rgba(251,191,36,.03);padding:8px 12px;display:flex;align-items:flex-start;gap:8px">' +
              '<span style="font-size:14px;flex-shrink:0;margin-top:1px">☆</span>' +
              '<div style="flex:1">' +
                '<div style="font-size:11px;font-weight:700;color:#92400e;margin-bottom:2px">추천탭 미노출</div>' +
                '<div style="font-size:10px;color:#64748b;line-height:1.4">'+potentialMsg+'</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }
      }()) +
      '<div class="sc-btns">' +
        '<button class="btn-edit" data-id="'+s.id+'" onclick="openModal(+this.dataset.id)"><i class="fas fa-edit"></i> 수정</button>' +
        '<button class="btn-pay-edit" data-id="'+s.id+'" onclick="openPayModal(+this.dataset.id)"><i class="fas fa-credit-card"></i> 결제</button>' +
        '<button class="btn-report" data-id="'+s.id+'" onclick="copyReportLink(+this.dataset.id,this)"><i class="fas fa-chart-line"></i> 리포트</button>' +
        '<button class="btn-rec '+(s.isRecommended?'btn-rec-on':'')+'" data-id="'+s.id+'" data-rec="'+(s.isRecommended?'1':'0')+'" onclick="toggleRec(+this.dataset.id,+this.dataset.rec===1,this)">'+
          (s.isRecommended ? '⭐ 추천중' : '☆ 추천') +
        '</button>' +
        '<button class="btn-del" data-id="'+s.id+'" data-name="'+s.name.replace(/"/g,'&quot;')+'" onclick="delShop(+this.dataset.id,this.dataset.name)"><i class="fas fa-trash"></i></button>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ======================================================
// 구독관리 탭
// ======================================================
let payFilter='all';
function renderPayTab(filter) {
  if (filter!==undefined) payFilter=filter;
  const p = document.getElementById('panel-pay');
  const list = shopData;
  if (!list.length) { p.innerHTML='<div class="empty">등록된 업체가 없어요</div>'; return; }
  const fb="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E%F0%9F%92%84%3C/text%3E%3C/svg%3E";

  const paid=list.filter(s=>s.paymentStatus==='paid').length;
  const free=list.filter(s=>s.paymentStatus==='free').length;
  const unpaid=list.filter(s=>s.paymentStatus==='unpaid').length;
  const expired=list.filter(s=>s.paymentStatus==='expired').length;
  const soon=list.filter(s=>{
    if(!s.paidUntil)return false;
    const d=Math.ceil((new Date(s.paidUntil)-new Date())/86400000);
    return d>=0&&d<=30;
  }).length;

  let filtered=list;
  if (payFilter==='paid')    filtered=list.filter(s=>s.paymentStatus==='paid');
  else if(payFilter==='free')    filtered=list.filter(s=>s.paymentStatus==='free');
  else if(payFilter==='unpaid')  filtered=list.filter(s=>s.paymentStatus==='unpaid');
  else if(payFilter==='expired') filtered=list.filter(s=>s.paymentStatus==='expired');
  else if(payFilter==='soon')    filtered=list.filter(s=>{
    if(!s.paidUntil)return false;
    const d=Math.ceil((new Date(s.paidUntil)-new Date())/86400000);
    return d>=0&&d<=30;
  });

  filtered=[...filtered].sort((a,b)=>{
    const o={expired:0,unpaid:1,free:2,paid:3};
    const ao=o[a.paymentStatus]??9, bo=o[b.paymentStatus]??9;
    if(ao!==bo)return ao-bo;
    if(a.paidUntil&&b.paidUntil)return new Date(a.paidUntil)-new Date(b.paidUntil);
    return 0;
  });

  const fbtns=[
    {k:'all',l:'전체 '+list.length},
    {k:'paid',l:'✅ 결제 '+paid},
    {k:'free',l:'🎁 무료 '+free},
    {k:'unpaid',l:'💳 미결제 '+unpaid},
    {k:'expired',l:'⚠️ 만료 '+expired},
    {k:'soon',l:'🔔 임박 '+soon},
  ].map(b=>'<button class="pf-btn'+(payFilter===b.k?' on':'')+'" data-k="'+b.k+'" onclick="renderPayTab(this.dataset.k)">'+b.l+'</button>').join('');

  const stMap={paid:'✅ 결제완료',free:'🎁 무료기간',unpaid:'💳 미결제',expired:'⚠️ 만료'};
  const stColor={paid:'var(--green)',free:'var(--blue)',unpaid:'#FFA500',expired:'var(--pink)'};

  const cards=filtered.map(s=>{
    const img=s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/hqdefault.jpg':fb);
    const hq=img;
    const plan=s.plan||'basic', st=s.paymentStatus||'unpaid';
    let expHtml='<strong>미설정</strong>';
    if(s.paidUntil){
      const d=new Date(s.paidUntil),diff=Math.ceil((d-new Date())/86400000);
      const ds=d.toLocaleDateString('ko-KR',{year:'2-digit',month:'2-digit',day:'2-digit'});
      if(diff>30) expHtml='<strong style="color:var(--green)">'+ds+'</strong>';
      else if(diff>0) expHtml='<strong style="color:#FFA500">'+ds+' ('+diff+'일 남음)</strong>';
      else expHtml='<strong style="color:var(--pink)">'+ds+' ('+Math.abs(diff)+'일 경과)</strong>';
    }
    return '<div class="pay-card status-'+st+'">' +
      '<div class="pay-top">' +
        '<img class="pay-thumb" src="'+img+'" onerror="this.src=this.dataset.hq&&this.src!==this.dataset.hq?this.dataset.hq:this.dataset.fb" data-hq="'+hq+'" data-fb="'+fb+'"/>' +
        '<div class="pay-info">' +
          '<div class="pay-name">'+s.name+'</div>' +
          '<div class="pay-sub">'+s.category+' · '+(s.district||'')+'</div>' +
          '<div class="pay-badges">' +
            (plan==='shoot'?'<span class="badge b-plan-shoot">🎬 촬영플랜</span>':'<span class="badge b-plan-basic">📍 기본플랜</span>') +
            '<span class="badge" style="background:rgba(255,255,255,.06);color:'+( stColor[st]||'#fff')+'">'+( stMap[st]||st)+'</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="pay-body">' +
        '<div class="pay-kv">📆 만료일'+expHtml+'</div>' +
        '<div class="pay-kv">📋 플랜<strong>'+(plan==='shoot'?'촬영 (3만+월1만)':'기본 (월1만)')+'</strong></div>' +
      '</div>' +
      (s.paymentMemo?'<div class="pay-memo"><i class="fas fa-sticky-note" style="color:var(--t4);flex-shrink:0;margin-top:1px"></i><span>'+s.paymentMemo+'</span></div>':'') +
      '<div class="pay-btns"><button class="btn-pay-edit" data-id="'+s.id+'" onclick="openPayModal(+this.dataset.id)"><i class="fas fa-edit"></i> 결제 정보 수정</button></div>' +
    '</div>';
  }).join('')||'<div class="empty">해당 항목이 없어요</div>';

  p.innerHTML =
    '<div class="section-title">💳 구독 현황</div>' +
    '<div class="pay-summary">' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--green)">'+paid+'</div><div class="pay-sv-l">✅ 결제완료</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--blue)">'+free+'</div><div class="pay-sv-l">🎁 무료기간</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:#FFA500">'+unpaid+'</div><div class="pay-sv-l">💳 미결제</div></div>' +
      '<div class="pay-sv"><div class="pay-sv-n" style="color:var(--pink)">'+expired+'</div><div class="pay-sv-l">⚠️ 만료</div></div>' +
    '</div>' +
    '<div class="pay-filter">'+fbtns+'</div>' +
    cards;
}

// ── 결제 모달
function openPayModal(id) {
  const s=shopData.find(x=>x.id===id); if(!s)return;
  payEditId=id;
  document.getElementById('pmShopName').textContent=s.name+' · '+(s.category||'');
  setPmPlan(s.plan||'basic'); setPmStatus(s.paymentStatus||'unpaid');
  document.getElementById('pm-until').value=s.paidUntil?s.paidUntil.slice(0,10):'';
  document.getElementById('pm-memo').value=s.paymentMemo||'';
  document.getElementById('payModalBg').classList.remove('hidden');
}
function closePayModal(){document.getElementById('payModalBg').classList.add('hidden');}

// 추천 탭 ON/OFF 토글
async function toggleRec(id, isOn, btn) {
  btn.disabled = true;
  const next = !isOn;
  try {
    await fetch('/api/admin/shops/'+id+'/recommended', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ isRecommended: next })
    });
    btn.dataset.rec = next ? '1' : '0';
    btn.className   = 'btn-rec' + (next ? ' btn-rec-on' : '');
    btn.textContent = next ? '⭐ 추천중' : '☆ 추천';
    showToast(next ? '⭐ 추천 탭에 추가됐어요!' : '추천 탭에서 제거됐어요');
  } catch(e) {
    showToast('오류가 발생했어요');
  }
  btn.disabled = false;
}

// 리포트 링크 복사
async function copyReportLink(id, btn) {
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  try {
    const r = await fetch('/api/admin/shops/'+id+'/report-token', {method:'POST'});
    const d = await r.json();
    if (!d.token) throw new Error('no token');
    const link = location.origin + '/report/' + d.token;
    await navigator.clipboard.writeText(link);
    btn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
    btn.style.background = 'rgba(52,211,153,.2)';
    btn.style.borderColor = 'rgba(52,211,153,.4)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
    }, 2000);
  } catch(e) {
    btn.innerHTML = orig;
    btn.disabled = false;
    toast('링크 복사 실패: ' + e.message);
  }
}
function setPmPlan(plan){
  pmPlan=plan;
  ['shoot','basic'].forEach(k=>{document.getElementById('pm-plan-'+k).className='pm-plan-opt'+(k===plan?' sel-'+k:'');});
}
function setPmStatus(st){
  pmStatus=st;
  ['paid','free','unpaid','expired'].forEach(k=>{document.getElementById('pm-st-'+k).className='pm-status-opt'+(k===st?' sel-'+k:'');});
}
function addMonths(n){
  const base=document.getElementById('pm-until').value?new Date(document.getElementById('pm-until').value):new Date();
  base.setMonth(base.getMonth()+n);
  document.getElementById('pm-until').value=base.toISOString().slice(0,10);
}
async function savePayment(){
  if(!payEditId)return;
  const body={plan:pmPlan,paymentStatus:pmStatus,paidUntil:document.getElementById('pm-until').value||null,paymentMemo:document.getElementById('pm-memo').value.trim()};
  const r=await fetch('/api/admin/shops/'+payEditId+'/payment',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(r.ok){closePayModal();await loadAll();if(curTab==='pay')renderPayTab();toast('결제 정보가 저장됐어요');}
  else alert('저장 실패: '+r.status);
}

// ======================================================
// 입점문의
// ======================================================
async function loadInquiries(){
  const p=document.getElementById('panel-inq');
  p.innerHTML='<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const rows=await(await fetch('/api/admin/inquiries')).json();
  if(!rows.length){p.innerHTML='<div class="empty">📭 접수된 입점문의가 없어요</div>';return;}
  p.innerHTML='<div class="section-title">📬 입점 문의</div>'+rows.map(r=>{
    const d=new Date(r.created_at);
    const dt=d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'})+' '+d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    return '<div class="inq-card"><div class="inq-top"><span class="inq-name">'+(r.owner||r.name||'이름없음')+'</span>'+(r.category?'<span class="inq-badge">'+r.category+'</span>':'')+'<span class="inq-time">'+dt+'</span></div><div class="inq-row"><span class="inq-kv">🏪 샵명 <strong>'+(r.name||'-')+'</strong></span><span class="inq-kv">📍 지역 <strong>'+(r.area||'-')+'</strong></span><span class="inq-kv">📞 <strong>'+(r.phone||'-')+'</strong></span></div>'+(r.url?'<div class="inq-row"><span class="inq-kv">🔗 <strong style="color:var(--blue)">'+r.url+'</strong></span></div>':'')+(r.message?'<div class="inq-msg">💬 '+r.message+'</div>':'')+'</div>';
  }).join('');
}

// ======================================================
// 달력 탭
// ======================================================
let _calYear  = new Date().getFullYear();
let _calMonth = new Date().getMonth() + 1;
let _calData  = null;
let _calSel   = null; // 선택된 날짜

async function renderCalendar() {
  const p = document.getElementById('panel-cal');
  p.innerHTML = '<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const res = await fetch('/api/admin/calendar?year='+_calYear+'&month='+_calMonth);
  _calData = await res.json();
  _calSel  = null;
  drawCal();
}

async function calSelectDate(dateStr) {
  if (_calSel === dateStr) { _calSel = null; drawCal(); return; }
  _calSel = dateStr;
  drawCal();
  // 업체별 상세 로드
  const detailEl = document.getElementById('cal-detail');
  if (!detailEl) return;
  detailEl.innerHTML = '<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const res = await fetch('/api/admin/calendar?year='+_calYear+'&month='+_calMonth+'&date='+dateStr);
  const data = await res.json();
  renderCalDetail(dateStr, data.shopDetail || []);
}

function renderCalDetail(dateStr, shops) {
  const detailEl = document.getElementById('cal-detail');
  if (!detailEl) return;
  if (!shops.length) {
    detailEl.innerHTML = '<div class="empty" style="padding:24px;color:var(--t3);text-align:center">📭 해당 날짜에 기록된 데이터가 없어요</div>';
    return;
  }
  const fmt = function(n) { return (n||0).toLocaleString(); };
  const maxTotal = Math.max.apply(null, [1].concat(shops.map(function(s) { return (s.views||0)+(s.feedSP||0)+(s.mapSP||0); })));
  const mm = dateStr.slice(5,7)+'월', dd2 = dateStr.slice(8,10)+'일';

  let html = '<div style="background:#111;border:1px solid var(--border);border-radius:14px;overflow:hidden">'
    + '<div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">'
    + '<div style="font-size:13px;font-weight:700;color:var(--t1)">📅 '+mm+' '+dd2+' 업체별 실적</div>'
    + '<div style="font-size:11px;color:var(--t3)">'+shops.length+'개 업체</div>'
    + '</div>';

  shops.forEach(function(s, i) {
    const total  = (s.views||0) + (s.feedSP||0) + (s.mapSP||0);
    const barPct = Math.round(total / maxTotal * 100);
    const rankColors = ['#fbbf24','#aaa','#cd7f32'];
    const rankEmoji  = i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : '';
    const rankColor  = rankColors[i] || 'var(--t3)';
    const rankSize   = i < 3 ? '18' : '12';
    const rankLabel  = rankEmoji || String(i+1);
    const thumb = s.thumbnail
      ? '<img src="'+s.thumbnail+'" style="width:38px;height:38px;border-radius:9px;object-fit:cover;flex-shrink:0">'
      : '<div style="width:38px;height:38px;border-radius:9px;background:#222;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">💄</div>';
    const borderStyle = i === shops.length-1 ? 'border-bottom:none' : 'border-bottom:1px solid var(--border)';

    html += '<div style="padding:12px 14px;'+borderStyle+'">'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
      +   '<span style="font-size:'+rankSize+'px;font-weight:700;color:'+rankColor+';min-width:24px;text-align:center">'+rankLabel+'</span>'
      +   thumb
      +   '<div style="flex:1;min-width:0">'
      +     '<div style="font-size:13px;font-weight:700;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s.name+'</div>'
      +     '<div style="font-size:11px;color:var(--t3)">'+(s.category||'')+'</div>'
      +   '</div>'
      +   '<div style="font-size:16px;font-weight:800;color:var(--t1)">'+fmt(total)+'</div>'
      + '</div>'
      + '<div style="display:flex;gap:5px;margin-bottom:7px;flex-wrap:wrap">'
      +   (s.views  ? '<span style="font-size:11px;background:rgba(100,149,237,.15);color:#9ab4f0;padding:3px 8px;border-radius:6px">👁 '+fmt(s.views)+'</span>' : '')
      +   (s.feedSP ? '<span style="font-size:11px;background:rgba(255,138,170,.15);color:#ff8aaa;padding:3px 8px;border-radius:6px">📹 '+fmt(s.feedSP)+'</span>' : '')
      +   (s.mapSP  ? '<span style="font-size:11px;background:rgba(93,224,160,.15);color:#5de0a0;padding:3px 8px;border-radius:6px">🗺️ '+fmt(s.mapSP)+'</span>' : '')
      + '</div>'
      + '<div style="height:4px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden">'
      +   '<div style="height:100%;width:'+barPct+'%;background:linear-gradient(90deg,rgba(100,149,237,.8),rgba(255,77,125,.6));border-radius:3px;transition:width .4s ease"></div>'
      + '</div>'
      + '</div>';
  });

  html += '</div>';
  detailEl.innerHTML = html;
}

function drawCal() {
  var d    = _calData;
  var fmt  = function(n) { return (n||0).toLocaleString(); };
  var today = new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  var mt   = d.monthTotal;

  var dayMap = {}, visitMap = {};
  d.daily.forEach(function(x) { dayMap[x.date] = x; visitMap[x.date] = x.visits||0; });

  var maxVisits = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.visits||0;})));
  var maxViews  = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.views||0;})));
  var maxFeed   = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.feedSP||0;})));
  var maxMap2   = Math.max.apply(null,[1].concat(d.daily.map(function(x){return x.mapSP||0;})));

  var firstDay     = new Date(_calYear, _calMonth-1, 1).getDay();
  var lastDate     = new Date(_calYear, _calMonth, 0).getDate();
  var prevLastDate = new Date(_calYear, _calMonth-1, 0).getDate();
  var DOW = ['일','월','화','수','목','금','토'];

  var totalVisits = mt.visits||0;
  var totalViews  = mt.views||0;
  var totalFeed   = mt.feedSP||0;
  var totalMap    = mt.mapSP||0;
  var totalAll    = totalViews + totalFeed + totalMap;

  var activeDays = d.daily.filter(function(x){return (x.views||0)+(x.feedSP||0)+(x.mapSP||0)+(x.visits||0)>0;}).length || 1;
  var avgVisits  = (totalVisits/activeDays).toFixed(1);
  var avgViews   = (totalViews/activeDays).toFixed(1);

  var html = '';

  // ① 월 네비게이션 헤더
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'
    + '<button onclick="calMove(-1)" style="background:#1a1a1a;border:1px solid var(--border);color:var(--t1);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">&#9664;</button>'
    + '<div style="text-align:center">'
    +   '<div style="font-size:20px;font-weight:800;color:var(--t1)">'+_calYear+'년 '+_calMonth+'월</div>'
    +   '<div style="font-size:11px;color:var(--t3);margin-top:3px">활성일 '+activeDays+'일 &middot; 일평균 방문 '+avgVisits+' &middot; 일평균 조회 '+avgViews+'</div>'
    + '</div>'
    + '<button onclick="calMove(1)" style="background:#1a1a1a;border:1px solid var(--border);color:var(--t1);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">&#9654;</button>'
    + '</div>';

  // ② 월 합계 통계 카드 (4개)
  var statCards = [
    { emoji:'🙋', label:'방문자',     val:totalVisits, color:'#fbbf24', bg:'rgba(251,191,36,.1)',   bdr:'rgba(251,191,36,.25)' },
    { emoji:'👁', label:'영상조회',val:totalViews,  color:'#6495ed', bg:'rgba(100,149,237,.1)', bdr:'rgba(100,149,237,.25)' },
    { emoji:'📹', label:'피드클릭',val:totalFeed,   color:'#ff8aaa', bg:'rgba(255,138,170,.1)', bdr:'rgba(255,138,170,.25)' },
    { emoji:'🗺️',label:'지도클릭',val:totalMap, color:'#5de0a0',bg:'rgba(93,224,160,.1)', bdr:'rgba(93,224,160,.25)' },
  ];

  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">';
  statCards.forEach(function(sc) {
    var pct = totalAll > 0 && sc.label !== '방문자'
      ? Math.round(sc.val / Math.max(1,totalAll) * 100) : 0;
    var barHtml = sc.label !== '방문자'
      ? '<div style="margin-top:6px;height:3px;background:rgba(255,255,255,.08);border-radius:2px"><div style="height:100%;width:'+pct+'%;background:'+sc.color+';border-radius:2px"></div></div>'
      : '';
    html += '<div style="background:'+sc.bg+';border:1px solid '+sc.bdr+';border-radius:14px;padding:12px 10px;text-align:center">'
      + '<div style="font-size:20px;margin-bottom:4px">'+sc.emoji+'</div>'
      + '<div style="font-size:18px;font-weight:800;color:'+sc.color+'">'+fmt(sc.val)+'</div>'
      + '<div style="font-size:10px;color:var(--t3);margin-top:2px">'+sc.label+'</div>'
      + barHtml
      + '</div>';
  });
  html += '</div>';

  // ③ 최근 14일 트렌드 막대
  var last14 = [];
  for (var ti = 13; ti >= 0; ti--) {
    var dt14 = new Date(Date.now()+9*3600*1000 - ti*86400*1000).toISOString().slice(0,10);
    var dd14 = dayMap[dt14];
    last14.push({ date:dt14, visits:visitMap[dt14]||0, views:dd14?(dd14.views||0):0 });
  }
  var maxBar14 = Math.max.apply(null,[1].concat(last14.map(function(x){return Math.max(x.visits,x.views);})));

  html += '<div style="background:#111;border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px">'
    + '<div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:10px">📈 최근 14일 트렌드</div>'
    + '<div style="display:flex;align-items:flex-end;gap:3px;height:52px">';
  last14.forEach(function(x14) {
    var hv14 = maxBar14 ? Math.round(x14.visits/maxBar14*48) : 0;
    var hw14 = maxBar14 ? Math.round(x14.views/maxBar14*48) : 0;
    var isT14 = x14.date===today;
    var dd14s = x14.date.slice(8,10);
    var todayLbl = isT14 ? '<div style="position:absolute;top:-14px;font-size:8px;color:var(--amber);font-weight:800;white-space:nowrap">오늘</div>' : '';
    var dtTip = x14.date+' 방문:'+x14.visits+' 조회:'+x14.views;
    html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;position:relative" title="'+dtTip+'">'
      + '<div style="width:100%;display:flex;flex-direction:column;justify-content:flex-end;height:48px;gap:1px">'
      +   '<div style="height:'+hw14+'px;background:rgba(100,149,237,.7);border-radius:2px 2px 0 0;min-height:'+(hw14>0?2:0)+'px"></div>'
      +   '<div style="height:'+hv14+'px;background:rgba(251,191,36,.8);border-radius:2px 2px 0 0;min-height:'+(hv14>0?2:0)+'px"></div>'
      + '</div>'
      + '<div style="font-size:8px;color:'+(isT14?'var(--amber)':'var(--t4)')+';font-weight:'+(isT14?800:400)+';margin-top:2px">'+dd14s+'</div>'
      + todayLbl
      + '</div>';
  });
  html += '</div>'
    + '<div style="display:flex;gap:12px;margin-top:8px">'
    +   '<span style="font-size:10px;color:var(--t3);display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:10px;height:6px;background:rgba(251,191,36,.8);border-radius:1px"></span>방문자</span>'
    +   '<span style="font-size:10px;color:var(--t3);display:flex;align-items:center;gap:4px"><span style="display:inline-block;width:10px;height:6px;background:rgba(100,149,237,.7);border-radius:1px"></span>영상조회</span>'
    + '</div>'
    + '</div>';

  // ④ 달력 히트맵 그리드
  html += '<div style="background:#111;border-radius:14px;overflow:hidden;border:1px solid var(--border);margin-bottom:12px">';
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border)">';
  DOW.forEach(function(dw,i) {
    var c = i===0 ? '#ff6b6b' : i===6 ? '#6495ed' : 'var(--t3)';
    html += '<div style="text-align:center;padding:8px 0;font-size:11px;font-weight:700;color:'+c+'">'+dw+'</div>';
  });
  html += '</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(7,1fr)">';

  // 이전달 빈칸
  for (var pi = 0; pi < firstDay; pi++) {
    var pdd = prevLastDate - firstDay + pi + 1;
    html += '<div style="padding:6px 5px;min-height:64px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);opacity:.2">'
      + '<div style="font-size:11px;color:var(--t4)">'+pdd+'</div></div>';
  }

  // 이번달 날짜
  for (var day = 1; day <= lastDate; day++) {
    var col     = (firstDay + day - 1) % 7;
    var mo2     = String(_calMonth).padStart(2,'0');
    var da2     = String(day).padStart(2,'0');
    var dateStr = _calYear+'-'+mo2+'-'+da2;
    var dd      = dayMap[dateStr];
    var vis     = visitMap[dateStr]||0;
    var isToday = dateStr === today;
    var isSel   = dateStr === _calSel;
    var isSun   = col === 0;
    var isSat   = col === 6;
    var isLast  = col === 6 || day === lastDate;
    var isLastRow = day > lastDate - 7;

    var totalDay = vis + (dd ? (dd.views||0)+(dd.feedSP||0)+(dd.mapSP||0) : 0);
    var maxTotal = Math.max(1, maxVisits + maxViews + maxFeed + maxMap2);
    var intensity = Math.min(1, totalDay / maxTotal);
    var heatAlpha = totalDay > 0 ? (intensity * 0.5 + 0.08).toFixed(2) : '0';

    var cellBg = 'transparent';
    if (totalDay > 0)       cellBg = 'rgba(100,149,237,'+heatAlpha+')';
    if (isSel)              cellBg = 'rgba(255,77,125,.22)';
    if (isToday && !isSel)  cellBg = 'rgba(245,158,11,.15)';

    var borderR  = isLast    ? 'none' : '1px solid var(--border)';
    var borderB  = isLastRow ? 'none' : '1px solid var(--border)';
    var cursor   = totalDay > 0 ? 'pointer' : 'default';
    var numColor = isSel ? 'var(--pink)' : isToday ? '#fbbf24' : isSun ? '#ff6b6b' : isSat ? '#6495ed' : 'var(--t1)';
    var numWt    = (isToday||isSel) ? '800' : '600';
    var badge    = isToday ? '<span style="font-size:8px;background:#fbbf24;color:#000;padding:1px 3px;border-radius:3px;font-weight:800">T</span>' : '';

    html += '<div data-dt="'+dateStr+'" onclick="calSelectDate(this.dataset.dt)"'
      +' style="padding:6px 5px;min-height:64px;border-right:'+borderR+';border-bottom:'+borderB+';background:'+cellBg+';cursor:'+cursor+';transition:background .15s;position:relative">';
    html += '<div style="font-size:11px;font-weight:'+numWt+';color:'+numColor+';display:flex;align-items:center;gap:3px;margin-bottom:3px">'+day+badge+'</div>';

    if (totalDay > 0) {
      html += '<div style="display:flex;flex-direction:column;gap:2px">';
      if (vis)           html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">🙋</span><span style="font-size:9px;color:#fbbf24;font-weight:700">'+fmt(vis)+'</span></div>';
      if (dd && dd.views)  html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">👁</span><span style="font-size:9px;color:#9ab4f0;font-weight:700">'+fmt(dd.views)+'</span></div>';
      if (dd && dd.feedSP) html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">📹</span><span style="font-size:9px;color:#ff8aaa;font-weight:700">'+fmt(dd.feedSP)+'</span></div>';
      if (dd && dd.mapSP)  html += '<div style="display:flex;align-items:center;gap:2px"><span style="font-size:8px">🗺️</span><span style="font-size:9px;color:#5de0a0;font-weight:700">'+fmt(dd.mapSP)+'</span></div>';
      html += '</div>';
      var barPct2  = Math.max(2, Math.round(intensity * 100));
      var barColor = isSel ? 'var(--pink)' : isToday ? '#fbbf24' : 'rgba(100,149,237,.8)';
      html += '<div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.05)">'
        + '<div style="height:100%;width:'+barPct2+'%;background:'+barColor+';transition:width .3s"></div>'
        + '</div>';
    } else {
      html += '<div style="font-size:16px;color:var(--t4);margin-top:2px">&middot;</div>';
    }
    html += '</div>';
  }

  // 다음달 빈칸
  var remaining = (7 - (firstDay + lastDate) % 7) % 7;
  for (var ri = 1; ri <= remaining; ri++) {
    html += '<div style="padding:6px 5px;min-height:64px;border-bottom:none;opacity:.2">'
      + '<div style="font-size:11px;color:var(--t4)">'+ri+'</div></div>';
  }
  html += '</div></div>';

  // ⑤ 범례
  var heatBars = [0.1,0.2,0.35,0.5,0.65,0.85].map(function(v){
    return '<div style="width:16px;height:10px;border-radius:2px;background:rgba(100,149,237,'+v+')"></div>';
  }).join('');
  html += '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:16px;padding:8px 10px;background:#111;border:1px solid var(--border);border-radius:10px">'
    + '<span style="font-size:10px;color:var(--t3);font-weight:600">히트맵:</span>'
    + '<div style="display:flex;gap:2px;align-items:center">'+heatBars+'</div>'
    + '<span style="font-size:10px;color:var(--t3)">낙음 &#8594; 높음</span>'
    + '<span style="margin-left:4px;font-size:10px;color:#fbbf24">&#9632; 오늘</span>'
    + '<span style="font-size:10px;color:var(--pink)">&#9632; 선택</span>'
    + '<div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap">'
    +   '<span style="font-size:10px;color:#fbbf24">🙋방문자</span>'
    +   '<span style="font-size:10px;color:#9ab4f0">👁영상조회</span>'
    +   '<span style="font-size:10px;color:#ff8aaa">📹피드</span>'
    +   '<span style="font-size:10px;color:#5de0a0">🗺️지도</span>'
    + '</div>'
    + '</div>';

  // ⑥ 날짜 클릭 상세
  html += '<div id="cal-detail" style="margin-top:4px">'
    + '<div class="empty" style="padding:20px;color:var(--t3);text-align:center">📅 날짜를 클릭하면 업체별 상세 데이터가 표시됩니다</div>'
    + '</div>';

  var p = document.getElementById('panel-cal');
  p.innerHTML = '<div class="section" style="padding:16px">'+html+'</div>';

  if (_calSel && _calData) {
    var found = _calData.daily.find(function(x) { return x.date === _calSel; });
    if (!found) renderCalDetail(_calSel, []);
  }
}

// ======================================================
// 업체 추가/수정 모달
// ======================================================
function openModal(id) {
  editId=id||null;
  document.getElementById('modalTtl').textContent=id?'업체 수정':'업체 추가';
  if(id){
    const s=shopData.find(x=>x.id===id); if(!s)return;
    document.getElementById('f-name').value=s.name||'';
    document.getElementById('f-cat').value=s.category||'마사지';
    document.getElementById('f-price').value=s.priceRange||'';
    document.getElementById('f-thumb').value=s.thumbnail||'';
    document.getElementById('thumbPreview').src=s.thumbnail||(s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/maxresdefault.jpg':'');
    document.getElementById('f-yt').value=s.youtubeId||'';
    document.getElementById('f-addr').value=s.address||'';
    document.getElementById('f-dist').value=s.district||'';
    document.getElementById('f-phone').value=s.phone||'';
    document.getElementById('f-lat').value=s.lat||'';
    document.getElementById('f-lng').value=s.lng||'';
    document.getElementById('f-url').value=s.smartPlaceUrl||'';
    document.getElementById('f-tags').value=(s.tags||[]).join(', ');
    document.getElementById('f-desc').value=s.description||'';
    document.getElementById('f-feat').value=String(s.featured||false);
    document.getElementById('f-active').value=String(s.active!==false);
    setRecToggle(s.isRecommended||false);
    setMode(s.displayMode||'both');
    thumbDataUrl='';
    previewYt(s.youtubeId||'');
  } else {
    ['f-name','f-price','f-thumb','f-yt','f-addr','f-dist','f-phone','f-tags','f-desc'].forEach(id=>{document.getElementById(id).value='';});
    document.getElementById('f-lat').value=''; document.getElementById('f-lng').value='';
    document.getElementById('f-cat').value='마사지';
    document.getElementById('f-feat').value='false'; document.getElementById('f-active').value='true';
    setRecToggle(false);
    document.getElementById('thumbPreview').src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23222%22/%3E%3Ctext x=%2230%22 y=%2238%22 font-size=%2224%22 text-anchor=%22middle%22%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E';
    setMode('both'); thumbDataUrl='';
    document.getElementById('ytPreview').style.display='none';
  }
  document.getElementById('modalBg').classList.remove('hidden');
}
function closeModal(){document.getElementById('modalBg').classList.add('hidden');}
function bgClick(e){if(e.target===document.getElementById('modalBg'))closeModal();}

function setRecToggle(on) {
  document.getElementById('f-rec').value = String(on);
  const track = document.getElementById('rec-toggle-track');
  const thumb = document.getElementById('rec-toggle-thumb');
  const label = document.getElementById('rec-toggle-label');
  const wrap  = document.getElementById('rec-toggle-wrap');
  if (on) {
    track.style.background = '#f59e0b';
    thumb.style.left = '23px';
    label.textContent = '⭐ 추천탭 노출 중';
    label.style.color = '#fbbf24';
    wrap.style.borderColor = 'rgba(251,191,36,.4)';
    wrap.style.background  = 'rgba(251,191,36,.07)';
  } else {
    track.style.background = '#374151';
    thumb.style.left = '3px';
    label.textContent = '추천탭 미노출';
    label.style.color = '#94a3b8';
    wrap.style.borderColor = 'rgba(255,255,255,.09)';
    wrap.style.background  = 'rgba(255,255,255,.04)';
  }
}
function toggleRecInModal() {
  const cur = document.getElementById('f-rec').value === 'true';
  setRecToggle(!cur);
}

function setMode(m){
  document.getElementById('f-mode').value=m;
  ['both','feed','map'].forEach(x=>{document.getElementById('mo-'+x).className='mode-opt'+(x===m?' sel-'+x:'');});
  const isMap=m==='map';
  ['ytField'].forEach(id=>{document.getElementById(id).style.display=isMap?'none':'block';});
  ['addrField','distRow','latRow'].forEach(id=>{document.getElementById(id).style.display='block';});
}

function handleThumbFile(e){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{thumbDataUrl=ev.target.result;document.getElementById('f-thumb').value='';document.getElementById('thumbPreview').src=thumbDataUrl;};
  reader.readAsDataURL(file);
}
function updateThumbPreview(v){if(v)document.getElementById('thumbPreview').src=v;}
function previewYt(v){
  const id=v?extractYtId(v):'';
  const el=document.getElementById('ytPreview');
  if(id){el.style.display='block';document.getElementById('ytFrame').src='https://www.youtube.com/embed/'+id+'?mute=1';}
  else el.style.display='none';
}







async function geocodeAddr(){
  const addr=document.getElementById('f-addr').value.trim();
  if(!addr)return;
  const btn=document.getElementById('geoBtn'), st=document.getElementById('geoStatus');
  btn.disabled=true; btn.textContent='검색중...';
  st.style.display='block'; st.style.color='rgba(255,255,255,.4)'; st.textContent='좌표를 검색하는 중...';
  try{
    const r=await fetch('/api/geocode?query='+encodeURIComponent(addr));
    const d=await r.json();
    if(d.lat&&d.lng){
      document.getElementById('f-lat').value=d.lat;
      document.getElementById('f-lng').value=d.lng;
      if(d.district)document.getElementById('f-dist').value=d.district;
      st.style.color='#03C75A'; st.textContent='좌표 확인: '+d.lat+', '+d.lng;
    } else { st.style.color='var(--pink)'; st.textContent='주소를 찾을 수 없어요'; }
  } catch { st.style.color='var(--pink)'; st.textContent='오류가 발생했어요'; }
  btn.disabled=false; btn.innerHTML='<i class="fas fa-crosshairs"></i> 좌표찾기';
}

async function saveShop(){
  const name=document.getElementById('f-name').value.trim();
  const addr=document.getElementById('f-addr').value.trim();
  const mode=document.getElementById('f-mode').value;
  if(!name){alert('업체명을 입력해주세요');return;}
  if((mode==='both'||mode==='map')&&!addr){alert('주소를 입력해주세요');return;}
  let thumbUrl=document.getElementById('f-thumb').value.trim();
  if(thumbDataUrl){
    try{
      const ur=await fetch('/api/admin/upload-thumbnail',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:thumbDataUrl})});
      const ud=await ur.json(); if(ud.url)thumbUrl=ud.url;
    }catch{}
  }
  const body={
    name,category:document.getElementById('f-cat').value,
    priceRange:document.getElementById('f-price').value.trim(),
    thumbnail:thumbUrl,youtubeId:extractYtId(document.getElementById('f-yt').value),
    address:addr,district:document.getElementById('f-dist').value.trim(),
    phone:document.getElementById('f-phone').value.trim(),
    lat:parseFloat(document.getElementById('f-lat').value)||null,
    lng:parseFloat(document.getElementById('f-lng').value)||null,
    smartPlaceUrl:document.getElementById('f-url').value.trim(),
    tags:document.getElementById('f-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
    description:document.getElementById('f-desc').value.trim(),
    featured:document.getElementById('f-feat').value==='true',
    active:document.getElementById('f-active').value==='true',
    displayMode:mode,
    isRecommended:document.getElementById('f-rec').value==='true',
  };
  const url=editId?'/api/admin/shops/'+editId:'/api/admin/shops';
  const method=editId?'PUT':'POST';
  const r=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(r.ok){
    const saved=await r.json();
    const savedId=saved.id||editId;
    // 추천탭 상태 별도 저장
    await fetch('/api/admin/shops/'+savedId+'/recommended',{
      method:'PUT',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({isRecommended:body.isRecommended})
    });
    closeModal();await loadAll();toast(editId?'업체가 수정됐어요':'업체가 추가됐어요');
  } else alert('저장 실패: '+r.status);
}

async function copyReportLink(id, btn) {
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  try {
    const r = await fetch('/api/admin/shops/'+id+'/report-token', {method:'POST'});
    const data = await r.json();
    if (!data.token) throw new Error('no token');
    const link = location.origin + '/report/' + data.token;
    await navigator.clipboard.writeText(link);
    btn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
    btn.style.background = 'rgba(52,211,153,.15)';
    btn.style.borderColor = 'rgba(52,211,153,.3)';
    btn.style.color = '#34d399';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 2000);
  } catch(e) {
    btn.innerHTML = orig;
    btn.disabled = false;
    alert('링크 생성 실패: ' + e.message);
  }
}

async function delShop(id,name){
  if(!confirm('['+name+'] 업체를 삭제할까요?'))return;
  const r=await fetch('/api/admin/shops/'+id,{method:'DELETE'});
  if(r.ok)loadAll(); else alert('삭제 실패');
}

/* 시작 */
loadAll();
loadStats();
setInterval(() => {
  loadAll();
  if (curTab === 'stats')   loadStats();
  if (curTab === 'ranking') loadRanking();
}, 30000);
<\/script>
</body>
</html>`;
}
export {
  app as default
};
