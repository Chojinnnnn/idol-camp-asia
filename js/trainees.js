/* ============ TRAINEES, GOOGLE SHEETS, PICK'EM & PROFILE MODAL ============ */
(function() {
  "use strict";

  const bGrid = document.getElementById("bTraineeGrid");
  const gGrid = document.getElementById("gTraineeGrid");
  const pickemGrid = document.getElementById("pickemGrid");
  let votedId = null;
  try { votedId = localStorage.getItem("ica_vote"); } catch(e) {}

  function initials(name) {
    if (!name) return "";
    return name.trim().split(" ")[0].slice(0, 2).toUpperCase();
  }

  // สร้าง Modal สำหรับแสดงข้อมูลเด็กฝึก
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

    // ดึงค่า docLink และ firstPerformanceLink (รองรับตัวพิมพ์เล็ก/ใหญ่)
    const rawDocLink = (t.docLink || t.doc_link || t.DocLink || t.doc || "").trim();
    const rawFirstPerfLink = (t.firstPerformanceLink || t.first_performance_link || t.FirstPerformanceLink || t.firstPerformance || "").trim();

    // สร้างปุ่มลิงก์เอกสารและลิงก์สเตจแรก (ดีไซน์มน นุ่ม Modern Soft & Glow)
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
            <a href="${rawFirstPerfLink}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:8px; padding:8px 18px; border-radius:999px; background:${bgPill}; border:1.5px solid${borderPill}; color:${themeColor}; font-size:12.5px; font-weight:800; text-decoration:none; box-shadow:${shadowPill}; backdrop-filter:blur(6px); transition:all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);" onmouseover="this.style.transform='translateY(-2px) scale(1.02)';this.style.boxShadow='0 10px 22px -4px ${isB ? 'rgba(14, 111, 168, 0.35)' : 'rgba(232, 67, 138, 0.35)'}'" onmouseout="this.style.transform='none';this.style.boxShadow='${shadowPill}'">
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
      <div class="modal-hero" style="background:${grad}; width:100%; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; color:#fff; font-size:40px; font-weight:bold;">${avatarContent}</div>
      <div class="modal-content" style="padding:24px 26px 30px;">
        <div class="cast-role">${t.side === "B" ? "B-TRAINEE" : "G-TRAINEE"} · ${t.id || "-"}</div>
        <h2 style="margin-bottom: 4px;">${showStage}</h2>
        <div style="font-size: 13px; color: #888888; margin-bottom: 12px; font-weight: normal;">
          CV: ${t.cv || "ยังไม่ระบุ CV"}
        </div>
        
        ${linksHtml}

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

  function renderTraineeCard(t) {
    const eliminatedIds = ["G01", "G03", "G17", "G31", "G32", "G35", "B10", "B26", "B37"];
    const isEliminated = (t.status && t.status.toLowerCase() === "eliminated") || eliminatedIds.includes(t.id);
    const grad = t.side === "B" ? "linear-gradient(135deg, #67E0FF, #8FE9FF)" : "linear-gradient(135deg, #FFBDD9, #FFD6E7)";

    const avatarContent = t.image && t.image.trim() !== "" 
      ? `<img src="${t.image}" alt="${t.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` 
      : initials(t.name);

    const card = document.createElement("div");
    card.className = "trainee-card" + (isEliminated ? " eliminated" : "");
    card.innerHTML = `
      <div class="trainee-avatar" style="background:${grad};">${avatarContent}</div>
      <div class="trainee-card-body">
        <div class="trainee-name">${t.name}</div>
        <div class="trainee-no">${t.id}</div>
      </div>
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

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgJm-hdAxCRJmSqni3wlRQmZl4f74DiNMqr6c_O3a5mR913CYCpaiF_NQbWKOpAx6nNjxhC7EoIbwz/pub?gid=1490647966&single=true&output=csv";

  if (typeof Papa !== 'undefined') {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: function(results) {
        const allData = results.data.filter(row => row.id && row.id.trim() !== "");
        const TRAINEES_B = allData.filter(t => t.side === "B");
        const TRAINEES_G = allData.filter(t => t.side === "G");
        const ALL_TRAINEES = [...TRAINEES_B, ...TRAINEES_G];

        const bCount = document.getElementById("bCount");
        const gCount = document.getElementById("gCount");
        if (bCount) bCount.textContent = `${TRAINEES_B.length} คน`;
        if (gCount) gCount.textContent = `${TRAINEES_G.length} คน`;

        if (bGrid) bGrid.innerHTML = "";
        if (gGrid) gGrid.innerHTML = "";
        TRAINEES_B.forEach(t => bGrid && bGrid.appendChild(renderTraineeCard(t)));
        TRAINEES_G.forEach(t => gGrid && gGrid.appendChild(renderTraineeCard(t)));

        renderPickem(ALL_TRAINEES);
        if (typeof window.initHeroCarousel === "function") window.initHeroCarousel(TRAINEES_B, TRAINEES_G);
        if (typeof window.initRankingData === "function") window.initRankingData(ALL_TRAINEES);
      }
    });
  }
})();
