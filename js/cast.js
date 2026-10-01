/* ============ CAST & MENTORS RENDERER ============ */
(function() {
  "use strict";

  const CAST_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgJm-hdAxCRJmSqni3wlRQmZl4f74DiNMqr6c_O3a5mR913CYCpaiF_NQbWKOpAx6nNjxhC7EoIbwz/pub?gid=1169428709&single=true&output=csv";

  function normalizeCastKey(name) {
    return (name || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
  }

  const CAST_IMAGE_MAP_NORMALIZED = {};
  if (typeof CAST_IMAGE_MAP !== "undefined") {
    Object.keys(CAST_IMAGE_MAP).forEach(k => {
      CAST_IMAGE_MAP_NORMALIZED[normalizeCastKey(k)] = CAST_IMAGE_MAP[k];
    });
  }

  function buildCastImageCandidates(cleanStageName, row) {
    const candidates = [];
    const explicit = row && (row.Image || row.Photo || row["รูป"]);
    if (explicit && explicit.trim()) {
      candidates.push(`assets/Cast/${explicit.trim()}`);
    }
    const mapped = CAST_IMAGE_MAP_NORMALIZED[normalizeCastKey(cleanStageName)];
    if (mapped) candidates.push(mapped);

    ["png", "PNG", "jpg", "jpeg", "webp"].forEach(ext => {
      candidates.push(`assets/Cast/${cleanStageName}.${ext}`);
    });
    return [...new Set(candidates)];
  }

  function attachCastImageFallback(img, cleanStageName, row) {
    const candidates = buildCastImageCandidates(cleanStageName, row);
    let i = 0;
    img.src = candidates[i];
    img.onerror = function() {
      i++;
      if (i < candidates.length) {
        img.src = candidates[i];
      } else {
        this.style.display = "none";
        const fb = this.nextElementSibling;
        if (fb) fb.style.display = "flex";
      }
    };
  }

  function createCastSection(titleText, items, gridClass) {
    const groupDiv = document.createElement("div");
    groupDiv.className = "cast-section-group";

    const title = document.createElement("div");
    title.className = "cast-section-title";
    title.textContent = `— ${titleText} —`;
    groupDiv.appendChild(title);

    const gridDiv = document.createElement("div");
    gridDiv.className = gridClass;

    items.forEach(c => {
      const card = document.createElement("div");
      card.className = "cast-card";

      const rawStageName = (c.StageName || c.Name || "").trim();
      const cleanStageName = rawStageName.replace(/\s*\(Guest\)/i, "").trim();

      const avatarDiv = document.createElement("div");
      avatarDiv.className = "cast-avatar";

      const img = document.createElement("img");
      img.className = "cast-card-img";
      img.alt = rawStageName;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      attachCastImageFallback(img, cleanStageName, c);

      const fallbackDiv = document.createElement("div");
      fallbackDiv.className = "cast-avatar-fallback";
      fallbackDiv.style.cssText = "display:none; background: linear-gradient(135deg, #67E0FF, #FFBDD9); width:100%; height:100%; align-items:center; justify-content:center; font-weight:bold; font-size:20px; color:#fff;";
      fallbackDiv.textContent = cleanStageName.slice(0, 2).toUpperCase();

      avatarDiv.appendChild(img);
      avatarDiv.appendChild(fallbackDiv);

      const stageNameVal = (c['Stage Name'] || c.StageName || c['สเตจเนม'] || "").trim();
      const realNameVal = (c.Name || c.name || c['ชื่อ'] || "").trim();
      const ageVal = (c.Age || c.age || c['อายุ'] || "").toString().trim();
      const displayStageName = stageNameVal || realNameVal || "ไม่ระบุชื่อ";
      
      const ageTagHtml = ageVal ? ` <span style="font-size: 14.5px; font-weight: normal; color: var(--text-soft); margin-left: 4px;">(${ageVal})</span>` : "";
      const nameLineHtml = (realNameVal && realNameVal.toLowerCase() !== displayStageName.toLowerCase())
        ? `<div style="font-size: 13.5px; font-weight: normal; color: var(--text-soft); margin-top: 4px;">(${realNameVal})</div>`
        : "";

      const quoteText = (c.Quote || c.quote || "").trim();
      const bioText = (c['About me'] || c.About || c.bio || "").trim();
      const quoteHtml = quoteText ? `<div class="cast-quote" style="font-weight: bold; margin-bottom: 8px;">“${quoteText}”</div>` : "";

      const bodyDiv = document.createElement("div");
      bodyDiv.className = "cast-body";
      bodyDiv.innerHTML = `
        <div class="cast-role">${c.Position || titleText}</div>
        <h4 class="cast-name" style="margin-bottom: 8px; line-height: 1.3;">
          ${displayStageName}${ageTagHtml}
          ${nameLineHtml}
        </h4>
        ${c.CV ? `<div class="cast-cv" style="margin-bottom: 12px;">CV: ${c.CV}</div>` : ''}
        ${quoteHtml}
        <p class="cast-desc" style="font-size: 13.5px; line-height: 1.6; color: var(--text-soft);">${bioText}</p>
      `;

      card.appendChild(avatarDiv);
      card.appendChild(bodyDiv);
      gridDiv.appendChild(card);
    });

    groupDiv.appendChild(gridDiv);
    return groupDiv;
  }

  if (typeof Papa !== 'undefined') {
    Papa.parse(CAST_CSV_URL, {
      download: true,
      header: true,
      complete: function(results) {
        const castGrid = document.getElementById("castGrid");
        if (!castGrid) return;

        const castData = results.data.filter(row => {
          const name = row.StageName || row.Name || "";
          return name.trim() !== "";
        });

        const mcItems = castData.filter(c => (c.Position || "").toUpperCase().includes("MC"));
        const leadItems = castData.filter(c => (c.Position || "").toUpperCase().includes("LEAD MENTOR"));
        const mentorItems = castData.filter(c => {
          const pos = (c.Position || "").toUpperCase();
          return !pos.includes("MC") && !pos.includes("LEAD MENTOR");
        });

        castGrid.innerHTML = "";
        if (mcItems.length > 0) castGrid.appendChild(createCastSection("MC", mcItems, "cast-grid-large"));
        if (leadItems.length > 0) castGrid.appendChild(createCastSection("LEAD MENTOR", leadItems, "cast-grid-medium"));
        if (mentorItems.length > 0) castGrid.appendChild(createCastSection("MENTOR", mentorItems, "cast-grid-small"));
      }
    });
  }
})();