/* ============ OFFICIAL RANKING & GRAPH ============ */
(function() {
  "use strict";

  let allRankingTrainees = [];
  let currentRankingSide = "B";
  let currentRankingRoundKey = "rankFirst";

  const rankSideBBtn = document.getElementById("rankSideB");
  const rankSideGBtn = document.getElementById("rankSideG");
  const rankingRoundSelect = document.getElementById("rankingRoundSelect");

  window.initRankingData = function(data) {
    allRankingTrainees = data;
    renderFullRanking();
  };

  function createRankingCard(t, rankNum, sizeClass) {
    const card = document.createElement("div");
    card.className = `ranking-item ${sizeClass}`;
    const displayName = t.stageName && t.stageName.trim() ? t.stageName : t.name;

    card.innerHTML = `
      <div class="rank-avatar-wrap">
        <div class="rank-badge-num">${rankNum}</div>
        <img class="rank-avatar-img" src="${t.image || ''}" alt="${displayName}">
      </div>
      <div class="rank-meta-name">${t.name || ''}</div>
      <div class="rank-meta-stage">${displayName}</div>
    `;
    card.addEventListener("click", () => {
      if (typeof window.openProfileModal === "function") window.openProfileModal(t);
    });
    return card;
  }

  function renderFullRanking() {
    const pyramidEl = document.getElementById("rankPyramid");
    const tier2El = document.getElementById("rankTier2");
    const tier3El = document.getElementById("rankTier3");
    const contentBox = document.querySelector(".ranking-content-box");

    if (!pyramidEl || !tier2El || !tier3El) return;
    if (contentBox) contentBox.classList.toggle("side-g-theme", currentRankingSide === "G");

    pyramidEl.innerHTML = ""; tier2El.innerHTML = ""; tier3El.innerHTML = "";

    const filtered = allRankingTrainees
      .filter(t => (t.side || "").trim().toUpperCase() === currentRankingSide.toUpperCase())
      .map(t => ({
        ...t,
        rankVal: parseInt(t[currentRankingRoundKey], 10) || 0
      }))
      .filter(t => t.rankVal > 0)
      .sort((a, b) => a.rankVal - b.rankVal);

    if (filtered.length === 0) return;

    if (filtered[0]) {
      const r1 = document.createElement("div"); r1.className = "pyramid-row";
      r1.appendChild(createRankingCard(filtered[0], filtered[0].rankVal, "pyramid-rank-1"));
      pyramidEl.appendChild(r1);
    }
    if (filtered[1] || filtered[2]) {
      const r2 = document.createElement("div"); r2.className = "pyramid-row pyramid-row-mid";
      if (filtered[1]) r2.appendChild(createRankingCard(filtered[1], filtered[1].rankVal, "rank-std-size"));
      if (filtered[2]) r2.appendChild(createRankingCard(filtered[2], filtered[2].rankVal, "rank-std-size"));
      pyramidEl.appendChild(r2);
    }
    if (filtered[3] || filtered[4]) {
      const r3 = document.createElement("div"); r3.className = "pyramid-row pyramid-row-bottom";
      if (filtered[3]) r3.appendChild(createRankingCard(filtered[3], filtered[3].rankVal, "rank-std-size"));
      if (filtered[4]) r3.appendChild(createRankingCard(filtered[4], filtered[4].rankVal, "rank-std-size"));
      pyramidEl.appendChild(r3);
    }

    filtered.slice(5, 10).forEach(t => tier2El.appendChild(createRankingCard(t, t.rankVal, "rank-std-size")));
    filtered.slice(10).forEach(t => tier3El.appendChild(createRankingCard(t, t.rankVal, "rank-small-size")));
  }

  if (rankSideBBtn && rankSideGBtn) {
    rankSideBBtn.addEventListener("click", () => {
      rankSideBBtn.classList.add("active"); rankSideGBtn.classList.remove("active");
      currentRankingSide = "B"; renderFullRanking();
    });
    rankSideGBtn.addEventListener("click", () => {
      rankSideGBtn.classList.add("active"); rankSideBBtn.classList.remove("active");
      currentRankingSide = "G"; renderFullRanking();
    });
  }
  if (rankingRoundSelect) {
    rankingRoundSelect.addEventListener("change", (e) => {
      currentRankingRoundKey = e.target.value; renderFullRanking();
    });
  }
})();