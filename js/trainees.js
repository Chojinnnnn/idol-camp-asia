/* ============ TRAINEES, GOOGLE SHEETS, PICK'EM, GRADE & PROFILE MODAL ============ */
(function() {
  "use strict";

  const bGrid = document.getElementById("bTraineeGrid");
  const gGrid = document.getElementById("gTraineeGrid");
  const pickemGrid = document.getElementById("pickemGrid");
  let votedId = null;
  try { votedId = localStorage.getItem("ica_vote"); } catch(e) {}

  /* ---------- CONFIG ---------- */
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgJm-hdAxCRJmSqni3wlRQmZl4f74DiNMqr6c_O3a5mR913CYCpaiF_NQbWKOpAx6nNjxhC7EoIbwz/pub?gid=1490647966&single=true&output=csv";

  // ⚠️ ใส่ลิงก์ CSV ของชีต "Grade" ตรงนี้ (File > Share > Publish to web > เลือกแท็บ Grade > CSV)
  // ชีต Grade ต้องมีคอลัมน์ id และ grade (A/B/C/D)
  const GRADE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgJm-hdAxCRJmSqni3wlRQmZl4f74DiNMqr6c_O3a5mR913CYCpaiF_NQbWKOpAx6nNjxhC7EoIbwz/pub?gid=PUT_GRADE_GID_HERE&single=true&output=csv";

  // A ชมพู · B ฟ้า · C เหลือง · D เขียว
  const GRADE_ORDER = ["A", "B", "C", "D"];
  const GRADE_STYLE = {
    A: { main: "#E8438A", soft: "#FFE3EE", grad: "linear-gradient(135deg, #FF8FBF, #E8438A)", glow: "rgba(232, 67, 138, 0.45)", dark: "#A3135A", avatar: "linear-gradient(135deg, #FFB3D1, #FF8FBF)" },
    B: { main: "#0E6FA8", soft: "#DDF3FF", grad: "linear-gradient(135deg, #67E0FF, #0E8BD0)", glow: "rgba(14, 139, 208, 0.45)", dark: "#08497A", avatar: "linear-gradient(135deg, #8FE3FF, #4FC9F5)" },
    C: { main: "#B98200", soft: "#FFF4C7", grad: "linear-gradient(135deg, #FFE066, #F2B705)", glow: "rgba(242, 183, 5, 0.5)", dark: "#7A5600", avatar: "linear-gradient(135deg, #FFEB8A, #FFD23F)" },
    D: { main: "#23915A", soft: "#DCF7E6", grad: "linear-gradient(135deg, #7BE3A5, #2FB36E)", glow: "rgba(47, 179, 110, 0.45)", dark: "#106B3F", avatar: "linear-gradient(135deg, #A6EEC3, #5FD592)" }
  };

  function normGrade(v) {
    const g = String(v || "").trim().toUpperCase().charAt(0);
    return GRADE_ORDER.includes(g) ? g : "";
  }

  // วงกลมเกรดสีไล่เฉด
  function gradeBadge(grade, size, extraStyle) {
    const g = normGrade(grade);
    if (!g) return "";
    const s = GRADE_STYLE[g];
    const fs = Math.round(size * 0.5);
    return `<span class="grade-badge" title="Grade ${g}" style="width:${size}px; height:${size}px; border-radius:50%; background:${s.grad}; color:${g === "C" ? "#5A4200" : "#fff"}; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:${fs}px; line-height:1; border:2px solid #fff; box-shadow:0 4px 12px -2px ${s.glow}; ${extraStyle || ""}">${g}</span>`;
  }

  function initials(name) {
    if (!name) return "";
    return name.trim().split(" ")[0].slice(0, 2).toUpperCase();
  }

  /* ---------- MODAL ---------- */
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  function buildRankGraphSVG(stages){
    const w = 400, h = 130;
    const padX = 30, padTop = 26, padBottom = 24;
    const plotW = w - padX * 2;
    const plotH = h - padTop - padBottom;
    const n = stages.length;
    const stepX = n > 1 ? plotW / (n - 1) : 0;

    const validRanks = stages.map(s => s.rank).filter(r => r > 0);
    const minRank = 1;
    const maxRank = validRanks.length ? Math.max(...validRanks, 5) : 10;

    function yFor(rank){
      if(!rank) return padTop + plotH;
      if(maxRank === minRank) return padTop + plotH / 2;
      return padTop + ((rank - minRank) / (maxRank - minRank)) * plotH;
    }

    const points = stages.map((s) => ({
      x: padX + stages.indexOf(s) * stepX,
      y: yFor(s.rank),
      rank: s.rank,
      label: s.label.split(" ")[0]
    }));

    const validPoints = points.filter(p => p.rank > 0);
    const polylinePts = validPoints.map(p => `${p.x},${p.y}`).join(" ");

    const marksSVG = points.map(p => {
      const hasData = p.rank > 0;
      const labelY = p.y < padTop + 16 ? p.y + 18 : p.y - 12;
      return `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="${hasData ? 'var(--pink-deep)' : 'var(--border)'}" stroke="var(--surface-2)" stroke-width="2"/>
        <text x="${p.x}" y="${labelY}" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--pink-deep)">${hasData ? p.rank : '-'}</text>
        <text x="${p.x}" y="${h - 6}" text-anchor="middle" font-size="10" fill="var(--text-soft)">${p.label}</text>
      `;
    }).join("");

    const polylineSVG = validPoints.length > 1
      ? `<polyline points="${polylinePts}" fill="none" stroke="var(--pink-deep)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`
      : "";

    return `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:130px; display:block; overflow:visible;">
        ${polylineSVG}
        ${marksSVG}
      </svg>
    `;
  }

  // ป้ายเกรดเล็กๆ ต่อท้ายบรรทัด "G-TRAINEE · G__"
  function gradeChip(grade) {
    const g = normGrade(grade);
    if (!g) return "";
    const st = GRADE_STYLE[g];
    return ` · <span style="display:inline-block; vertical-align:middle; padding:2px 11px; border-radius:999px; background:${st.soft}; color:${st.dark}; border:1px solid ${st.main}66; font-size:11px; font-weight:800; letter-spacing:.4px; line-height:1.6; box-shadow:0 3px 8px -2px ${st.glow};">Grade ${g}</span>`;
  }

  // การ์ดผลการประเมิน วางใต้ปุ่ม Google Doc / FIRST STAGE พื้นหลังตามสีเกรด
  function gradeResultCard(grade) {
    const g = normGrade(grade);
    if (!g) return "";
    const s = GRADE_STYLE[g];
    const txt = g === "C" ? "#5A4200" : "#FFFFFF";
    const sub = g === "C" ? "rgba(90, 66, 0, 0.75)" : "rgba(255, 255, 255, 0.85)";
    return `
      <div class="grade-result" style="position:relative; overflow:hidden; display:flex; align-items:center; gap:16px; margin-top:-6px; margin-bottom:20px; padding:14px 20px; border-radius:16px; background:${s.grad}; color:${txt}; box-shadow:0 10px 24px -8px ${s.glow};">
        <span style="position:relative; flex-shrink:0; width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,${g === "C" ? "0.55" : "0.25"}); border:2px solid rgba(255,255,255,0.7); display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; line-height:1;">${g}</span>
        <span style="position:relative; display:flex; flex-direction:column; gap:2px;">
          <span style="font-size:11.5px; font-weight:700; letter-spacing:1.2px; color:${sub};">ผลการประเมิน</span>
          <span style="font-size:20px; font-weight:800; letter-spacing:.5px; line-height:1.2;">Grade ${g}</span>
        </span>
      </div>
    `;
  }

  window.openProfileModal = function(t) {
    if(!modalBody || !modalBackdrop) return;
    const grad = t.side === "B" ? "linear-gradient(135deg, #67E0FF, #8FE9FF)" : "linear-gradient(135deg, #FFBDD9, #FFD6E7)";
    const themeColor = t.side === "B" ? "var(--blue-deep, #0E6FA8)" : "var(--pink-deep, #E8438A)";
    const safeName = t.name || "ไม่ระบุชื่อ";
    const safeStage = t.stageName || "";
    const showStage = (safeStage.trim() && safeStage.trim() !== safeName.trim())
                      ? `${safeName} / <span style="color:${t.side === "B" ? "var(--blue-deep)" : "var(--pink-deep)"};">${safeStage}</span>`
                      : safeName;

    const avatarContent = t.image && t.image.trim() !== ""
      ? `<img src="${t.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
      : initials(safeName);

    const stages = [
      { label: "【FIRST STAGE】", rank: parseInt(t.rankFirst) || 0 },
      { label: "【SECOND STAGE】", rank: parseInt(t.rankSecond) || 0 },
      { label: "【THIRD STAGE】", rank: parseInt(t.rankThird) || 0 },
      { label: "【FINAL】", rank: parseInt(t.rankFinal) || 0 }
    ];

    const rawDocLink = (t.docLink || t.doc_link || t.DocLink || t.doc || "").trim();
    const rawFirstPerfLink = (t.firstPerformanceLink || t.first_performance_link || t.FirstPerformanceLink || t.firstPerformance || "").trim();

    let linksHtml = "";
    if (rawDocLink || rawFirstPerfLink) {
      const isB = (t.side === "B");
      const bgPill = isB
        ? "linear-gradient(135deg, rgba(232, 247, 253, 0.9) 0%, rgba(178, 238, 255, 0.45) 100%)"
        : "linear-gradient(135deg, rgba(255, 240, 246, 0.9) 0%, rgba(255, 214, 231, 0.5) 100%)";
      const borderPill = isB ? "rgba(14, 111, 168, 0.3)" : "rgba(232, 67, 138, 0.3)";
      const shadowPill = isB ? "0 6px 18px -4px rgba(14, 111, 168, 0.2)" : "0 6px 18px -4px rgba(232, 67, 138, 0.2)";

      linksHtml = `
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; margin-bottom:20px;">
          ${rawDocLink ? `
            <a href="${rawDocLink}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:999px; background:#FFFFFF; border:1.5px solid rgba(82, 107, 125, 0.18); color:var(--text-strong, #173447); font-size:12.5px; font-weight:700; text-decoration:none; box-shadow:0 4px 12px -3px rgba(0,0,0,0.06); transition:all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);" onmouseover="this.style.borderColor='${themeColor}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 18px -4px rgba(0,0,0,0.1)'" onmouseout="this.style.borderColor='rgba(82, 107, 125, 0.18)';this.style.transform='none';this.style.boxShadow='0 4px 12px -3px rgba(0,0,0,0.06)'">
              <span style="width:24px; height:24px; border-radius:50%; background:rgba(82, 107, 125, 0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v6h6v10H6z"/></svg>
              </span>
              Google Doc
            </a>
          ` : ""}
          ${rawFirstPerfLink ? `
            <a href="${rawFirstPerfLink}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:8px; padding:8px 18px; border-radius:999px; background:${bgPill}; border:1.5px solid ${borderPill}; color:${themeColor}; font-size:12.5px; font-weight:800; text-decoration:none; box-shadow:${shadowPill}; backdrop-filter:blur(6px); transition:all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);" onmouseover="this.style.transform='translateY(-2px) scale(1.02)';this.style.boxShadow='0 10px 22px -4px ${isB ? 'rgba(14, 111, 168, 0.35)' : 'rgba(232, 67, 138, 0.35)'}'" onmouseout="this.style.transform='none';this.style.boxShadow='${shadowPill}'">
              <span style="width:24px; height:24px; border-radius:50%; background:${themeColor}; color:#FFFFFF; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 6px ${isB ? 'rgba(14, 111, 168, 0.3)' : 'rgba(232, 67, 138, 0.3)'};">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
              รับชมคลิป FIRST STAGE
            </a>
          ` : ""}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="modal-hero" style="position:relative; background:${grad}; width:100%; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; color:#fff; font-size:40px; font-weight:bold;">
        ${avatarContent}
      </div>
      <div class="modal-content" style="padding:24px 26px 30px;">
        <div class="cast-role">${t.side === "B" ? "B-TRAINEE" : "G-TRAINEE"} · ${t.id || "-"}${gradeChip(t.grade)}</div>
        <h2 style="margin-bottom: 4px;">${showStage}</h2>
        <div style="font-size: 13px; color: #888888; margin-bottom: 12px; font-weight: normal;">
          CV: ${t.cv || "ยังไม่ระบุ CV"}
        </div>

        ${linksHtml}
        ${gradeResultCard(t.grade)}

        <div class="modal-meta" style="display:grid; grid-template-columns:1fr 1fr; gap:10px 16px; margin-bottom:18px;">
          <div style="background:var(--surface); border-radius:10px; padding:10px 12px;"><span>ตำแหน่ง</span><br><b>${t.position || "-"}</b></div>
          <div style="background:var(--surface); border-radius:10px; padding:10px 12px;"><span>วันเกิด</span><br><b>${t.birth || "รอระบุ"}</b></div>
          <div style="background:var(--surface); border-radius:10px; padding:10px 12px;"><span>ภูมิลำเนา</span><br><b>${t.hometown || "-"}</b></div>
          <div style="background:var(--surface); border-radius:10px; padding:10px 12px;"><span>ส่วนสูง (ซม.)</span><br><b>${t.height || "-"}</b></div>
        </div>
        <p class="bio" style="font-size:13.5px; line-height:1.8; color:var(--text-soft);">${t.intro || ""}</p>

        <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px;">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--text-strong);">Rank Graph</h4>
          <div style="background: var(--surface-2); padding: 12px 6px; border-radius: 8px; border: 1px solid var(--border);">
            ${buildRankGraphSVG(stages)}
          </div>
        </div>
      </div>
    `;
    modalBackdrop.classList.add("open");
  };

  if(modalClose){
    modalClose.addEventListener("click", ()=> modalBackdrop.classList.remove("open"));
  }
  if(modalBackdrop){
    modalBackdrop.addEventListener("click", (e)=>{
      if(e.target === modalBackdrop) modalBackdrop.classList.remove("open");
    });
  }

  /* ---------- CARDS ---------- */
  function renderTraineeCard(t, showGrade) {
    const eliminatedIds = ["G01", "G03", "G17", "G31", "G32", "G35", "B10", "B26", "B37"];
    const isEliminated = (t.status && t.status.toLowerCase() === "eliminated") || eliminatedIds.includes(t.id);
    const grad = t.side === "B" ? "linear-gradient(135deg, #67E0FF, #8FE9FF)" : "linear-gradient(135deg, #FFBDD9, #FFD6E7)";
    const gs = showGrade ? GRADE_STYLE[normGrade(t.grade)] : null;
    const avatarBg = gs ? gs.avatar : grad;

    const avatarContent = t.image && t.image.trim() !== ""
      ? `<img src="${t.image}" alt="${t.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
      : initials(t.name);

    const card = document.createElement("div");
    card.className = "trainee-card" + (isEliminated ? " eliminated" : "");
    if (showGrade) card.style.position = "relative";
    card.innerHTML = `
      <div class="trainee-avatar" style="background:${avatarBg};">${avatarContent}</div>
      <div class="trainee-card-body">
        <div class="trainee-name">${t.name}</div>
        <div class="trainee-no">${t.id}</div>
      </div>
      ${showGrade ? gradeBadge(t.grade, 26, "position:absolute; top:8px; left:8px; z-index:5; pointer-events:none;") : ""}
    `;
    card.addEventListener("click", () => window.openProfileModal(t));
    return card;
  }

  function renderPickem(trainees) {
    if (!pickemGrid) return;
    pickemGrid.innerHTML = "";
    trainees.forEach(t => {
      const grad = t.side === "B" ? "linear-gradient(135deg, #67E0FF, #8FE9FF)" : "linear-gradient(135deg, #FFBDD9, #FFD6E7)";
      const avatar = t.image && t.image.trim() !== ""
        ? `<img src="${t.image}" alt="${t.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
        : initials(t.name);

      const card = document.createElement("div");
      card.className = "pickem-card" + (votedId === t.id ? " voted" : "");
      const baseVotes = parseInt(t.votes) || 0;
      card.innerHTML = `
        <div class="trainee-avatar" style="background:${grad};">${avatar}</div>
        <div class="pickem-card-body">
          <div class="trainee-name">${t.name}</div>
          <div class="vote-count">${baseVotes + (votedId === t.id ? 1 : 0)} โหวต</div>
        </div>
      `;
      card.addEventListener("click", () => {
        if (votedId === t.id) return;
        votedId = t.id;
        try { localStorage.setItem("ica_vote", votedId); } catch(e) {}
        renderPickem(trainees);
      });
      pickemGrid.appendChild(card);
    });
  }

  /* ---------- SORT BAR (Dropdown + Legend) ---------- */
  function idNum(id) { return parseInt(String(id || "").replace(/\D/g, "")) || 0; }
  function byId(a, b) { return idNum(a.id) - idNum(b.id) || String(a.id).localeCompare(String(b.id)); }
  function gradeRank(t) {
    const i = GRADE_ORDER.indexOf(normGrade(t.grade));
    return i === -1 ? 99 : i; // ไม่มีเกรดไว้ท้ายสุด
  }
  function sortTrainees(list, mode) {
    const arr = [...list];
    if (mode === "grade") arr.sort((a, b) => gradeRank(a) - gradeRank(b) || byId(a, b));
    else arr.sort(byId);
    return arr;
  }

  function buildSortControl(onChange) {
    const wrap = document.createElement("label");
    wrap.id = "traineeSortBar";
    wrap.style.cssText = "display:inline-flex; align-items:center; gap:8px; flex-shrink:0; margin:0;";
    wrap.innerHTML = `
      <span style="font-size:11px; font-weight:700; letter-spacing:1.4px; color:var(--text-soft, #6B8294); text-transform:uppercase; opacity:.85;">Sort</span>
      <select id="traineeSortSelect" aria-label="Sort" style="appearance:none; -webkit-appearance:none; padding:5px 26px 5px 12px; border-radius:999px; border:1px solid var(--border, rgba(82,107,125,0.25)); background:rgba(255,255,255,0.55) url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 24 24%22><path fill=%22%238A9BA8%22 d=%22M7 10l5 5 5-5z%22/></svg>') no-repeat right 9px center; color:var(--text-soft, #6B8294); font-weight:600; font-size:12px; font-family:inherit; cursor:pointer; outline:none; transition:border-color .2s, color .2s;">
        <option value="id">ID</option>
        <option value="grade">Grade</option>
      </select>
    `;
    const sel = wrap.querySelector("select");
    const on = () => { sel.style.borderColor = "var(--pink-deep, #E8438A)"; sel.style.color = "var(--pink-deep, #E8438A)"; };
    const off = () => { if (document.activeElement !== sel) { sel.style.borderColor = ""; sel.style.color = ""; sel.style.borderColor = "var(--border, rgba(82,107,125,0.25))"; sel.style.color = "var(--text-soft, #6B8294)"; } };
    sel.addEventListener("mouseenter", on);
    sel.addEventListener("mouseleave", off);
    sel.addEventListener("focus", on);
    sel.addEventListener("blur", off);
    sel.addEventListener("change", e => { onChange(e.target.value); sel.blur(); });
    return wrap;
  }

  // หาหัวข้อ "TRAINEES" แล้ววาง dropdown ไว้ด้านซ้าย
  function findTraineesHeading() {
    const isMatch = el => /^\s*trainees\s*$/i.test(el.textContent || "");
    const before = el => bGrid && (el.compareDocumentPosition(bGrid) & Node.DOCUMENT_POSITION_FOLLOWING);
    const selectors = ["h1,h2,h3,h4", "[class*='title'],[class*='heading']"];
    for (const sel of selectors) {
      const list = [...document.querySelectorAll(sel)].filter(el => isMatch(el) && before(el));
      const deepest = list.filter(el => !list.some(o => o !== el && el.contains(o)));
      if (deepest.length) return deepest[deepest.length - 1];
    }
    return null;
  }

  function mountSortControl(ctrl) {
    const host = document.getElementById("traineeSortHost"); // กำหนดตำแหน่งเองได้ด้วย <div id="traineeSortHost"></div>
    if (host) { host.appendChild(ctrl); return; }

    const heading = findTraineesHeading();
    if (heading && heading.parentNode) {
      const row = document.createElement("div");
      const center = getComputedStyle(heading).textAlign === "center";
      if (center) {
        // หัวข้ออยู่กลาง -> dropdown ชิดขวาสุดของแถว
        row.style.cssText = "position:relative; display:flex; align-items:center; justify-content:center; width:100%;";
        ctrl.style.cssText += "position:absolute; right:0; top:50%; transform:translateY(-50%);";
      } else {
        row.style.cssText = "display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; width:100%;";
      }
      heading.parentNode.insertBefore(row, heading);
      row.appendChild(heading);
      row.appendChild(ctrl);
      return;
    }
    // fallback: วางไว้เหนือกริด
    if (bGrid && bGrid.parentNode) {
      ctrl.style.margin = "0 0 14px";
      bGrid.parentNode.insertBefore(ctrl, bGrid);
    }
  }

  /* ---------- DATA LOADING ---------- */
  function fetchCSV(url) {
    return new Promise(resolve => {
      Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: r => resolve(r.data || []),
        error: () => resolve([])
      });
    });
  }

  // อ่านค่าจากแถวโดยไม่สนตัวพิมพ์เล็ก/ใหญ่ของหัวคอลัมน์
  function pick(row, names) {
    for (const k of Object.keys(row)) {
      if (names.includes(k.trim().toLowerCase())) return row[k];
    }
    return "";
  }

  function buildGradeMap(rows) {
    const map = {};
    rows.forEach(r => {
      const id = String(pick(r, ["id", "รหัส"])).trim();
      const g = normGrade(pick(r, ["grade", "เกรด"]));
      if (id && g) map[id] = g;
    });
    return map;
  }

  if (typeof Papa !== 'undefined') {
    const gradeConfigured = GRADE_CSV_URL && !GRADE_CSV_URL.includes("PUT_GRADE_GID_HERE");

    Promise.all([
      fetchCSV(SHEET_CSV_URL),
      gradeConfigured ? fetchCSV(GRADE_CSV_URL) : Promise.resolve([])
    ]).then(([rows, gradeRows]) => {
      const gradeMap = buildGradeMap(gradeRows);

      const allData = rows
        .filter(row => row.id && row.id.trim() !== "")
        .map(row => Object.assign(row, { grade: gradeMap[row.id.trim()] || normGrade(row.grade) }));

      const TRAINEES_B = allData.filter(t => t.side === "B");
      const TRAINEES_G = allData.filter(t => t.side === "G");
      const ALL_TRAINEES = [...TRAINEES_B, ...TRAINEES_G];

      const bCount = document.getElementById("bCount");
      const gCount = document.getElementById("gCount");
      if (bCount) bCount.textContent = `${TRAINEES_B.length} คน`;
      if (gCount) gCount.textContent = `${TRAINEES_G.length} คน`;

      function renderGrids(mode) {
        const showGrade = mode === "grade";
        if (bGrid) { bGrid.innerHTML = ""; sortTrainees(TRAINEES_B, mode).forEach(t => bGrid.appendChild(renderTraineeCard(t, showGrade))); }
        if (gGrid) { gGrid.innerHTML = ""; sortTrainees(TRAINEES_G, mode).forEach(t => gGrid.appendChild(renderTraineeCard(t, showGrade))); }
      }

      mountSortControl(buildSortControl(renderGrids));
      renderGrids("id");

      renderPickem(ALL_TRAINEES);
      if (typeof window.initHeroCarousel === "function") window.initHeroCarousel(TRAINEES_B, TRAINEES_G);
      if (typeof window.initRankingData === "function") window.initRankingData(ALL_TRAINEES);
    });
  }
})();
