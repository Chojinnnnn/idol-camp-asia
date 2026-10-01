/* ============ NAVIGATION & CENTER ADS POPUP ============ */
(function() {
  "use strict";

  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  const battleMainBtn = document.getElementById("battleMainBtn");
  const battleDropdownWrap = document.getElementById("battleDropdownWrap");

  window.activateTab = function(tabName) {
    if (!tabName) return;

    tabBtns.forEach(b => {
      b.classList.toggle("active", b.dataset.tab === tabName);
    });

    panels.forEach(p => p.classList.remove("active"));
    const target = document.getElementById(`panel-${tabName}`);
    if (target) target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // เมื่อกดเข้าแท็บ TITLE SONG จะเรียกฟังก์ชันแสดงป๊อปอัป Center
    if (tabName === "title-song" && typeof window.checkAndShowCenterAds === "function") {
      window.checkAndShowCenterAds();
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = btn.dataset.tab;
      if (!tab) return;

      if (tab === "battle") {
        e.stopPropagation();
        window.activateTab("battle");
        if (battleDropdownWrap) battleDropdownWrap.classList.toggle("show");
      } else {
        if (battleDropdownWrap) battleDropdownWrap.classList.remove("show");
        window.activateTab(tab);
      }
    });
  });

  document.querySelectorAll("[data-tab-target]").forEach(el => {
    el.addEventListener("click", () => {
      if (battleDropdownWrap) battleDropdownWrap.classList.remove("show");
      window.activateTab(el.dataset.tabTarget || "home");
    });
  });

  document.addEventListener("click", (e) => {
    if (battleDropdownWrap && !battleDropdownWrap.contains(e.target)) {
      battleDropdownWrap.classList.remove("show");
    }
  });

  /* ============ POPUP CENTER RENDERER (ควบคุมผ่าน nav.js) ============ */
  const centerAdsBackdrop = document.getElementById("centerAdsBackdrop");
  
  window.checkAndShowCenterAds = function() {
    if (!centerAdsBackdrop) return;

    // แทรกโครงสร้าง HTML และรูปภาพของ Center (Sa Haerang & Mebara Tomiko) ผ่าน JS โดยตรง
    centerAdsBackdrop.innerHTML = `
      <div class="center-ads-modal">
        <button class="modal-close" onclick="closeCenterAds()">✕</button>
        <div class="ads-badge">OFFICIAL ANNOUNCEMENT</div>
        <h2 class="ads-title">🎉 ขอแสดงความยินดีอย่างเป็นทางการ</h2>
        <p class="ads-subtitle">สำหรับการได้รับเลือกเป็น <b>CENTER</b> เพลงประจำรายการ</p>

        <div class="ads-centers-wrap" style="margin-bottom: 0;">
          <!-- B-Trainee Center: Sa Haerang (zoren) -->
          <div class="ads-center-card side-b">
            <div class="ads-avatar-wrap">
              <div class="ads-tag-pill b-tag">B-CENTER</div>
              <img class="ads-avatar-img" src="https://lh3.googleusercontent.com/d/1Tly8g24k9ng6ZpVI6ofieM3-TNRROykz" alt="Sa Haerang">
            </div>
            <div class="ads-name">Sa Haerang</div>
            <div class="ads-stage">zoren</div>
            <div class="ads-song">Skyline</div>
          </div>

          <!-- G-Trainee Center: Mebara Tomiko (Tomiko) -->
          <div class="ads-center-card side-g">
            <div class="ads-avatar-wrap">
              <div class="ads-tag-pill g-tag">G-CENTER</div>
              <img class="ads-avatar-img" src="https://lh3.googleusercontent.com/d/1V9qrqGlsinIEzrRMTOuCevMi9NTAnkIy" alt="Mebara Tomiko">
            </div>
            <div class="ads-name">Mebara Tomiko</div>
            <div class="ads-stage">Tomiko</div>
            <div class="ads-song">Summer Dream</div>
          </div>
        </div>
      </div>
    `;

    centerAdsBackdrop.style.display = "flex";
    centerAdsBackdrop.classList.add("open");
  };

  window.closeCenterAds = function() {
    if (centerAdsBackdrop) {
      centerAdsBackdrop.style.display = "none";
      centerAdsBackdrop.classList.remove("open");
    }
  };

  if (centerAdsBackdrop) {
    centerAdsBackdrop.addEventListener("click", (e) => {
      if (e.target === centerAdsBackdrop) {
        window.closeCenterAds();
      }
    });
  }
})();