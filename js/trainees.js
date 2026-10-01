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

    modalBody.innerHTML = `
      <div class="modal-hero" style="background:${grad}; width:100%; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; color:#fff; font-size:40px; font-weight:bold;">${avatarContent}</div>
      <div class="modal-content" style="padding:24px 26px 30px;">
        <div class="cast-role">${t.side === "B" ? "B-TRAINEE" : "G-TRAINEE"} · ${t.id || "-"}</div>
        <h2 style="margin-bottom: 4px;">${showStage}</h2>
        <div style="font-size: 13px; color: #888888; margin-bottom: 12px; font-weight: normal;">
          CV: ${t.cv || "ยังไม่ระบุ CV"}
        </div>
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