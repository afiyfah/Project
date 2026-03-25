// ================================================================
      // KERANJANG PAGE SCRIPT — tidak bentrok dengan script.js
      // ================================================================

      const SVG_CHECK =
        '<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      // Harga satuan per item
      const KP = {
        ag: { 1: 17000, 2: 18000 },
        boj: { 1: 17000 },
        gw: { 1: 17000 },
      };

      let selectedStore = null; // toko yang dipilih (hanya 1)

      // ---- Tab ----
      function switchTab(tab) {
        document.querySelectorAll(".k-tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
        document.getElementById("tab-" + tab).classList.add("active");
        document.getElementById("pane-" + tab).classList.add("active");
      }

      // ---- Accordion ----
      function toggleAcc(id) {
        const body = document.getElementById(id);
        const icon = document.getElementById("ico-" + id);
        if (!body) return;
        const open = body.classList.toggle("open");
        if (icon)
          icon.className =
            (open ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line") + " text-gray-400 transition-transform duration-300";
      }

      // ---- Pilih Toko (hanya 1 boleh aktif) ----
      function selectStore(sid) {
        const all = Object.keys(KP);

        if (selectedStore === sid) {
          // Deselect
          selectedStore = null;
          all.forEach((s) => {
            document.getElementById("radio-" + s).classList.remove("checked", "locked");
            lockItems(s, true); // disable semua item
          });
        } else {
          selectedStore = sid;
          all.forEach((s) => {
            const r = document.getElementById("radio-" + s);
            if (s === sid) {
              r.classList.add("checked");
              r.classList.remove("locked");
              lockItems(s, false); // enable item toko ini
            } else {
              r.classList.remove("checked");
              r.classList.add("locked");
              uncheckItems(s);
              lockItems(s, true); // disable item toko lain
            }
          });
          // Enable tombol pilih semua
          document.getElementById("chk-all").classList.remove("disabled");
        }
        updateGrandTotal();
      }

      function lockItems(sid, lock) {
        Object.keys(KP[sid] || {}).forEach((iid) => {
          const chk = document.getElementById("chk-" + sid + "-" + iid);
          if (chk) chk.classList.toggle("disabled", lock);
        });
      }

      function uncheckItems(sid) {
        Object.keys(KP[sid] || {}).forEach((iid) => {
          const chk = document.getElementById("chk-" + sid + "-" + iid);
          if (chk) {
            chk.classList.remove("checked");
            chk.innerHTML = "";
          }
        });
      }

      // ---- Toggle item checkbox ----
      function toggleItemCheck(sid, iid) {
        if (selectedStore !== sid) return; // hanya toko aktif
        const chk = document.getElementById("chk-" + sid + "-" + iid);
        if (chk.classList.contains("disabled")) return;
        const now = !chk.classList.contains("checked");
        chk.classList.toggle("checked", now);
        chk.innerHTML = now ? SVG_CHECK : "";
        updateGrandTotal();
        syncAllCheckbox();
      }

      // ---- Pilih Semua (hanya item toko yang dipilih) ----
      function toggleAllItems() {
        const allChk = document.getElementById("chk-all");
        if (allChk.classList.contains("disabled")) return;
        const now = !allChk.classList.contains("checked");
        allChk.classList.toggle("checked", now);
        allChk.innerHTML = now ? SVG_CHECK : "";
        if (!selectedStore) return;
        Object.keys(KP[selectedStore]).forEach((iid) => {
          const chk = document.getElementById("chk-" + selectedStore + "-" + iid);
          if (chk && !chk.classList.contains("disabled")) {
            chk.classList.toggle("checked", now);
            chk.innerHTML = now ? SVG_CHECK : "";
          }
        });
        updateGrandTotal();
      }

      function syncAllCheckbox() {
        if (!selectedStore) return;
        const allChk = document.getElementById("chk-all");
        const items = Object.keys(KP[selectedStore]);
        const allChecked = items.every((iid) =>
          document.getElementById("chk-" + selectedStore + "-" + iid)?.classList.contains("checked"),
        );
        allChk.classList.toggle("checked", allChecked);
        allChk.innerHTML = allChecked ? SVG_CHECK : "";
      }

      // ---- Qty ----
      function changeQty(sid, iid, delta) {
        const el = document.getElementById("qty-" + sid + "-" + iid);
        const val = Math.max(1, parseInt(el.textContent) + delta);
        el.textContent = val;
        const harga = KP[sid]?.[iid] || 0;
        const t = document.getElementById("total-" + sid + "-" + iid);
        if (t) t.textContent = "Rp" + (harga * val).toLocaleString("id-ID");
        recalcSubtotal(sid);
        updateGrandTotal();
      }

      function recalcSubtotal(sid) {
        let qty = 0,
          rp = 0;
        Object.keys(KP[sid] || {}).forEach((iid) => {
          const q = parseInt(document.getElementById("qty-" + sid + "-" + iid)?.textContent || 1);
          qty += q;
          rp += KP[sid][iid] * q;
        });
        const c = document.getElementById("itemcount-" + sid);
        const s = document.getElementById("subtotal-" + sid);
        if (c) c.textContent = qty + " item";
        if (s) s.textContent = "Rp" + rp.toLocaleString("id-ID");
      }

      function updateGrandTotal() {
        let total = 0;
        if (selectedStore) {
          Object.keys(KP[selectedStore] || {}).forEach((iid) => {
            const chk = document.getElementById("chk-" + selectedStore + "-" + iid);
            if (chk?.classList.contains("checked")) {
              const q = parseInt(document.getElementById("qty-" + selectedStore + "-" + iid)?.textContent || 1);
              total += KP[selectedStore][iid] * q;
            }
          });
        }
        document.getElementById("grand-total").textContent = "Rp" + total.toLocaleString("id-ID");
      }

      // ---- Remove Item ----
      function removeItem(sid, iid) {
        const row = document.getElementById("row-" + sid + "-" + iid);
        if (row) row.remove();
        delete KP[sid][iid];
        recalcSubtotal(sid);
        updateGrandTotal();
      }

      // ---- Timer (Sedang Berlangsung) ----
      let timerSec = 4 * 60 + 59;
      setInterval(() => {
        const el = document.getElementById("store-timer");
        if (!el || timerSec <= 0) return;
        timerSec--;
        const m = Math.floor(timerSec / 60),
          s = timerSec % 60;
        el.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
      }, 1000);

      // ---- Init ----
      document.addEventListener("DOMContentLoaded", () => {
        Object.keys(KP).forEach((s) => recalcSubtotal(s));
      });