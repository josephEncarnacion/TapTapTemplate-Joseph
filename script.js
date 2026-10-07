/* ===== PROFILES — add more people here; each is reachable at #/card/<slug> ===== */
const PROFILES = {
  "joseph-encarnacion": {
    name: "Joseph Encarnacion",
    first: "Joseph",
    last: "Encarnacion",
    title: "Software Engineer",
    company: "SmartCard Technik Inc.",
    bio: "Building reliable software and digital solutions.",
    phone: "+639935654878",
    email: "josephencarnacion62@gmail.com",
    website: "https://josephenc.onrender.com",
    address: "Marikina City, Philippines",
    photo: "",
    cover: "",
    social: {
      facebook: "https://facebook.com/josephencarnacion",
      instagram: "https://instagram.com/josephencarnacion",
      linkedin: "https://linkedin.com/in/josephencarnacion",
      tiktok: "https://tiktok.com/@josephencarnacion",
      whatsapp: "https://wa.me/639171234567",
      messenger: "https://m.me/josephencarnacion",
    },
  },
};
const DEFAULT = "joseph-encarnacion";
const SOC = {
  facebook: ["Facebook", "#1877f2", "f"],
  instagram: [
    "Instagram",
    "linear-gradient(45deg,#f9a03f,#e1306c,#833ab4)",
    "◎",
  ],
  linkedin: ["LinkedIn", "#0a66c2", "in"],
  tiktok: ["TikTok", "#111", "♪"],
  twitter: ["X / Twitter", "#000", "𝕏"],
  youtube: ["YouTube", "#ff0000", "▶"],
  whatsapp: ["WhatsApp", "#25d366", "✆"],
  messenger: [
    "Messenger",
    "linear-gradient(135deg,#00b2ff,#a334fa)",
    "✉",
  ],
  telegram: ["Telegram", "#229ed9", "➤"],
};
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s).replace(
      /[&<>\"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
function slug() {
  const m = (location.hash || location.pathname).match(/card\/([\w-]+)/);
  return m ? m[1] : DEFAULT;
}
let P, URLC;
function toast(t, ok = true) {
  const e = $("#toast");
  e.textContent = t;
  e.style.background = ok ? "#16a34a" : "#dc2626";
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("show"), 3200);
}
function render() {
  const s = slug();
  P = PROFILES[s];
  if (!P) {
    $("#app").innerHTML =
      '<div class="nf"><h2>Card not found</h2><p>No profile exists for “' +
      esc(s) +
      "”.</p></div>";
    return;
  }
  URLC = location.href.split("#")[0] + "#/card/" + s;
  document.title = P.name + " – Digital Card";
  const ini = P.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const phone = P.phone.replace(/[^\d+]/g, "");
  const maps =
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(P.address);
  const soc = Object.keys(SOC)
    .filter((k) => P.social && P.social[k])
    .map(
      (k) =>
        `<a href="${esc(P.social[k])}" target="_blank" rel="noopener"><b style="background:${SOC[k][1]}">${SOC[k][2]}</b>${SOC[k][0]}</a>`,
    )
    .join("");
  $("#app").innerHTML = `
  <section class="card"><div class="cover" ${P.cover ? `style="background-image:url('${esc(P.cover)}')"` : ""}></div>
   <div class="hero"><div class="avatar">${P.photo ? `<img src="${esc(P.photo)}" alt="${esc(P.name)}">` : esc(ini)}</div>
    <h1>${esc(P.name)}</h1><div class="role">${esc(P.title)}</div><div class="co">${esc(P.company)}</div>
    <p class="bio">“${esc(P.bio)}”</p>
    <div class="info"><span>📞 ${esc(P.phone)}</span><span>✉️ ${esc(P.email)}</span><span>🌐 ${esc(P.website.replace(/^https?:\/\//, ""))}</span><span>📍 ${esc(P.address)}</span></div>
    <button class="primary" id="save">＋ Save Contact</button></div></section>
  <section class="card sec"><h2>Quick Actions</h2><div class="grid">
   <a class="btn act" href="tel:${phone}"><i>📞</i>Call</a>
   <a class="btn act" href="mailto:${esc(P.email)}"><i>✉️</i>Email</a>
   <a class="btn act" href="sms:${phone}"><i>💬</i>Message</a>
   <a class="btn act" href="${esc(P.website)}" target="_blank" rel="noopener"><i>🌐</i>Website</a>
   <a class="btn act" href="${maps}" target="_blank" rel="noopener"><i>📍</i>Get Directions</a></div></section>
  ${soc ? `<section class="card sec"><h2>Connect With Me</h2><div class="soc">${soc}</div></section>` : ""}
  <section class="card sec"><h2>Share Card</h2><div class="row"><button class="sec2 share" id="share">↗ Share Card</button><button class="sec2" id="qr">▦ QR Code</button></div></section>`;
  $("#save").onclick = saveVcf;
  $("#share").onclick = doShare;
  $("#qr").onclick = openQR;
}
/* ---- vCard ---- */
const vesc = (s) =>
  String(s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
function vcard() {
  return (
    [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${vesc(P.last)};${vesc(P.first)};;;`,
      `FN:${vesc(P.name)}`,
      `ORG:${vesc(P.company)}`,
      `TITLE:${vesc(P.title)}`,
      `TEL;TYPE=CELL,VOICE:${P.phone}`,
      `EMAIL;TYPE=INTERNET,WORK:${P.email}`,
      `URL:${P.website}`,
      `ADR;TYPE=WORK:;;${vesc(P.address)};;;;`,
      `NOTE:${vesc(P.bio)}`,
      "END:VCARD",
    ].join("\r\n") + "\r\n"
  );
}
async function saveVcf() {
  const fn = slug() + ".vcf",
    blob = new Blob([vcard()], { type: "text/vcard;charset=utf-8" });
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fn;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {}
  try {
    const d = window.claude && (await claude.use("downloads"));
    if (d) {
      await d.save({ filename: fn, data: blob });
    }
  } catch (e) {
    if (e && e.code === "declined") return;
    if (e && /extension/.test(e.code || "")) {
      try {
        await navigator.clipboard.writeText(vcard());
        toast("Contact copied as vCard text — paste into a .vcf file");
        return;
      } catch (_) {}
    }
  }
  toast(
    "✓ Contact file generated — open it to save " +
      P.first +
      " to your contacts",
  );
}
/* ---- share ---- */
function open(id) {
  $(id).classList.add("open");
}
document.addEventListener("click", (e) => {
  if (
    e.target.dataset.close !== undefined ||
    e.target.classList.contains("modal")
  )
    document
      .querySelectorAll(".modal")
      .forEach((m) => m.classList.remove("open"));
});
async function doShare() {
  const text = `Check out ${P.name}'s digital business card.`;
  if (navigator.share) {
    try {
      await navigator.share({ title: P.name, text, url: URLC });
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  const u = encodeURIComponent(URLC),
    t = encodeURIComponent(text);
  const opts = [
    ["🔗 Copy Link", () => copy()],
    ["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + u],
    [
      "Messenger",
      "https://www.facebook.com/dialog/send?link=" +
        u +
        "&redirect_uri=" +
        u +
        "&app_id=966242223397117",
    ],
    ["WhatsApp", "https://wa.me/?text=" + t + "%20" + u],
    ["✉️ Email", "mailto:?subject=" + t + "&body=" + t + "%20" + u],
  ];
  $("#shUrl").textContent = URLC;
  $("#shOpts").innerHTML = "";
  opts.forEach(([l, a]) => {
    const el = document.createElement(
      typeof a === "string" ? "a" : "button",
    );
    el.className = "btn act";
    el.style.fontSize = "14px";
    el.textContent = l;
    if (typeof a === "string") {
      el.href = a;
      el.target = "_blank";
      el.rel = "noopener";
    } else el.onclick = a;
    $("#shOpts").appendChild(el);
  });
  open("#shareM");
}
async function copy() {
  try {
    await navigator.clipboard.writeText(URLC);
  } catch (e) {
    const t = document.createElement("textarea");
    t.value = URLC;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
  }
  toast("✓ Link copied to clipboard");
}
/* ---- QR ---- */
function openQR() {
  const q = qrcode(0, "M");
  q.addData(URLC);
  q.make();
  const n = q.getModuleCount(),
    px = 10,
    m = 3,
    S = (n + m * 2) * px,
    c = $("#qrC");
  c.width = c.height = S;
  const x = c.getContext("2d");
  x.fillStyle = "#fff";
  x.fillRect(0, 0, S, S);
  x.fillStyle = "#0f172a";
  for (let r = 0; r < n; r++)
    for (let k = 0; k < n; k++)
      if (q.isDark(r, k)) x.fillRect((k + m) * px, (r + m) * px, px, px);
  open("#qrM");
}
$("#qrDl").onclick = async () => {
  const c = $("#qrC"),
    fn = slug() + "-qr.png";
  const blob = await new Promise((r) => c.toBlob(r, "image/png"));
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fn;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {}
  try {
    const d = window.claude && (await claude.use("downloads"));
    if (d) await d.save({ filename: fn, data: blob });
  } catch (e) {
    if (e && e.code === "declined") return;
  }
  toast("✓ QR code PNG ready");
};
addEventListener("hashchange", render);
render();
