(function(){
  "use strict";

  /* ============ 1. TAB NAVIGATION & BATTLE DROPDOWN ============ */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  const battleMainBtn = document.getElementById("battleMainBtn");
  const battleDropdownWrap = document.getElementById("battleDropdownWrap");

  function activateTab(tabName){
    if (!tabName) return;

    tabBtns.forEach(b => {
      const isTarget = b.dataset.tab === tabName;
      b.classList.toggle("active", isTarget);
    });

    panels.forEach(p => p.classList.remove("active"));
    const target = document.getElementById(`panel-${tabName}`);
    if(target) target.classList.add("active");
    window.scrollTo({top:0, behavior:"smooth"});

    if(tabName === "title-song" && typeof checkAndShowCenterAds === "function"){
      checkAndShowCenterAds();
    }
  }

  tabBtns.forEach(btn=>{
    btn.addEventListener("click", (e)=> {
      const tab = btn.dataset.tab;
      if (!tab) return;

      if (tab === "battle") {
        e.stopPropagation();
        activateTab("battle");
        if (battleDropdownWrap) battleDropdownWrap.classList.toggle("show");
      } else {
        if (battleDropdownWrap) battleDropdownWrap.classList.remove("show");
        activateTab(tab);
      }
    });
  });

  document.querySelectorAll("[data-tab-target]").forEach(el=>{
    el.addEventListener("click", ()=>{
      const t = el.dataset.tabTarget;
      if (battleDropdownWrap) battleDropdownWrap.classList.remove("show");
      activateTab(t || "home");
    });
  });

  // Battle Stage Switcher จาก Dropdown
  function switchBattleStage(stageId) {
    activateTab("battle");
    document.querySelectorAll(".stage-content-block").forEach(block => {
      block.classList.toggle("active", block.id === stageId);
    });
    document.querySelectorAll(".tab-sub-item").forEach(item => {
      item.classList.toggle("active", item.dataset.stage === stageId);
    });
    if (battleDropdownWrap) battleDropdownWrap.classList.remove("show");
  }

  document.querySelectorAll(".tab-sub-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      switchBattleStage(item.dataset.stage);
    });
  });

  document.addEventListener("click", (e) => {
    if (battleDropdownWrap && !battleDropdownWrap.contains(e.target)) {
      battleDropdownWrap.classList.remove("show");
    }
  });

  /* ============ 2. CENTER ADS MODAL (พร้อมรูปภาพ) ============ */
  window.checkAndShowCenterAds = function() {
    const popup = document.getElementById("centerAdsBackdrop");
    if (popup) {
      popup.style.display = "flex";
      popup.classList.add("open");
    }
  };

  window.closeCenterAds = function() {
    const popup = document.getElementById("centerAdsBackdrop");
    if (popup) {
      popup.style.display = "none";
      popup.classList.remove("open");
    }
  };

  const centerAdsBackdrop = document.getElementById("centerAdsBackdrop");
  if (centerAdsBackdrop) {
    centerAdsBackdrop.addEventListener("click", (e) => {
      if (e.target === centerAdsBackdrop) window.closeCenterAds();
    });
  }

  /* ============ 3. TEAM BATTLE RENDERER ============ */
  const teamGrid = document.getElementById("teamGrid");
  const sideBtns = document.querySelectorAll(".side-btn");

  function renderTeams(side){
    if(!teamGrid || typeof TEAMS_B === 'undefined') return;
    teamGrid.innerHTML = "";
    const teams = side === "B" ? TEAMS_B : TEAMS_G;
    teams.forEach(team=>{
      const card = document.createElement("div");
      card.className = "team-card";
      card.innerHTML = `
        <div class="team-card-head">
          <h4>TEAM ${team.side}-${team.teamNumber}</h4>
          <span class="team-num" style="background:${team.side === 'B' ? 'var(--blue-deep)' : 'var(--pink-deep)'};">${team.songTitle}</span>
        </div>
        <div class="team-members">
          ${team.members.map(m=>`<span class="team-member-chip">${m.name}</span>`).join("")}
        </div>
      `;
      teamGrid.appendChild(card);
    });
  }

  sideBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      sideBtns.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      renderTeams(btn.dataset.side);
    });
  });
  renderTeams("B");

  /* ============ 4. HOME & NEWS RENDERER ============ */
  const newsGrid = document.getElementById("newsGrid");
  if(newsGrid && typeof NEWS_ITEMS !== 'undefined'){
    NEWS_ITEMS.forEach(item=>{
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <span class="tag">${item.tag}</span>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      `;
      newsGrid.appendChild(card);
    });
  }

  /* ============ 5. GOOGLE SHEETS DATA LOADER (Trainees & Cast) ============ */
  const bGrid = document.getElementById("bTraineeGrid");
  const gGrid = document.getElementById("gTraineeGrid");

  function initials(name) {
    if (!name) return "";
    return name.trim().split(" ")[0].slice(0, 2).toUpperCase();
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
    card.addEventListener("click", () => openProfileModal(t));
    return card;
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

        const bCountEl = document.getElementById("bCount");
        const gCountEl = document.getElementById("gCount");
        if(bCountEl) bCountEl.textContent = `${TRAINEES_B.length} คน`;
        if(gCountEl) gCountEl.textContent = `${TRAINEES_G.length} คน`;

        if(bGrid) bGrid.innerHTML = "";
        if(gGrid) gGrid.innerHTML = "";
        
        TRAINEES_B.forEach(t => { if(bGrid) bGrid.appendChild(renderTraineeCard(t)); });
        TRAINEES_G.forEach(t => { if(gGrid) gGrid.appendChild(renderTraineeCard(t)); });

        if (typeof window.initRankingData === "function") {
          window.initRankingData(ALL_TRAINEES);
        }
      }
    });
  }

  /* ============ 6. TRAINEE PROFILE MODAL (ป๊อปอัปข้อมูลเด็กฝึก) ============ */
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  function openProfileModal(t) {
    if(!modalBody || !modalBackdrop) return;
    const grad = t.side === "B" ? "linear-gradient(135deg, #67E0FF, #8FE9FF)" : "linear-gradient(135deg, #FFBDD9, #FFD6E7)";
    const safeName = t.name || "ไม่ระบุชื่อ";
    const avatarContent = t.image && t.image.trim() !== "" 
      ? `<img src="${t.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` 
      : initials(safeName);

    modalBody.innerHTML = `
      <div class="modal-hero" style="background:${grad}; width:100%; aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; color:#fff; font-size:40px; font-weight:bold;">${avatarContent}</div>
      <div class="modal-content" style="padding:24px;">
        <div class="cast-role">${t.side === "B" ? "B-TRAINEE" : "G-TRAINEE"} · ${t.id || "-"}</div>
        <h2 style="margin-bottom: 4px;">${safeName}</h2>
        <div style="font-size: 13px; color: #888; margin-bottom: 12px;">สเตจเนม: ${t.stageName || "-"} | ตำแหน่ง: ${t.position || "-"}</div>
        <div class="modal-meta" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
          <div style="background:var(--surface-2); padding:8px; border-radius:8px;"><span>วันเกิด</span><br><b>${t.birth || "-"}</b></div>
          <div style="background:var(--surface-2); padding:8px; border-radius:8px;"><span>ภูมิลำเนา</span><br><b>${t.hometown || "-"}</b></div>
        </div>
        <p class="bio">${t.intro || "ยังไม่มีข้อมูลแนะนำตัว"}</p>
      </div>
    `;
    modalBackdrop.classList.add("open");
  }

  if(modalClose){
    modalClose.addEventListener("click", ()=> modalBackdrop.classList.remove("open"));
  }
  if(modalBackdrop){
    modalBackdrop.addEventListener("click", (e)=>{
      if(e.target === modalBackdrop) modalBackdrop.classList.remove("open");
    });
  }

  /* ============ 7. BATTLE FIRST STAGE (VS RENDERER) ============ */
  const firstStageContainer = document.getElementById("firstStageContainer");
  const viewToggleBtns = document.querySelectorAll(".view-toggle-btn");

  window.renderFirstStage = function(viewMode) {
    if (!firstStageContainer || typeof TEAMS_B === "undefined" || typeof TEAMS_G === "undefined") return;

    firstStageContainer.innerHTML = "";

    if (viewMode === "vs") {
      const wrap = document.createElement("div");
      wrap.className = "vs-match-list";

      for (let i = 0; i < 10; i++) {
        const teamB = TEAMS_B[i];
        const teamG = TEAMS_G[i];
        const card = document.createElement("div");
        card.className = "vs-match-card";

        card.innerHTML = `
          <div class="vs-match-num">MATCH ${i + 1}</div>
          <div class="vs-team-side side-b">
            <div class="vs-song-badge">${teamB ? teamB.songTitle : '-'}</div>
            <div class="vs-team-name">TEAM B-${i + 1}</div>
            <div class="vs-members-row">
              ${teamB ? teamB.members.map(m => `<span class="vs-member-chip">${m.name}</span>`).join("") : ""}
            </div>
          </div>
          <div class="vs-divider"><div class="vs-badge-circle">VS</div></div>
          <div class="vs-team-side side-g">
            <div class="vs-song-badge">${teamG ? teamG.songTitle : '-'}</div>
            <div class="vs-team-name">TEAM G-${i + 1}</div>
            <div class="vs-members-row">
              ${teamG ? teamG.members.map(m => `<span class="vs-member-chip">${m.name}</span>`).join("") : ""}
            </div>
          </div>
        `;
        wrap.appendChild(card);
      }
      firstStageContainer.appendChild(wrap);
    } else {
      const teams = viewMode === "b" ? TEAMS_B : TEAMS_G;
      const grid = document.createElement("div");
      grid.className = "team-grid";

      teams.forEach(team => {
        const card = document.createElement("div");
        card.className = "team-card";
        card.innerHTML = `
          <div class="team-card-head">
            <h4>TEAM ${team.side}-${team.teamNumber}</h4>
            <span class="team-num" style="background:${team.side === 'B' ? 'var(--blue-deep)' : 'var(--pink-deep)'};">${team.songTitle}</span>
          </div>
          <div class="team-members">
            ${team.members.map(m => `<span class="team-member-chip">${m.name}</span>`).join("")}
          </div>
        `;
        grid.appendChild(card);
      });
      firstStageContainer.appendChild(grid);
    }
  };

  viewToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewToggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      window.renderFirstStage(btn.dataset.view);
    });
  });

  window.renderFirstStage("vs");

})();