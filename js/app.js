(function () {
  "use strict";

  function markActiveNav() {
    var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!path) path = "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href === path) a.classList.add("active");
    });
  }

  function renderBarChart(containerId, items, maxOverride) {
    var el = document.getElementById(containerId);
    if (!el || !items) return;
    var max = maxOverride || Math.max.apply(null, items.map(function (i) { return i.value; }));
    el.innerHTML = items.map(function (item) {
      var pct = Math.max(2, (item.value / max) * 100);
      var cls = item.cls ? " " + item.cls : "";
      var display = item.display || (Number.isInteger(item.value) ? item.value : item.value.toFixed(1));
      return (
        '<div class="bar-row">' +
          '<div class="label">' + escapeHtml(item.label) + "</div>" +
          '<div class="bar-track"><div class="bar-fill' + cls + '" style="width:' + pct + '%"></div></div>' +
          '<div class="val">' + escapeHtml(String(display)) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderScatter(containerId, points) {
    var wrap = document.getElementById(containerId);
    if (!wrap || !points) return;
    var plot = wrap.querySelector(".scatter-plot");
    if (!plot) return;
    var maxNa = 1100, maxSugar = 12;
    plot.innerHTML = points.map(function (p) {
      var left = (p.x / maxSugar) * 100;
      var bottom = (p.na / maxNa) * 100;
      var cls = p.cls ? " " + p.cls : "";
      return (
        '<div class="scatter-dot' + cls + '" style="left:' + left + '%;bottom:' + bottom + '%" title="' +
        escapeHtml(p.brand + " — Na " + p.na + " mg, sugar ~" + p.sugar + " g") +
        '"></div>' +
        '<div class="scatter-label" style="left:' + left + '%;bottom:' + bottom + '%">' +
        escapeHtml(p.brand) + "</div>"
      );
    }).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  var sortState = { key: "threatRank", dir: 1 };

  function initMatrix() {
    var tbody = document.getElementById("matrix-body");
    if (!tbody || !window.FLUX_CI) return;
    var search = document.getElementById("matrix-search");
    var formatFilter = document.getElementById("matrix-format");
    var data = window.FLUX_CI.matrix.slice();

    function apply() {
      var q = (search && search.value || "").toLowerCase().trim();
      var fmt = formatFilter && formatFilter.value || "all";
      var rows = data.filter(function (r) {
        var matchQ = !q ||
          r.brand.toLowerCase().indexOf(q) >= 0 ||
          r.format.toLowerCase().indexOf(q) >= 0 ||
          (r.owns || "").toLowerCase().indexOf(q) >= 0 ||
          r.claim.toLowerCase().indexOf(q) >= 0 ||
          r.threat.toLowerCase().indexOf(q) >= 0;
        var matchF = fmt === "all" || r.formatKey === fmt;
        return matchQ && matchF;
      });
      rows.sort(function (a, b) {
        var ka = a[sortState.key], kb = b[sortState.key];
        if (ka == null && kb == null) return 0;
        if (ka == null) return 1;
        if (kb == null) return -1;
        if (typeof ka === "string") return sortState.dir * ka.localeCompare(kb);
        return sortState.dir * (ka - kb);
      });
      tbody.innerHTML = rows.map(function (r) {
        return (
          "<tr>" +
            "<td><strong>" + escapeHtml(r.brand) + "</strong>" +
              (r.owns ? '<div style="font-size:11px;color:var(--teal-dark);font-weight:600;margin-top:2px">' + escapeHtml(r.owns) + "</div>" : "") +
            "</td>" +
            "<td>" + escapeHtml(r.format) + "</td>" +
            '<td class="num-cell">' + escapeHtml(r.naDisplay) + "</td>" +
            '<td class="num-cell">' + escapeHtml(r.kDisplay) + "</td>" +
            '<td class="num-cell">' + escapeHtml(r.mgDisplay) + "</td>" +
            "<td>" + escapeHtml(r.sugar) + "</td>" +
            '<td class="num-cell">' + escapeHtml(r.priceDisplay) + "</td>" +
            "<td>" + escapeHtml(r.claim) + "</td>" +
            '<td><span class="threat-tag">' + escapeHtml(r.threat) + "</span></td>" +
          "</tr>"
        );
      }).join("");
      var count = document.getElementById("matrix-count");
      if (count) count.textContent = rows.length + " of " + data.length + " rivals";
    }

    document.querySelectorAll("th[data-sort]").forEach(function (th) {
      th.addEventListener("click", function () {
        var key = th.getAttribute("data-sort");
        if (sortState.key === key) sortState.dir *= -1;
        else { sortState.key = key; sortState.dir = 1; }
        document.querySelectorAll("th[data-sort]").forEach(function (t) {
          t.classList.toggle("sorted", t === th);
        });
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    if (formatFilter) formatFilter.addEventListener("change", apply);
    apply();
  }

  document.addEventListener("DOMContentLoaded", function () {
    markActiveNav();
    if (window.FLUX_CI) {
      renderBarChart("chart-na", window.FLUX_CI.naChart, 1100);
      renderBarChart("chart-price", window.FLUX_CI.priceChart, 130);
      renderBarChart("chart-cost-na", window.FLUX_CI.costPerMgNa.map(function (c) {
        return { label: c.label, value: c.value * 1000, display: c.display, cls: "" };
      }), 80);
      renderScatter("scatter-nutrition", window.FLUX_CI.scatter);
    }
    initMatrix();
  });
})();
