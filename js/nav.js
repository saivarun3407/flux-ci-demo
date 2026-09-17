(function () {
  var ROOT = (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      if (src.indexOf("nav.js") !== -1) {
        return src.replace(/js\/nav\.js.*$/, "");
      }
    }
    return "./";
  })();
  function p(path) { return ROOT + path; }

  var conf = document.createElement("div");
  conf.className = "conf-bar";
  conf.innerHTML =
    'Confidential — Competitive Intelligence Briefing <span>·</span> India Electrolytes <span>·</span> Competitor pack · Not for external distribution';

  var nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Primary");
  nav.innerHTML =
    '<div class="nav-inner">' +
      '<a class="nav-brand" href="' + p("index.html") + '">India Electrolytes <em>CI</em></a>' +
      '<ul class="nav-links">' +
        '<li><a href="' + p("index.html") + '">Cover</a></li>' +
        '<li><a href="' + p("executive.html") + '">Landscape</a></li>' +
        '<li><a href="' + p("market-map.html") + '">Market Map</a></li>' +
        '<li><a href="' + p("comparison.html") + '">Matrix</a></li>' +
        '<li><a href="' + p("nutrition.html") + '">Nutrition</a></li>' +
        '<li><a href="' + p("pricing.html") + '">Pricing</a></li>' +
        '<li><a href="' + p("brands.html") + '">Deep Dives</a></li>' +
        '<li><a href="' + p("sources.html") + '">Sources</a></li>' +
      "</ul>" +
      '<div class="nav-meta">17 Sep 2026</div>' +
    "</div>";

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML =
    "<strong>India Electrolytes Competitive Intelligence</strong> · Competitor pack · Prepared 17 Sep 2026 (CT)<br>" +
    'Source: flux-competitive-analysis.md (rival sections) · UNKNOWN = not found — not invented · ' +
    '<a href="' + p("sources.html") + '">Source index</a>';

  var body = document.body;
  body.insertBefore(nav, body.firstChild);
  body.insertBefore(conf, body.firstChild);
  body.appendChild(footer);
})();
