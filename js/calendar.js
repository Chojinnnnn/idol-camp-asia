/* ============ PROGRAM SCHEDULE & GOOGLE SHEETS CALENDAR ============ */
(function() {
  "use strict";

  const calLabel = document.getElementById("calLabel");
  const calGrid = document.getElementById("calGrid");
  const calWeekdays = document.getElementById("calWeekdays");
  const eventLegend = document.getElementById("eventLegend");

  const THAI_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const WEEKDAYS_TH = ["อา","จ","อ","พ","พฤ","ศ","ส"];

  const currentNow = new Date();
  let calYear = currentNow.getFullYear();
  let calMonth = currentNow.getMonth();
  let CALENDAR_EVENTS = {};

  const EVENT_LABELS = {
    Announcement:      { tagColor: "#F1C40F", barBg: "#F1C40F", textColor: "#222222", text: "ประกาศ" },
    "Title Song":      { tagColor: "#E67E22", barBg: "#E67E22", textColor: "#ffffff", text: "Title Song" },
    Deadline:          { tagColor: "#E74C3C", barBg: "#E74C3C", textColor: "#ffffff", text: "Deadline" },
    Broadcast:         { tagColor: "#9B59B6", barBg: "#9B59B6", textColor: "#ffffff", text: "ออกอากาศ" },
    Vote:              { tagColor: "#3498DB", barBg: "#3498DB", textColor: "#ffffff", text: "โหวต" },
    "Round 1":         { tagColor: "#2ECC71", barBg: "#2ECC71", textColor: "#ffffff", text: "Round 1" },
    "Round 2":         { tagColor: "#1ABC9C", barBg: "#1ABC9C", textColor: "#ffffff", text: "Round 2" },
    "Round 2 (Light)": { tagColor: "#1ABC9C", barBg: "#A3E4D7", textColor: "#0E6251", text: "Round 2" },
    "Round 3":         { tagColor: "#E67E22", barBg: "#E67E22", textColor: "#ffffff", text: "Round 3" },
    "Round 3 (Light)": { tagColor: "#E67E22", barBg: "#FAD7A0", textColor: "#7E5109", text: "Round 3" },
    "Round 4":         { tagColor: "#8E44AD", barBg: "#8E44AD", textColor: "#ffffff", text: "Round 4" },
    "Round 4 (Light)": { tagColor: "#8E44AD", barBg: "#D7BDE2", textColor: "#512E5F", text: "Round 4" }
  };

  if(calWeekdays){
    calWeekdays.innerHTML = "";
    WEEKDAYS_TH.forEach(d=>{
      const el = document.createElement("div");
      el.textContent = d;
      calWeekdays.appendChild(el);
    });
  }

  if(eventLegend){
    eventLegend.innerHTML = "";
    Object.entries(EVENT_LABELS).forEach(([key, val])=>{
      const span = document.createElement("span");
      span.style.cssText = "display: inline-flex; align-items: center; margin-right: 12px; font-size: 12px;";
      span.innerHTML = `<span class="legend-dot" style="background:${val.tagColor}"></span>${val.text}`;
      eventLegend.appendChild(span);
    });
  }

  function parseLocalDate(dateStr) {
    if(!dateStr) return null;
    const parts = dateStr.trim().split("-");
    if(parts.length < 3) return null;
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }

  function getDatesInRange(startDateStr, endDateStr) {
    const start = parseLocalDate(startDateStr);
    const end = parseLocalDate(endDateStr);
    if(!start || !end) return [];
    
    const dateArray = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      dateArray.push(`${year}-${month}-${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  const PROGRAM_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgJm-hdAxCRJmSqni3wlRQmZl4f74DiNMqr6c_O3a5mR913CYCpaiF_NQbWKOpAx6nNjxhC7EoIbwz/pub?gid=1742091601&single=true&output=csv";

  if (typeof Papa !== 'undefined') {
    Papa.parse(PROGRAM_CSV_URL, {
      download: true,
      header: true,
      complete: function(results) {
        CALENDAR_EVENTS = {};
        results.data.forEach(row => {
          const start = row.start_date ? row.start_date.trim() : "";
          const end = row.end_date ? row.end_date.trim() : start;
          
          if(start) {
            const range = getDatesInRange(start, end || start);
            range.forEach((dateKey, index) => {
              if(!CALENDAR_EVENTS[dateKey]) {
                CALENDAR_EVENTS[dateKey] = [];
              }
              const rawType = row.type ? row.type.trim() : "Announcement";
              const matchedType = EVENT_LABELS[rawType] ? rawType : "Announcement";

              CALENDAR_EVENTS[dateKey].push({
                type: matchedType,
                label: row.label ? row.label.trim() : "",
                startDate: start,
                endDate: end,
                isFirst: index === 0
              });
            });
          }
        });
        renderCalendar();
      }
    });
  }

  let hoverCard = document.getElementById("calendarHoverCard");
  if(!hoverCard){
    hoverCard = document.createElement("div");
    hoverCard.id = "calendarHoverCard";
    hoverCard.style.cssText = "position:absolute; display:none; background:#fff; border:1px solid var(--border); border-radius:12px; padding:12px 16px; box-shadow:0 10px 25px rgba(0,0,0,0.15); z-index:999; pointer-events:none; width:220px; transition:opacity 0.2s ease;";
    document.body.appendChild(hoverCard);
  }

  function hideHoverCard() {
    if (hoverCard) {
      hoverCard.style.display = "none";
      hoverCard.innerHTML = "";
    }
  }

  function showHoverCard(eventsList, targetEl) {
    if (!eventsList || eventsList.length === 0) return;
    const rect = targetEl.getBoundingClientRect();
    
    const contentHtml = eventsList.map((ev, idx) => {
      const cfg = EVENT_LABELS[ev.type] || { tagColor: "#3498DB", barBg: "#3498DB", textColor: "#ffffff", text: ev.type };
      const isLast = idx === eventsList.length - 1;
      return `
        <div style="${!isLast ? 'border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 8px;' : ''}">
          <div style="margin-bottom: 4px;">
            <span style="display: inline-block; background-color: #fff; color: ${cfg.tagColor}; border: 1.5px solid ${cfg.tagColor}; font-size: 10px; font-weight: 800; padding: 1px 7px; border-radius: 999px;">${cfg.text}</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #222; margin-bottom: 4px;">${ev.label || cfg.text}</div>
          <div style="font-size: 11px; color: #666;">📅 ${ev.startDate} ถึง ${ev.endDate}</div>
        </div>
      `;
    }).join('');

    hoverCard.innerHTML = contentHtml;
    hoverCard.style.display = "block";
    
    const topPos = window.scrollY + rect.top - hoverCard.offsetHeight - 8;
    hoverCard.style.top = (topPos < window.scrollY ? window.scrollY + rect.bottom + 8 : topPos) + "px";
    hoverCard.style.left = (window.scrollX + rect.left + (rect.width / 2) - (hoverCard.offsetWidth / 2)) + "px";
  }

  function renderCalendar(){
    if(!calLabel || !calGrid) return;
    calLabel.textContent = `${THAI_MONTHS[calMonth]} ${calYear}`;
    calGrid.innerHTML = "";

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();

    for(let i=0; i<firstDay; i++){
      const empty = document.createElement("div");
      empty.className = "cal-cell empty";
      calGrid.appendChild(empty);
    }

    for(let d=1; d<=daysInMonth; d++){
      const cell = document.createElement("div");
      const isToday = today.getFullYear()===calYear && today.getMonth()===calMonth && today.getDate()===d;
      cell.className = "cal-cell" + (isToday ? " today" : "");
      
      const key = `${calYear}-${calMonth+1}-${d}`;
      const events = CALENDAR_EVENTS[key] || [];
      let eventsHTML = `<div class="cal-daynum">${d}</div>`;

      if(events.length > 0) {
        eventsHTML += `<div class="cal-event-wrapper"><div class="cal-events-tags">`;
        events.forEach((ev) => {
          const cfg = EVENT_LABELS[ev.type] || { tagColor: "#3498DB", barBg: "#3498DB", textColor: "#ffffff", text: ev.type };
          eventsHTML += `<span class="cal-tag-badge" style="color: ${cfg.tagColor};">${cfg.text}</span>`;
        });
        eventsHTML += `</div>`;

        events.forEach((ev) => {
          const cfg = EVENT_LABELS[ev.type] || { tagColor: "#3498DB", barBg: "#3498DB", textColor: "#ffffff", text: ev.type };
          const showLabel = ev.isFirst || new Date(calYear, calMonth, d).getDay() === 0;
          const labelText = showLabel ? (ev.label || cfg.text) : '&nbsp;';
          eventsHTML += `<span class="cal-event-bar" style="background-color: ${cfg.barBg}; color: ${cfg.textColor};">${labelText}</span>`;
        });
        eventsHTML += `</div>`;
      }

      cell.innerHTML = eventsHTML;
      calGrid.appendChild(cell);

      if(events.length > 0) {
        cell.addEventListener("mouseenter", (e) => showHoverCard(events, e.currentTarget));
        cell.addEventListener("mouseleave", hideHoverCard);
      } else {
        cell.addEventListener("mouseenter", hideHoverCard);
      }
    }
  }

  const calPrevBtn = document.getElementById("calPrev");
  const calNextBtn = document.getElementById("calNext");

  if(calPrevBtn){
    calPrevBtn.addEventListener("click", ()=>{
      calMonth--;
      if(calMonth < 0){ calMonth = 11; calYear--; }
      renderCalendar();
    });
  }
  if(calNextBtn){
    calNextBtn.addEventListener("click", ()=>{
      calMonth++;
      if(calMonth > 11){ calMonth = 0; calYear++; }
      renderCalendar();
    });
  }

  if (calGrid) {
    calGrid.addEventListener("mouseleave", hideHoverCard);
  }
  window.addEventListener("scroll", hideHoverCard, { passive: true });

  renderCalendar();
})();