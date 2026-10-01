/* ============ BATTLE DROPDOWN, STAGES & DYNAMIC CSV RENDERER ============ */
(function() {
  "use strict";

  const battleDropdownWrap = document.getElementById("battleDropdownWrap");
  const firstStageContainer = document.getElementById("firstStageContainer");
  const secondStageContainer = document.getElementById("secondStageContainer");
  const sideBtns = document.querySelectorAll(".side-btn");
  const teamGrid = document.getElementById("teamGrid");

  // URLs for Google Sheets Publish to Web (CSV) - เชื่อมต่อแบบดึงสดจาก Entire Document
  const BASE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgJm-hdAxCRJmSqni3wlRQmZl4f74DiNMqr6c_O3a5mR913CYCpaiF_NQbWKOpAx6nNjxhC7EoIbwz/pub";
  
  const PROFILE_CSV_URL = `${BASE_SHEET_URL}?gid=1490647966&single=true&output=csv&t=${Date.now()}`;
  const ROUND_1_CSV_URL = `${BASE_SHEET_URL}?gid=706975684&single=true&output=csv&t=${Date.now()}`;
  const ROUND_2_CSV_URL = `${BASE_SHEET_URL}?gid=2088552587&single=true&output=csv&t=${Date.now()}`;
  
  // Fallbacks if offline / local testing
  const PROFILE_CSV_FALLBACK = "IDOL_CAMP_COMMU_Profile.csv";
  const ROUND_1_CSV_FALLBACK = "Sheet_Round_1_IDOL_CAMP_COMMU.csv";

  // TEMPLATE สำรองสำหรับ ROUND 2 (24 เพลง ไม่มีอีโมจิ)
  const ROUND_2_DEFAULT_TEMPLATE = [
    // B-Trainees
    { side: "B", team_size: 2, song_title: "ซ่อน (ไม่) หา", trainee_ids: "" },
    { side: "B", team_size: 2, song_title: "Cry", trainee_ids: "" },
    { side: "B", team_size: 3, song_title: "LIAR", trainee_ids: "" },
    { side: "B", team_size: 3, song_title: "IRREGULAR", trainee_ids: "" },
    { side: "B", team_size: 3, song_title: "Star Mine", trainee_ids: "" },
    { side: "B", team_size: 3, song_title: "I don’t care", trainee_ids: "" },
    { side: "B", team_size: 3, song_title: "Your Idol", trainee_ids: "" },
    { side: "B", team_size: 3, song_title: "Secret Song ???? (1)", trainee_ids: "" },
    { side: "B", team_size: 3, song_title: "Secret Song ???? (2)", trainee_ids: "" },
    { side: "B", team_size: 4, song_title: "Bling-Bang-Bang-Born", trainee_ids: "" },
    { side: "B", team_size: 4, song_title: "Who Is The Real MVP", trainee_ids: "" },
    { side: "B", team_size: 4, song_title: "Wolf", trainee_ids: "" },
    // G-Trainees
    { side: "G", team_size: 2, song_title: "First Love", trainee_ids: "" },
    { side: "G", team_size: 2, song_title: "Holmes", trainee_ids: "" },
    { side: "G", team_size: 2, song_title: "Good Enough", trainee_ids: "" },
    { side: "G", team_size: 2, song_title: "Secret Song ????", trainee_ids: "" },
    { side: "G", team_size: 3, song_title: "CHOP CHOP", trainee_ids: "" },
    { side: "G", team_size: 3, song_title: "มอญซ่อนผ้า (Hidden Love)", trainee_ids: "" },
    { side: "G", team_size: 3, song_title: "Really Like You", trainee_ids: "" },
    { side: "G", team_size: 3, song_title: "DICE", trainee_ids: "" },
    { side: "G", team_size: 3, song_title: "How It’s Done", trainee_ids: "" },
    { side: "G", team_size: 3, song_title: "Secret Song ????", trainee_ids: "" },
    { side: "G", team_size: 4, song_title: "ROSE", trainee_ids: "" },
    { side: "G", team_size: 4, song_title: "Single Eyelid Girl", trainee_ids: "" }
  ];

  // ===== สไตล์ของ First Stage และ Second Stage =====
  const FS_STYLE_ID = "battle-stages-style";
  if (!document.getElementById(FS_STYLE_ID)) {
    const styleEl = document.createElement("style");
    styleEl.id = FS_STYLE_ID;
    styleEl.textContent = `
/* =====================================================================
   BATTLE STAGES · MODERN SOFT THEME
   ===================================================================== */
#firstStageContainer, #secondStageContainer {
  --b-main: #0E6FA8;
  --b-mid:  #67E0FF;
  --b-soft: #E3F6FD;
  --g-main: #E8438A;
  --g-mid:  #FFBDD9;
  --g-soft: #FFE9F3;
  --ink:    #173447;
  --ink-soft: #6B8294;
  --card:   #FFFFFF;
  --line:   rgba(23, 52, 71, 0.08);
}

.fs-wrap, .s2-wrap {
  display: flex; flex-direction: column; gap: 24px;
  max-width: 1080px; margin: 0 auto; padding: 10px;
}

.fs-state, .s2-state {
  text-align: center; padding: 48px 20px;
  color: var(--ink-soft);
  font-family: var(--font-display); font-weight: 600; font-size: 15px;
}
.fs-state.loading, .s2-state.loading { animation: fsPulse 1.4s ease-in-out infinite; }
@keyframes fsPulse { 50% { opacity: 0.45; } }

.fs-top, .s2-top {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.fs-top-pill, .s2-top-pill {
  position: relative; overflow: hidden;
  border-radius: 18px; padding: 15px 12px;
  text-align: center;
  font-family: var(--font-display); font-weight: 800; font-size: 15px;
  letter-spacing: 0.6px; color: var(--ink);
}
.fs-top-pill.b, .s2-top-pill.b { background: linear-gradient(135deg, #ffffff -40%, #d7f8ff 45%, #b4eeff 100%); box-shadow: 0 14px 28px -14px rgba(60, 190, 230, 0.7); }
.fs-top-pill.g, .s2-top-pill.g { background: linear-gradient(135deg, #ffffff -40%, #ffd6ea 45%, #ffbadb 100%); box-shadow: 0 14px 28px -14px rgba(255, 120, 175, 0.65); }

.fs-group, .s2-group {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 22px 44px -26px rgba(23, 52, 71, 0.35);
  animation: fsRise 0.55s cubic-bezier(.2, .8, .2, 1) both;
}
@keyframes fsRise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}

.fs-group-title, .s2-group-title {
  padding: 14px 16px; text-align: center;
  font-family: var(--font-display); font-weight: 800; font-size: 16px;
  color: var(--ink); letter-spacing: 0.2px;
  border-bottom: 1px solid var(--line);
}
.fs-group-title { background: linear-gradient(90deg, var(--b-soft) 0%, #FFFFFF 50%, var(--g-soft) 100%); }
.s2-group-title.all-title { background: linear-gradient(90deg, var(--b-soft) 0%, #FFFFFF 50%, var(--g-soft) 100%); color: var(--ink); }
.s2-group-title.b-title { background: linear-gradient(90deg, var(--b-soft) 0%, #FFFFFF 100%); color: var(--b-main); }
.s2-group-title.g-title { background: linear-gradient(90deg, var(--g-soft) 0%, #FFFFFF 100%); color: var(--g-main); }

.fs-match {
  display: grid; grid-template-columns: 1fr 64px 1fr;
  align-items: stretch; padding: 20px 18px;
  background: linear-gradient(90deg, rgba(103, 224, 255, 0.14) 0%, rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0) 55%, rgba(255, 189, 217, 0.2) 100%);
}
.fs-match + .fs-match { border-top: 1px dashed rgba(23, 52, 71, 0.12); }
.fs-side { display: flex; flex-direction: column; justify-content: center; gap: 12px; min-width: 0; }
.fs-side.b { padding-right: 8px; align-items: flex-end; }
.fs-side.g { padding-left: 8px; align-items: flex-start; }

.fs-song {
  display: inline-flex; align-items: center; max-width: 100%;
  padding: 6px 14px; border-radius: 999px;
  font-family: var(--font-display); font-weight: 800; font-size: 14px;
}
.fs-side.b .fs-song { background: var(--b-soft); color: var(--b-main); }
.fs-side.g .fs-song { background: var(--g-soft); color: var(--g-main); }
.fs-members { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; width: 100%; }

.fs-vs-col { position: relative; display: flex; align-items: center; justify-content: center; }
.fs-vs-col::before {
  content: ""; position: absolute; top: 6px; bottom: 6px; left: 50%;
  width: 2px; transform: translateX(-50%);
  background: linear-gradient(180deg, transparent, rgba(23, 52, 71, 0.14), transparent);
}
.fs-vs {
  position: relative; z-index: 1;
  width: 46px; height: 46px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-weight: 900; font-size: 14px; color: var(--ink);
  background: linear-gradient(135deg, #d7f8ff 0%, #ffd6ea 100%);
  box-shadow: 0 0 0 5px #fff, 0 12px 24px -8px rgba(232, 120, 175, 0.55);
}

.fs-member {
  --side: var(--b-main);
  --side-soft: var(--b-soft);
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; background: var(--card);
  border: 1px solid var(--line); border-radius: 12px;
  box-shadow: 0 6px 16px -10px rgba(23, 52, 71, 0.3);
  cursor: pointer; text-align: left; min-width: 0;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.fs-member.g { --side: var(--g-main); --side-soft: var(--g-soft); }
.fs-member:hover { transform: translateY(-3px); border-color: var(--side); }

.fs-member .fs-avatar {
  width: 42px; height: 42px; min-width: 42px; max-width: 42px; max-height: 42px;
  flex: 0 0 42px; border-radius: 50%; object-fit: cover;
  border: 2px solid var(--side); box-sizing: border-box;
}
.fs-member .fs-avatar.fallback {
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--side), var(--side-soft));
  color: #fff; font-size: 11px; font-weight: 800;
}
.fs-info { min-width: 0; }
.fs-info-top { display: flex; align-items: center; gap: 6px; min-width: 0; }
.fs-id {
  flex-shrink: 0; font-size: 10.5px; font-weight: 800;
  color: var(--side); background: var(--side-soft);
  padding: 3px 7px; border-radius: 999px;
}
.fs-stage { font-size: 12.5px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fs-real { margin-top: 2px; font-size: 11.5px; font-weight: 500; color: var(--ink-soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* STAGE 02 STYLES */
.s2-nav-toggle { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; }
.s2-toggle-btn {
  background: var(--surface, #fff); border: 1.5px solid var(--border, rgba(23, 52, 71, 0.1));
  padding: 10px 22px; border-radius: 999px;
  font-family: var(--font-display); font-weight: 800; font-size: 13.5px;
  color: var(--text-soft, #6B8294); cursor: pointer; transition: all 0.2s ease;
}
.s2-toggle-btn.active.b { background: linear-gradient(135deg, #0E6FA8, #3FA9DB); color: #fff; border-color: transparent; }
.s2-toggle-btn.active.g { background: linear-gradient(135deg, #E8438A, #FF7DB3); color: #fff; border-color: transparent; }
.s2-toggle-btn.active.all { background: var(--ink); color: #fff; border-color: transparent; }

.s2-size-title {
  display: inline-flex; align-items: center; gap: 8px;
  background: #FFF8E7; border: 1px solid #FFE4A0; color: #B26A00;
  padding: 6px 18px; border-radius: 999px;
  font-family: var(--font-display); font-weight: 800; font-size: 13.5px;
  margin: 10px 0 16px 4px;
}

.s2-cards-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px; margin-bottom: 28px;
}
.s2-song-card {
  background: var(--card); border: 1px solid var(--line); border-radius: 20px;
  padding: 18px 16px; box-shadow: 0 10px 25px -10px rgba(23, 52, 71, 0.15);
  display: flex; flex-direction: column; gap: 14px; transition: transform 0.2s ease;
}
.s2-song-card:hover { transform: translateY(-3px); }
.s2-song-card.b { border-top: 4px solid var(--b-main); }
.s2-song-card.g { border-top: 4px solid var(--g-main); }

.s2-card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.s2-song-title-wrap { display: flex; align-items: center; gap: 8px; min-width: 0; }
.s2-side-tag {
  font-family: var(--font-display); font-size: 11px; font-weight: 800;
  padding: 3px 8px; border-radius: 6px; flex-shrink: 0;
}
.s2-side-tag.b { background: var(--b-soft); color: var(--b-main); }
.s2-side-tag.g { background: var(--g-soft); color: var(--g-main); }

.s2-song-name { font-family: var(--font-display); font-weight: 800; font-size: 15px; }
.s2-song-card.b .s2-song-name { color: var(--b-main); }
.s2-song-card.g .s2-song-name { color: var(--g-main); }

.s2-size-badge {
  font-family: var(--font-display); font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 999px; background: rgba(23, 52, 71, 0.05); color: var(--ink-soft);
}
.s2-slots-wrap { display: flex; flex-direction: column; gap: 8px; }
.s2-slot-empty {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  background: rgba(23, 52, 71, 0.02); border: 1.5px dashed rgba(23, 52, 71, 0.14);
  border-radius: 12px; color: var(--ink-soft);
}
.s2-slot-label { font-size: 12px; font-weight: 600; color: var(--ink-soft); }
.s2-slot-num { font-size: 10.5px; font-weight: 700; margin-left: auto; opacity: 0.5; }

@media (max-width: 760px) {
  .fs-wrap, .s2-wrap { padding: 4px; gap: 16px; }
  .fs-match { grid-template-columns: 1fr; padding: 16px 12px; row-gap: 6px; }
  .fs-side.b, .fs-side.g { padding: 0; align-items: flex-start; }
  .fs-vs-col { padding: 8px 0; }
  .s2-cards-grid { grid-template-columns: 1fr; }
}
`;
    document.head.appendChild(styleEl);
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  // 1. Switch Battle Stage
  window.switchBattleStage = function(stageId) {
    if (typeof window.activateTab === "function") window.activateTab("battle");

    document.querySelectorAll(".stage-content-block").forEach(block => {
      block.classList.toggle("active", block.id === stageId);
    });

    document.querySelectorAll(".tab-sub-item").forEach(item => {
      item.classList.toggle("active", item.dataset.stage === stageId);
    });

    if (battleDropdownWrap) battleDropdownWrap.classList.remove("show");

    if (stageId === "stage-second" && typeof window.renderSecondStage === "function") {
      window.renderSecondStage();
    }
  };

  document.querySelectorAll(".tab-sub-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      window.switchBattleStage(item.dataset.stage);
    });
  });

  // Helper to parse CSV using PapaParse
  function parseCsvAsync(url, fallbackUrl) {
    return new Promise((resolve) => {
      if (typeof Papa === "undefined") { resolve([]); return; }
      const parseFallback = () => {
        if (!fallbackUrl) { resolve([]); return; }
        Papa.parse(fallbackUrl, {
          download: true, header: true, skipEmptyLines: true,
          complete: (fbRes) => resolve(fbRes.data || []),
          error: () => resolve([])
        });
      };
      Papa.parse(url, {
        download: true, header: true, skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) resolve(results.data);
          else parseFallback();
        },
        error: parseFallback
      });
    });
  }

  function buildMemberCard(id, side, profileMap) {
    const profile = profileMap[id] || {};
    const displayName = profile.name || id;
    const stageName = profile.stageName && profile.stageName.trim() !== "-" ? profile.stageName : "";
    const imgUrl = profile.image && profile.image.trim() !== "" ? profile.image.trim() : "";

    const card = document.createElement("div");
    card.className = `fs-member ${side}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    const openProfile = () => {
      if (typeof window.openProfileModal === "function" && profileMap[id]) {
        window.openProfileModal(profileMap[id]);
      }
    };
    card.addEventListener("click", openProfile);

    const makeFallback = () => {
      const fb = document.createElement("div");
      fb.className = "fs-avatar fallback";
      fb.textContent = id;
      return fb;
    };
    let avatar;
    if (imgUrl) {
      avatar = document.createElement("img");
      avatar.className = "fs-avatar";
      avatar.src = imgUrl;
      avatar.alt = displayName;
      avatar.loading = "lazy";
      avatar.style.cssText = "width:42px;height:42px;min-width:42px;max-width:42px;object-fit:cover;border-radius:50%;flex:0 0 42px;";
      avatar.addEventListener("error", () => avatar.replaceWith(makeFallback()));
    } else {
      avatar = makeFallback();
    }
    card.appendChild(avatar);

    const info = document.createElement("div");
    info.className = "fs-info";
    info.innerHTML = `
      <div class="fs-info-top">
        <span class="fs-id">${esc(id)}</span>
        ${stageName ? `<span class="fs-stage">${esc(stageName)}</span>` : ""}
      </div>
      <div class="fs-real" title="${esc(displayName)}">${esc(displayName)}</div>
    `;
    card.appendChild(info);

    return card;
  }

  function buildSide(side, songName, ids, profileMap) {
    const el = document.createElement("div");
    el.className = `fs-side ${side}`;

    const song = document.createElement("div");
    song.className = "fs-song";
    song.textContent = songName || "-";
    el.appendChild(song);

    const grid = document.createElement("div");
    grid.className = "fs-members";
    ids.forEach(id => grid.appendChild(buildMemberCard(id, side, profileMap)));
    el.appendChild(grid);

    return el;
  }

  const splitIds = (str) => str ? str.split(",").map(id => id.trim()).filter(Boolean) : [];

  // =========================================================================
  // 3. FIRST STAGE GROUP-BASED VS MATCHUPS RENDERER
  // =========================================================================
  window.renderFirstStage = async function() {
    if (!firstStageContainer) return;
    firstStageContainer.innerHTML = `<div class="fs-state loading">กำลังโหลดข้อมูลการประชัน First Stage...</div>`;

    const [round1Data, profileData] = await Promise.all([
      parseCsvAsync(ROUND_1_CSV_URL, ROUND_1_CSV_FALLBACK),
      parseCsvAsync(PROFILE_CSV_URL, PROFILE_CSV_FALLBACK)
    ]);

    const profileMap = {};
    profileData.forEach(p => {
      if (p.id) profileMap[p.id.trim()] = p;
    });

    const validMatches = round1Data.filter(r => r.group_name && r.group_name.trim() !== "");
    if (validMatches.length === 0) {
      firstStageContainer.innerHTML = `<div class="fs-state">ไม่พบข้อมูลการแข่งขันในขณะนี้</div>`;
      return;
    }

    const groupsMap = {};
    validMatches.forEach(r => {
      const gName = r.group_name.trim();
      if (!groupsMap[gName]) groupsMap[gName] = [];
      groupsMap[gName].push(r);
    });

    firstStageContainer.innerHTML = "";
    const outerWrap = document.createElement("div");
    outerWrap.className = "fs-wrap";

    const topHeader = document.createElement("div");
    topHeader.className = "fs-top";
    topHeader.innerHTML = `
      <div class="fs-top-pill b">B-TRAINEES</div>
      <div class="fs-top-pill g">G-TRAINEES</div>
    `;
    outerWrap.appendChild(topHeader);

    Object.keys(groupsMap).forEach((groupName, index) => {
      const groupBlock = document.createElement("div");
      groupBlock.className = "fs-group";
      groupBlock.style.setProperty("--i", index);

      const titleBar = document.createElement("div");
      titleBar.className = "fs-group-title";
      titleBar.textContent = groupName;
      groupBlock.appendChild(titleBar);

      groupsMap[groupName].forEach(m => {
        const matchRow = document.createElement("div");
        matchRow.className = "fs-match";

        const vsCol = document.createElement("div");
        vsCol.className = "fs-vs-col";
        vsCol.innerHTML = `<div class="fs-vs">VS</div>`;

        matchRow.appendChild(buildSide("b", m.b_song, splitIds(m.b_ids), profileMap));
        matchRow.appendChild(vsCol);
        matchRow.appendChild(buildSide("g", m.g_song, splitIds(m.g_ids), profileMap));
        groupBlock.appendChild(matchRow);
      });

      outerWrap.appendChild(groupBlock);
    });

    firstStageContainer.appendChild(outerWrap);
  };

  // =========================================================================
  // 4. SECOND STAGE · POSITION EVALUATION
  // =========================================================================
  window.renderSecondStage = async function() {
    let container = document.getElementById("secondStageContainer");
    if (!container) {
      const stageSecondBlock = document.getElementById("stage-second");
      if (stageSecondBlock) {
        container = document.createElement("div");
        container.id = "secondStageContainer";
        stageSecondBlock.appendChild(container);
      } else {
        return;
      }
    }

    container.innerHTML = `<div class="s2-state loading">กำลังโหลดรายชื่อเพลง Second Stage...</div>`;

    const [round2Data, profileData] = await Promise.all([
      parseCsvAsync(ROUND_2_CSV_URL, null),
      parseCsvAsync(PROFILE_CSV_URL, PROFILE_CSV_FALLBACK)
    ]);

    const profileMap = {};
    profileData.forEach(p => {
      if (p.id) profileMap[p.id.trim()] = p;
    });

    let validSongs = (round2Data || []).filter(r => r.song_title && r.song_title.trim() !== "");
    if (validSongs.length === 0) {
      validSongs = ROUND_2_DEFAULT_TEMPLATE;
    }

    container.innerHTML = "";
    const outerWrap = document.createElement("div");
    outerWrap.className = "s2-wrap";

    // ปุ่มสลับ: ดูเพลงทั้งหมด / B-TRAINEES / G-TRAINEES (ไม่มีอีโมจิ)
    const toggleBar = document.createElement("div");
    toggleBar.className = "s2-nav-toggle";
    toggleBar.innerHTML = `
      <button type="button" class="s2-toggle-btn active all" data-side="ALL">ดูเพลงทั้งหมด (24 เพลง)</button>
      <button type="button" class="s2-toggle-btn b" data-side="B">B-TRAINEES (12 เพลง)</button>
      <button type="button" class="s2-toggle-btn g" data-side="G">G-TRAINEES (12 เพลง)</button>
    `;
    outerWrap.appendChild(toggleBar);

    const contentArea = document.createElement("div");
    contentArea.className = "s2-content-area";
    outerWrap.appendChild(contentArea);

    function createSongCard(song, size) {
      const sideKey = (song.side || "B").trim().toUpperCase();
      const isB = sideKey === "B";
      const sideColor = isB ? "b" : "g";
      const sideTagText = isB ? "B-TRAINEES" : "G-TRAINEES";

      const card = document.createElement("div");
      card.className = `s2-song-card ${sideColor}`;

      const head = document.createElement("div");
      head.className = "s2-card-head";
      head.innerHTML = `
        <div class="s2-song-title-wrap">
          <span class="s2-side-tag ${sideColor}">${sideTagText}</span>
          <div class="s2-song-name">${esc(song.song_title)}</div>
        </div>
        <span class="s2-size-badge">${size} คน</span>
      `;
      card.appendChild(head);

      const slotsWrap = document.createElement("div");
      slotsWrap.className = "s2-slots-wrap";
      const assignedIds = splitIds(song.trainee_ids);

      for (let i = 0; i < size; i++) {
        if (assignedIds[i]) {
          slotsWrap.appendChild(buildMemberCard(assignedIds[i], sideColor, profileMap));
        } else {
          const emptySlot = document.createElement("div");
          emptySlot.className = "s2-slot-empty";
          emptySlot.innerHTML = `
            <div class="s2-slot-label">รอเด็กฝึกเลือกเพลง...</div>
            <div class="s2-slot-num">SLOT ${i + 1}</div>
          `;
          slotsWrap.appendChild(emptySlot);
        }
      }

      card.appendChild(slotsWrap);
      return card;
    }

    function renderSideView(selectedSide) {
      contentArea.innerHTML = "";
      const teamSizes = [2, 3, 4];

      if (selectedSide === "ALL") {
        // ดูเพลงทั้งหมด: รวมชายหญิงไว้ด้วยกัน แยกตาม Team Size
        const allGroup = document.createElement("div");
        allGroup.className = "s2-group";
        allGroup.style.marginBottom = "30px";

        const titleBar = document.createElement("div");
        titleBar.className = "s2-group-title all-title";
        titleBar.textContent = "รายชื่อเพลงการแข่งขันรอบที่ 2 ทั้งหมด (24 เพลง)";
        allGroup.appendChild(titleBar);

        const innerBody = document.createElement("div");
        innerBody.style.padding = "20px 18px";

        teamSizes.forEach(size => {
          const songsOfSize = validSongs.filter(s => parseInt(s.team_size, 10) === size);
          if (songsOfSize.length === 0) return;

          const sizeHeader = document.createElement("div");
          sizeHeader.className = "s2-size-title";
          sizeHeader.textContent = `Team size: ${size} members (${songsOfSize.length} เพลง)`;
          innerBody.appendChild(sizeHeader);

          const grid = document.createElement("div");
          grid.className = "s2-cards-grid";

          songsOfSize.forEach(song => {
            grid.appendChild(createSongCard(song, size));
          });

          innerBody.appendChild(grid);
        });

        allGroup.appendChild(innerBody);
        contentArea.appendChild(allGroup);
      } else {
        // แยกตามฝั่ง B หรือ G
        const isB = selectedSide === "B";
        const sideColor = isB ? "b" : "g";
        const sideTitle = isB ? "B-TRAINEES (12 เพลง)" : "G-TRAINEES (12 เพลง)";
        const sideSongs = validSongs.filter(s => (s.side || "B").trim().toUpperCase() === selectedSide);

        const sideGroup = document.createElement("div");
        sideGroup.className = "s2-group";
        sideGroup.style.marginBottom = "30px";

        const titleBar = document.createElement("div");
        titleBar.className = `s2-group-title ${sideColor}-title`;
        titleBar.textContent = sideTitle;
        sideGroup.appendChild(titleBar);

        const innerBody = document.createElement("div");
        innerBody.style.padding = "20px 18px";

        teamSizes.forEach(size => {
          const songsOfSize = sideSongs.filter(s => parseInt(s.team_size, 10) === size);
          if (songsOfSize.length === 0) return;

          const sizeHeader = document.createElement("div");
          sizeHeader.className = "s2-size-title";
          sizeHeader.textContent = `Team size: ${size} members (${songsOfSize.length} เพลง)`;
          innerBody.appendChild(sizeHeader);

          const grid = document.createElement("div");
          grid.className = "s2-cards-grid";

          songsOfSize.forEach(song => {
            grid.appendChild(createSongCard(song, size));
          });

          innerBody.appendChild(grid);
        });

        sideGroup.appendChild(innerBody);
        contentArea.appendChild(sideGroup);
      }
    }

    toggleBar.querySelectorAll(".s2-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleBar.querySelectorAll(".s2-toggle-btn").forEach(b => {
          b.classList.remove("active");
          b.classList.remove("all");
        });
        btn.classList.add("active");
        if (btn.dataset.side === "ALL") btn.classList.add("all");
        renderSideView(btn.dataset.side);
      });
    });

    renderSideView("ALL");
    container.appendChild(outerWrap);
  };

  window.renderFirstStage();
  const s2Block = document.getElementById("stage-second");
  if (s2Block && s2Block.classList.contains("active")) {
    window.renderSecondStage();
  }
})();