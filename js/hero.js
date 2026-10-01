/* ============ SELECTING HERO CAROUSEL (ULTRA SMOOTH & MOMENTUM) ============ */
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

    const shuffledB = shuffle(traineesB || []);
    const shuffledG = shuffle(traineesG || []);
    const allMixed = [];
    const maxLen = Math.max(shuffledB.length, shuffledG.length);
    
    for (let i = 0; i < maxLen; i++) {
      if (shuffledB[i]) allMixed.push(shuffledB[i]);
      if (shuffledG[i]) allMixed.push(shuffledG[i]);
    }

    if (allMixed.length === 0) return;

    selectHeroTrack.innerHTML = "";
    // โคลน 2 ชุดเพื่อทำ Seamless Infinite Loop
    const displayList = [...allMixed, ...allMixed];

    displayList.forEach(t => {
      const isB = t.side === "B";
      const bgGrad = isB 
        ? "linear-gradient(135deg, #67E0FF 0%, #0E6FA8 100%)" 
        : "linear-gradient(135deg, #FFBDD9 0%, #E8438A 100%)";

      const avatarContent = t.image && t.image.trim() !== ""
        ? `<img src="${t.image}" alt="${t.stageName || t.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;-webkit-user-drag:none;user-select:none;">`
        : `<div class="avatar-fill" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:34px;color:#fff;background:${bgGrad};user-select:none;">${initials(t.stageName || t.name)}</div>`;

      const card = document.createElement("div");
      card.className = `select-hero-card ${isB ? 'side-b' : 'side-g'}`;
      card.style.background = bgGrad;
      card.style.userSelect = "none";
      card.style.webkitUserSelect = "none";
      
      const displayName = t.stageName && t.stageName.trim() !== "" ? t.stageName : t.name;

      card.innerHTML = `
        ${avatarContent}
        <div class="name-plate" style="pointer-events:none;">
          <div class="no">${t.id}</div>
          <div class="nm">${displayName}</div>
        </div>
      `;
      card.addEventListener("click", () => {
        if (!window.__heroHasDragged && typeof window.openProfileModal === "function") {
          window.openProfileModal(t);
        }
      });
      selectHeroTrack.appendChild(card);
    });

    // -------------------------------------------------------------
    // ระบบ Physics Momentum & Continuous Smooth Auto-Glide (60-240Hz)
    // -------------------------------------------------------------
    let isDown = false;
    let isHovered = false;
    window.__heroHasDragged = false;
    let startX = 0;
    let lastX = 0;
    let lastPointerTime = performance.now();
    let dragVelocity = 0;
    const baseSpeed = 45; // ความเร็วเดินหน้าอัตโนมัติ (px/วินาที)
    let currentVelocity = baseSpeed;
    let lastFrameTime = performance.now();
    let animId = null;

    function getHalfWidth() {
      return (selectHeroTrack.scrollWidth / 2) || 1;
    }

    const wrapEl = autoScrollWrap || selectHeroTrack;

    wrapEl.addEventListener("mouseenter", () => { isHovered = true; });
    wrapEl.addEventListener("mouseleave", () => {
      isHovered = false;
      lastFrameTime = performance.now();
    });

    function onPointerDown(clientX) {
      isDown = true;
      window.__heroHasDragged = false;
      startX = clientX;
      lastX = clientX;
      lastPointerTime = performance.now();
      dragVelocity = 0;
      selectHeroTrack.classList.add("dragging");
    }

    function onPointerMove(clientX) {
      if (!isDown) return;
      const now = performance.now();
      const dt = (now - lastPointerTime) / 1000;
      const dx = clientX - lastX;

      if (Math.abs(clientX - startX) > 6) {
        window.__heroHasDragged = true;
      }

      selectHeroTrack.scrollLeft -= dx;
      const halfWidth = getHalfWidth();
      if (selectHeroTrack.scrollLeft >= halfWidth) {
        selectHeroTrack.scrollLeft -= halfWidth;
      } else if (selectHeroTrack.scrollLeft <= 0) {
        selectHeroTrack.scrollLeft += halfWidth;
      }

      if (dt > 0.005) {
        const instantVelocity = -dx / dt;
        dragVelocity = dragVelocity * 0.3 + instantVelocity * 0.7;
        lastPointerTime = now;
        lastX = clientX;
      }
    }

    function onPointerUp() {
      if (!isDown) return;
      isDown = false;
      selectHeroTrack.classList.remove("dragging");

      // ส่งแรงเฉื่อยตอนปล่อยมือ ป้องกันการหยุดกึก (Momentum Lerp)
      const maxFling = 900;
      currentVelocity = Math.max(-maxFling, Math.min(maxFling, dragVelocity));
      lastFrameTime = performance.now();
      setTimeout(() => { window.__heroHasDragged = false; }, 80);
    }

    // Mouse Listeners
    selectHeroTrack.addEventListener("mousedown", (e) => onPointerDown(e.pageX));
    window.addEventListener("mousemove", (e) => onPointerMove(e.pageX));
    window.addEventListener("mouseup", onPointerUp);

    // Touch Listeners (มือถือ / แท็บเล็ต)
    selectHeroTrack.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches[0]) onPointerDown(e.touches[0].pageX);
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) onPointerMove(e.touches[0].pageX);
    }, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    window.addEventListener("touchcancel", onPointerUp);

    // Physics Loop ต่อเนื่อง ไม่มี Jump / ไม่มีกึก
    function physicsTick(now) {
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      if (!isDown) {
        const target = isHovered ? 0 : baseSpeed;
        // Smooth Lerp ค่อยๆ ดึงความเร็วกลับสู่ปกติแบบเนียนกริบ
        currentVelocity = currentVelocity * 0.94 + target * 0.06;

        selectHeroTrack.scrollLeft += currentVelocity * dt;
        const halfWidth = getHalfWidth();
        if (selectHeroTrack.scrollLeft >= halfWidth) {
          selectHeroTrack.scrollLeft -= halfWidth;
        } else if (selectHeroTrack.scrollLeft <= 0) {
          selectHeroTrack.scrollLeft += halfWidth;
        }
      }

      animId = requestAnimationFrame(physicsTick);
    }

    if (animId) cancelAnimationFrame(animId);
    lastFrameTime = performance.now();
    animId = requestAnimationFrame(physicsTick);
  };
})();
