/* ============ SELECTING HERO CAROUSEL (หยุด → เลื่อนนุ่มๆ 1 ใบ → หยุด) ============ */
(function() {
  "use strict";

  const selectHeroTrack = document.getElementById("selectHeroTrack");
  const autoScrollWrap = document.getElementById("autoScrollWrap");

  // ----- ตั้งค่า -----
  const INTERVAL = 3000;       // หยุดพักระหว่างแต่ละก้าว (ms)
  const STEP_DURATION = 500;   // เวลาที่ใช้เลื่อน 1 ใบ (ms) ยิ่งมากยิ่งช้า/นุ่ม
  const RESUME_DELAY = 1500;   // หน่วงก่อนเริ่มเลื่อนต่อหลังปล่อยมือ/เมาส์ (ms)

  // ----- สถานะ -----
  let rafId = null;
  let setLen = 0;              // ความยาวลิสต์ 1 ชุด (ชุดที่ 2 คือก๊อปปี้สำหรับวนลูป)
  let stepW = 0;               // ระยะ 1 ใบ (รวมช่องว่าง) วัดจากของจริง
  let itemCount = 0;
  let hovering = false;
  let dragging = false;
  let touching = false;
  let dragMoved = false;
  let wasPaused = false;
  let nextStepAt = 0;
  let anim = null;             // { from, to, start }

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

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

  // วัดความยาวจริงของ 1 ชุด และระยะ 1 ใบ (แม่นกว่าเดา 134px ไม่งั้นตอนวนลูปจะสะดุด)
  function measure() {
    const kids = selectHeroTrack.children;
    stepW = kids.length > 1 ? kids[1].offsetLeft - kids[0].offsetLeft : 0;
    setLen = itemCount > 0 && kids.length > itemCount
      ? kids[itemCount].offsetLeft - kids[0].offsetLeft
      : 0;
  }

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3); // เริ่มไว แล้วค่อยชะลอจนหยุดนิ่ม

  function tick(ts) {
    rafId = requestAnimationFrame(tick);

    // ผู้ใช้ลาก/สัมผัส/ซ่อนแท็บ: ยกเลิกก้าวที่ค้างอยู่ทันที
    const interrupted = dragging || touching || document.hidden;
    // เมาส์วางทาบ: ปล่อยให้ก้าวที่กำลังเลื่อนอยู่จบแบบนุ่มๆ ก่อน แต่ไม่เริ่มก้าวใหม่
    const paused = interrupted || hovering;

    if (interrupted) anim = null;

    if (anim) {
      const t = Math.min((ts - anim.start) / STEP_DURATION, 1);
      let pos = anim.from + (anim.to - anim.from) * easeOutCubic(t);
      if (setLen && pos >= setLen) { // ข้ามเส้นกลาง → วนกลับต้นแบบมองไม่เห็น
        anim.from -= setLen; anim.to -= setLen; pos -= setLen;
      }
      selectHeroTrack.scrollLeft = pos;
      if (t >= 1) anim = null;
      return;
    }

    if (paused) { wasPaused = true; return; }
    if (wasPaused) { wasPaused = false; nextStepAt = ts + RESUME_DELAY; return; }
    if (!setLen || !stepW || ts < nextStepAt) return;

    const from = selectHeroTrack.scrollLeft;
    anim = { from, to: from + stepW, start: ts };
    nextStepAt = ts + STEP_DURATION + INTERVAL;
  }

  function startLoop() {
    if (rafId || reduceMotion) return;
    nextStepAt = performance.now() + INTERVAL;
    rafId = requestAnimationFrame(tick);
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

    itemCount = allMixed.length;
    selectHeroTrack.innerHTML = "";
    const displayList = [...allMixed, ...allMixed];

    // ปิดตัวที่ทำให้เลื่อนกระตุก (snap / smooth จาก CSS จะสู้กับ requestAnimationFrame)
    selectHeroTrack.style.scrollSnapType = "none";
    selectHeroTrack.style.scrollBehavior = "auto";

    displayList.forEach(t => {
      const isB = t.side === "B";
      const bgGrad = isB
        ? "linear-gradient(135deg, #67E0FF 0%, #0E6FA8 100%)"
        : "linear-gradient(135deg, #FFBDD9 0%, #E8438A 100%)";

      const displayName = t.stageName && t.stageName.trim() !== "" ? t.stageName : t.name;

      const avatarContent = t.image && t.image.trim() !== ""
        ? `<img src="${esc(t.image.trim())}" alt="${esc(displayName)}" decoding="async" draggable="false" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`
        : `<div class="avatar-fill" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:34px;color:#fff;background:${bgGrad};">${esc(initials(displayName))}</div>`;

      const card = document.createElement("div");
      card.className = `select-hero-card ${isB ? "side-b" : "side-g"}`;
      card.style.background = bgGrad;

      card.innerHTML = `
        ${avatarContent}
        <div class="name-plate">
          <div class="no">${esc(t.id)}</div>
          <div class="nm">${esc(displayName)}</div>
        </div>
      `;
      card.addEventListener("click", () => {
        if (dragMoved) return; // ลากอยู่ ไม่ต้องเปิดป๊อปอัป
        if (typeof window.openProfileModal === "function") window.openProfileModal(t);
      });
      selectHeroTrack.appendChild(card);
    });

    selectHeroTrack.scrollLeft = 0;
    anim = null;
    measure();
    startLoop();
  };

  window.addEventListener("resize", measure);

  // ----- หยุดเมื่อเอาเมาส์วาง (เฉพาะเมาส์จริง ไม่งั้นบนมือถือจะค้างหยุด) -----
  const hoverTarget = autoScrollWrap || selectHeroTrack;
  if (hoverTarget) {
    hoverTarget.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") hovering = true;
    });
    hoverTarget.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse") {
        hovering = false;
      }
    });
  }

  if (selectHeroTrack) {
    // ----- สัมผัสบนมือถือ -----
    selectHeroTrack.addEventListener("touchstart", () => { touching = true; }, { passive: true });
    const endTouch = () => { touching = false; };
    selectHeroTrack.addEventListener("touchend", endTouch, { passive: true });
    selectHeroTrack.addEventListener("touchcancel", endTouch, { passive: true });

    // ถ้าผู้ใช้เลื่อนเองเลยครึ่งทาง ให้วนกลับไปต้นชุด
    selectHeroTrack.addEventListener("scroll", () => {
      if (setLen && selectHeroTrack.scrollLeft >= setLen) {
        selectHeroTrack.scrollLeft -= setLen;
      }
    }, { passive: true });

    // ----- ลากด้วยเมาส์ -----
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    selectHeroTrack.addEventListener("mousedown", (e) => {
      isDown = true;
      dragging = true;
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

      let v = startScrollLeft - walk;
      if (setLen && v >= setLen) { v -= setLen; startScrollLeft -= setLen; }
      selectHeroTrack.scrollLeft = v;
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      dragging = false;
      selectHeroTrack.classList.remove("dragging");
    }
    window.addEventListener("mouseup", endDrag);
    selectHeroTrack.addEventListener("mouseleave", endDrag);
  }
})();
