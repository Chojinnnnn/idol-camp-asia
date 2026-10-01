/* ============ SELECTING HERO CAROUSEL ============ */
(function() {
  "use strict";

  const selectHeroTrack = document.getElementById("selectHeroTrack");
  const autoScrollWrap = document.getElementById("autoScrollWrap");

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initials(name) {
    if (!name) return "";
    return name.trim().split(" ")[0].slice(0, 2).toUpperCase();
  }

  window.initHeroCarousel = function(traineesB, traineesG) {
    if (!selectHeroTrack) return;

    const shuffledB = shuffle(traineesB);
    const shuffledG = shuffle(traineesG);
    const allMixed = [];
    const maxLen = Math.max(shuffledB.length, shuffledG.length);
    
    for (let i = 0; i < maxLen; i++) {
      if (shuffledB[i]) allMixed.push(shuffledB[i]);
      if (shuffledG[i]) allMixed.push(shuffledG[i]);
    }

    selectHeroTrack.innerHTML = "";
    const displayList = [...allMixed, ...allMixed];

    displayList.forEach(t => {
      const isB = t.side === "B";
      const bgGrad = isB 
        ? "linear-gradient(135deg, #67E0FF 0%, #0E6FA8 100%)" 
        : "linear-gradient(135deg, #FFBDD9 0%, #E8438A 100%)";

      const avatarContent = t.image && t.image.trim() !== ""
        ? `<img src="${t.image}" alt="${t.stageName || t.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`
        : `<div class="avatar-fill" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:34px;color:#fff;background:${bgGrad};">${initials(t.stageName || t.name)}</div>`;

      const card = document.createElement("div");
      card.className = `select-hero-card ${isB ? 'side-b' : 'side-g'}`;
      card.style.background = bgGrad;
      
      const displayName = t.stageName && t.stageName.trim() !== "" ? t.stageName : t.name;

      card.innerHTML = `
        ${avatarContent}
        <div class="name-plate">
          <div class="no">${t.id}</div>
          <div class="nm">${displayName}</div>
        </div>
      `;
      card.addEventListener("click", () => {
        if (typeof window.openProfileModal === "function") window.openProfileModal(t);
      });
      selectHeroTrack.appendChild(card);
    });

    let autoScrollTimer = setInterval(() => {
      if (!selectHeroTrack) return;
      const cardWidth = 134; 
      const halfWidth = allMixed.length * cardWidth;

      if (selectHeroTrack.scrollLeft >= halfWidth) {
        selectHeroTrack.scrollTo({ left: 0, behavior: 'instant' });
        selectHeroTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
      } else {
        selectHeroTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3000);

    if (autoScrollWrap) {
      autoScrollWrap.addEventListener("mouseenter", () => clearInterval(autoScrollTimer));
      autoScrollWrap.addEventListener("mouseleave", () => {
        autoScrollTimer = setInterval(() => {
          if (!selectHeroTrack) return;
          const cardWidth = 134;
          const halfWidth = allMixed.length * cardWidth;

          if (selectHeroTrack.scrollLeft >= halfWidth) {
            selectHeroTrack.scrollTo({ left: 0, behavior: 'instant' });
            selectHeroTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
          } else {
            selectHeroTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }, 3000);
      });
    }
  };

  if (selectHeroTrack) {
    let isDown = false;
    let dragMoved = false;
    let startX = 0;
    let startScrollLeft = 0;

    selectHeroTrack.addEventListener("mousedown", (e) => {
      isDown = true;
      dragMoved = false;
      e.preventDefault(); 
      selectHeroTrack.classList.add("dragging");
      startX = e.pageX - selectHeroTrack.offsetLeft;
      startScrollLeft = selectHeroTrack.scrollLeft;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - selectHeroTrack.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 4) dragMoved = true;
      selectHeroTrack.scrollLeft = startScrollLeft - walk;
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      selectHeroTrack.classList.remove("dragging");
    }
    window.addEventListener("mouseup", endDrag);
    selectHeroTrack.addEventListener("mouseleave", () => { if (isDown) endDrag(); });
  }


  
})();