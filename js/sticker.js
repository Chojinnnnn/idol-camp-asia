/* =====================================================================
   MY PICK 10 - STAGE FORMATION DRAG & DROP ENGINE
   ซ้าย (ฝั่งชาย 10 คน/หน้า วนลูป 1-4) | กลาง (ผังวงกลม 2-4-4) | ขวา (ฝั่งหญิง 10 คน/หน้า วนลูป 1-4)
   ===================================================================== */
(function() {
  "use strict";

  const PROFILE_CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSgJm-hdAxCRJmSqni3wlRQmZl4f74DiNMqr6c_O3a5mR913CYCpaiF_NQbWKOpAx6nNjxhC7EoIbwz/pub?gid=1490647966&single=true&output=csv&t=${Date.now()}`;

  const PAGE_SIZE = 10;
  let pageB = 1;
  let pageG = 1;

  let allB = [];
  let allG = [];
  // 10 สล็อตบนกระดานกลาง
  const SLOT_COUNT = 10;
  const STORAGE_KEY = "mypick_pickem_v2";
  let selectedSlots = new Array(SLOT_COUNT).fill(null);

  function isBSide(t) { return t.side === "B" || !!(t.id && t.id.startsWith("B")); }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSlots)); } catch (e) {}
  }
  function restoreState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) return;
      const all = [...allB, ...allG];
      saved.slice(0, SLOT_COUNT).forEach((s, i) => {
        if (!s) return;
        const t = all.find(x => x.id && x.id === s.id) || s;
        if (isBSide(t) === (i < 5)) selectedSlots[i] = t; // ต้องตรงฝั่งกับโซน
      });
    } catch (e) {}
  }

  // DOM Elements
  const containerB = document.getElementById("poolGridB");
  const containerG = document.getElementById("poolGridG");
  const stageSlotsWrap = document.getElementById("stageFormationWrap");
  const countDisplay = document.getElementById("stickerSelectedCount");

  const pageInfoB = document.getElementById("pageInfoB");
  const prevBtnB = document.getElementById("prevBtnB");
  const nextBtnB = document.getElementById("nextBtnB");

  const pageInfoG = document.getElementById("pageInfoG");
  const prevBtnG = document.getElementById("prevBtnG");
  const nextBtnG = document.getElementById("nextBtnG");

  const resetBtn = document.getElementById("stickerStudioResetBtn");

  function getInitials(name) {
    if (!name) return "";
    return name.trim().split(" ")[0].slice(0, 2).toUpperCase();
  }

  // ตัวช่วยเรียงลำดับรหัส B01..B40 และ G01..G40
  function sortTrainees(list) {
    return list.sort((a, b) => {
      const numA = parseInt((a.id || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.id || "").replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });
  }

  // 1. ดึงข้อมูลเด็กฝึก
  function loadTraineeData(callback) {
    if (window.traineesB && window.traineesG && window.traineesB.length > 0) {
      allB = sortTrainees([...window.traineesB]);
      allG = sortTrainees([...window.traineesG]);
      callback();
      return;
    }
    if (window.traineesData && window.traineesData.b) {
      allB = sortTrainees([...window.traineesData.b]);
      allG = sortTrainees([...window.traineesData.g]);
      callback();
      return;
    }

    if (typeof Papa !== "undefined") {
      Papa.parse(PROFILE_CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(res) {
          const rows = res.data || [];
          allB = [];
          allG = [];

          rows.forEach(r => {
            const side = (r.side || r.Side || "").toString().trim().toUpperCase();
            const id = (r.id || r.ID || r.no || "").toString().trim();
            const name = (r.name || r.Name || "").toString().trim();
            const stageName = (r.stageName || r.stagename || r.StageName || name).toString().trim();
            const image = (r.image || r.Image || r.pic || r.Pic || "").toString().trim();

            if (!name && !stageName) return;

            const trainee = { id, name, stageName, image, side: side || (id.startsWith("B") ? "B" : "G") };
            if (trainee.side === "B" || id.startsWith("B")) {
              allB.push(trainee);
            } else {
              allG.push(trainee);
            }
          });

          allB = sortTrainees(allB);
          allG = sortTrainees(allG);
          callback();
        },
        error: function() {
          callback();
        }
      });
    } else {
      callback();
    }
  }

  // 2. แสดงผลรายชื่อเด็กฝึกวงกลมฝั่งซ้าย/ขวา (หน้าละ 10 คน)
  function renderPool(side) {
    const isB = side === "B";
    const list = isB ? allB : allG;
    const page = isB ? pageB : pageG;
    const container = isB ? containerB : containerG;
    const pageInfo = isB ? pageInfoB : pageInfoG;

    if (!container) return;
    container.innerHTML = "";

    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const startIdx = (page - 1) * PAGE_SIZE;
    const pageItems = list.slice(startIdx, startIdx + PAGE_SIZE);

    if (pageInfo) pageInfo.textContent = `${page} / ${totalPages}`;

    const themeColor = isB ? "#0E6FA8" : "#E8438A";
    const tagBg = isB ? "#E8F7FD" : "#FFF0F6";

    pageItems.forEach(t => {
      const isPlaced = selectedSlots.some(s => s && ((s.id && s.id === t.id) || s.name === t.name));
      const displayName = t.stageName || t.name;

      const item = document.createElement("div");
      item.className = `trainee-circle-item ${isPlaced ? 'placed' : ''}`;
      item.draggable = !isPlaced;

      // บังคับ Inline Style เพื่อไม่ให้รูปภาพแตกหรือล้นกรอบเด็ดขาด
      item.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: ${isPlaced ? 'not-allowed' : 'grab'};
        padding: 6px 4px;
        border-radius: 14px;
        background: #FAFCFE;
        border: 1.5px solid ${isPlaced ? '#DDE5EA' : '#E9F1F6'};
        user-select: none;
        opacity: ${isPlaced ? '0.35' : '1'};
        filter: ${isPlaced ? 'grayscale(85%)' : 'none'};
        box-sizing: border-box;
      `;

      const imgHtml = (t.image && t.image.trim() !== "")
        ? `<img src="${t.image}" alt="${displayName}" style="width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: top center !important; border-radius: 50% !important; display: block !important; pointer-events: none !important;">`
        : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; background: ${themeColor}; border-radius: 50%;">${getInitials(displayName)}</div>`;

      item.innerHTML = `
        <div style="width: 54px !important; height: 54px !important; min-width: 54px !important; max-width: 54px !important; min-height: 54px !important; max-height: 54px !important; border-radius: 50% !important; overflow: hidden !important; position: relative !important; background: #E8EDF2; border: 2.5px solid ${themeColor}; box-shadow: 0 4px 10px -2px rgba(0,0,0,0.12); flex-shrink: 0; pointer-events: none; margin-bottom: 4px;">
          ${imgHtml}
        </div>
        <span style="display: inline-block; font-size: 9px; font-weight: 800; color: ${themeColor}; background: ${tagBg}; padding: 1px 5px; border-radius: 4px; line-height: 1.2;">${t.id || (isB ? 'B' : 'G')}</span>
        <span style="font-family: var(--font-display, 'Kanit', sans-serif); font-size: 11px; font-weight: 800; color: var(--text-strong, #173447); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; max-width: 90px; margin-top: 2px; line-height: 1.2;" title="${displayName}">${displayName}</span>
      `;

      // Drag Events
      item.addEventListener("dragstart", (e) => {
        if (isPlaced) { e.preventDefault(); return; }
        e.dataTransfer.setData("text/plain", JSON.stringify(t));
      });

      // Click to Auto-Place
      item.addEventListener("click", () => {
        if (isPlaced) {
          const slotIdx = selectedSlots.findIndex(s => s && ((s.id && s.id === t.id) || s.name === t.name));
          if (slotIdx > -1) removeSlot(slotIdx);
          return;
        }
        placeIntoFirstEmpty(t);
      });

      container.appendChild(item);
    });
  }


  // 3. วางลงช่องแรกที่ว่าง (เฉพาะโซนของฝั่งตัวเอง)
  function placeIntoFirstEmpty(trainee) {
    const start = isBSide(trainee) ? 0 : 5;
    const i = selectedSlots.slice(start, start + 5).findIndex(s => s === null);
    if (i === -1) {
      alert(`⭐ ช่อง${start === 0 ? "ฝั่งชาย" : "ฝั่งหญิง"}ครบ 5 คนแล้ว! (คลิกที่วงกลมบนกระดานเพื่อยกเลิกโหวต)`);
      return;
    }
    placeSlot(start + i, trainee);
  }

  // 4. แปะสติ๊กเกอร์ลงสล็อตที่เจาะจง
  function placeSlot(index, trainee) {
    if (isBSide(trainee) !== (index < 5)) return false; // ผิดฝั่ง ไม่ให้วาง
    const existingIdx = selectedSlots.findIndex(s => s && ((s.id && s.id === trainee.id) || s.name === trainee.name));
    if (existingIdx > -1) {
      selectedSlots[existingIdx] = null;
    }
    selectedSlots[index] = trainee;
    saveState();
    renderBoard();
    renderPool("B");
    renderPool("G");
  }

  // 5. แกะสติ๊กเกอร์ออกจากสล็อต
  function removeSlot(index) {
    selectedSlots[index] = null;
    saveState();
    renderBoard();
    renderPool("B");
    renderPool("G");
  }

  // 6. อัปเดตกระดานวงกลม 2-4-4 ตรงกลาง
  function renderBoard() {
    if (!stageSlotsWrap) return;
    const slots = stageSlotsWrap.querySelectorAll(".board-circle-slot");

    let count = 0;
    slots.forEach((slot, idx) => {
      const t = selectedSlots[idx];
      const emptyColor = idx < 5 ? '14, 111, 168' : '232, 67, 138';
      if (t) {
        count++;
        const isB = (t.side === "B" || (t.id && t.id.startsWith("B")));
        const displayName = t.stageName || t.name;
        const themeColor = isB ? "#0E6FA8" : "#E8438A";

        const photoHtml = (t.image && t.image.trim() !== "")
          ? `<img src="${t.image}" alt="${displayName}" style="width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: top center !important; border-radius: 50% !important; display: block !important; pointer-events: none !important;">`
          : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: #fff; background: ${themeColor}; border-radius: 50%;">${getInitials(displayName)}</div>`;

        slot.className = `board-circle-slot filled ${isB ? 'side-b' : 'side-g'}`;
        slot.style.position = "relative";
        slot.style.display = "flex";
        slot.style.flexDirection = "column";
        slot.style.alignItems = "center";
        slot.style.cursor = "pointer";

        slot.innerHTML = `
          <button type="button" class="btn-remove-circle" style="position: absolute; top: -3px; right: 2px; width: 20px; height: 20px; border-radius: 50%; background: rgba(23, 52, 71, 0.85); color: #fff; border: 1.5px solid #fff; font-size: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;" title="แกะออก">✕</button>
          <div style="width: 66px !important; height: 66px !important; min-width: 66px !important; max-width: 66px !important; min-height: 66px !important; max-height: 66px !important; border-radius: 50% !important; overflow: hidden !important; position: relative !important; border: 3px solid ${themeColor} !important; box-shadow: 0 8px 18px -4px rgba(23, 52, 71, 0.25); background: #fff;">
            ${photoHtml}
          </div>
          <span style="font-family: var(--font-display, 'Kanit', sans-serif); font-size: 11px; font-weight: 800; color: var(--text-strong, #173447); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 74px; text-align: center; margin-top: 4px;" title="${displayName}">${displayName}</span>
        `;

        slot.onclick = () => removeSlot(idx);
      } else {
        slot.className = "board-circle-slot empty";
        slot.style.position = "relative";
        slot.style.display = "flex";
        slot.style.flexDirection = "column";
        slot.style.alignItems = "center";

        slot.innerHTML = `
          <div class="slot-circle-disc" style="width: 66px; height: 66px; min-width: 66px; max-width: 66px; min-height: 66px; max-height: 66px; border-radius: 50%; border: 2.5px dashed rgba(${emptyColor}, 0.4); background: rgba(255, 255, 255, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
            <span style="font-size: 20px; line-height: 1; color: rgba(${emptyColor}, 0.5);">＋</span>
          </div>
          <span style="font-family: var(--font-display, 'Kanit', sans-serif); font-size: 10.5px; font-weight: 800; color: #7A92A3; margin-top: 4px;">PICK ${String((idx % 5) + 1).padStart(2, '0')}</span>
        `;
        slot.onclick = null;
      }

      // Drag & Drop
      slot.ondragover = (e) => { e.preventDefault(); slot.classList.add("drag-over"); };
      slot.ondragleave = () => { slot.classList.remove("drag-over"); };
      slot.ondrop = (e) => {
        e.preventDefault();
        slot.classList.remove("drag-over");
        try {
          const raw = e.dataTransfer.getData("text/plain");
          if (raw) {
            const trainee = JSON.parse(raw);
            if (placeSlot(idx, trainee) === false) {
              slot.style.outline = "3px solid #ff5a5a";
              setTimeout(() => slot.style.outline = "", 450);
            }
          }
        } catch (err) {}
      };
    });

    if (countDisplay) countDisplay.textContent = count;
  }

  // 7. จัดการปุ่มเปลี่ยนหน้าแบบ "วนลูปกลับมาหน้าแรก"
  // ฝั่งชาย B-TRAINEES (หน้า 1..4 วนลูป)
  if (prevBtnB) {
    prevBtnB.onclick = () => {
      const totalPages = Math.max(1, Math.ceil(allB.length / PAGE_SIZE));
      pageB = (pageB > 1) ? pageB - 1 : totalPages;
      renderPool("B");
    };
  }
  if (nextBtnB) {
    nextBtnB.onclick = () => {
      const totalPages = Math.max(1, Math.ceil(allB.length / PAGE_SIZE));
      pageB = (pageB < totalPages) ? pageB + 1 : 1;
      renderPool("B");
    };
  }

  // ฝั่งหญิง G-TRAINEES (หน้า 1..4 วนลูป)
  if (prevBtnG) {
    prevBtnG.onclick = () => {
      const totalPages = Math.max(1, Math.ceil(allG.length / PAGE_SIZE));
      pageG = (pageG > 1) ? pageG - 1 : totalPages;
      renderPool("G");
    };
  }
  if (nextBtnG) {
    nextBtnG.onclick = () => {
      const totalPages = Math.max(1, Math.ceil(allG.length / PAGE_SIZE));
      pageG = (pageG < totalPages) ? pageG + 1 : 1;
      renderPool("G");
    };
  }

  // 8. ปุ่มรีเซ็ต
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (selectedSlots.every(s => s === null)) return;
      if (confirm("ต้องการล้างโหวตทั้งหมดหรือไม่?")) {
        selectedSlots = new Array(SLOT_COUNT).fill(null);
        saveState();
        renderBoard();
        renderPool("B");
        renderPool("G");
      }
    };
  }

  // Init
  loadTraineeData(() => {
    restoreState();
    renderPool("B");
    renderPool("G");
    renderBoard();
  });
})();
