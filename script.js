/* ELEFTHERI — eleftheri.com — Interaktion */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- E-Mail: Adresse wird nie angezeigt, erst beim Klick ans Mailprogramm übergeben ---------- */
  document.querySelectorAll("a.cloak").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "mailto:" + a.getAttribute("data-u") + String.fromCharCode(64) + a.getAttribute("data-d");
    });
  });

  /* ---------- Header + mobiler Button ---------- */
  var header = document.getElementById("siteHeader");
  var mobileCta = document.getElementById("mobileCta");
  var startSection = document.getElementById("start");
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (mobileCta && startSection) {
      var r = startSection.getBoundingClientRect();
      var inStart = r.top < window.innerHeight && r.bottom > 0;
      mobileCta.classList.toggle("show", y > 640 && !inStart);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Navigation ---------- */
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  if (nav && toggle) {
    var closeNav = function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeNav(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { closeNav(); toggle.focus(); }
    });
  }

  /* ---------- Sanftes Scrollen mit Header-Abstand ---------- */
  var scrollToEl = function (el) {
    var top = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
  };
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#top") { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); return; }
      var target = id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      scrollToEl(target);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- FAQ: immer nur eine Antwort offen ---------- */
  document.querySelectorAll(".faq").forEach(function (group) {
    var items = group.querySelectorAll("details");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) items.forEach(function (o) { if (o !== item) o.open = false; });
      });
    });
  });

  /* ---------- Einblenden ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* =====================================================================
     FRAGEBOGEN „15 Minuten mit mir“
     ===================================================================== */
  var form = document.getElementById("quizForm");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".q-step"));
  var total = steps.length;
  var current = 0;
  var btnBack = document.getElementById("quizBack");
  var btnNext = document.getElementById("quizNext");
  var btnSubmit = document.getElementById("quizSubmit");
  var label = document.getElementById("progressLabel");
  var fill = document.getElementById("progressFill");
  var msg = document.getElementById("formMsg");
  var intro = document.getElementById("quizIntro");
  var wrap = document.getElementById("anfrage");
  var telField = document.getElementById("telField");
  var anliegen = document.getElementById("anliegen");
  var count = document.getElementById("anliegenCount");
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var val = function (name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    if (checked) return checked.value;
    var el = form.elements[name];
    return el && typeof el.value === "string" ? el.value.trim() : "";
  };
  var setErr = function (key, text) {
    var slot = form.querySelector('.err[data-for="' + key + '"]');
    if (slot) slot.textContent = text || "";
  };

  var show = function (i, focus) {
    current = i;
    steps.forEach(function (s, n) { s.classList.toggle("active", n === i); });
    var isLast = i === total - 1;
    btnBack.hidden = i === 0;
    btnNext.hidden = isLast;
    btnSubmit.hidden = !isLast;
    label.textContent = isLast ? "Fast geschafft — deine Kontaktdaten" : "Frage " + (i + 1) + " von " + (total - 1);
    fill.style.width = Math.round(((i + 1) / total) * 100) + "%";
    msg.hidden = true;
    if (focus) {
      var legend = steps[i].querySelector("legend");
      var first = steps[i].querySelector("input, textarea");
      if (first) first.focus({ preventScroll: true });
      if (legend && wrap.getBoundingClientRect().top < 0) scrollToEl(wrap);
    }
  };

  var validateStep = function (i) {
    var s = steps[i];
    var n = Number(s.getAttribute("data-step"));
    if (n >= 1 && n <= 4) {
      var name = s.querySelector('input[type="radio"]').name;
      if (!val(name)) { setErr(name, "Bitte wähle eine Antwort."); return false; }
      setErr(name, "");
      return true;
    }
    if (n === 6) {
      if (!document.getElementById("ok1").checked || !document.getElementById("ok2").checked) {
        setErr("ok", "Bitte bestätige beide Punkte — sonst passt ein Gespräch gerade nicht.");
        return false;
      }
      setErr("ok", "");
      return true;
    }
    if (n === 7) {
      var ok = true;
      if (!val("VORNAME")) { setErr("VORNAME", "Bitte gib deinen Vornamen ein."); ok = false; } else setErr("VORNAME", "");
      if (!emailRe.test(val("EMAIL"))) { setErr("EMAIL", "Bitte gib eine gültige E‑Mail‑Adresse ein."); ok = false; } else setErr("EMAIL", "");
      var needsTel = val("KONTAKTWEG") !== "E-Mail";
      var tel = val("TELEFON").replace(/[\s()\/-]/g, "");
      if (needsTel && !/^\+?\d{7,15}$/.test(tel)) { setErr("TELEFON", "Bitte gib deine Telefonnummer mit Ländervorwahl ein."); ok = false; } else setErr("TELEFON", "");
      if (!document.getElementById("consent").checked) { setErr("consent", "Ohne dein Einverständnis darf ich deine Anfrage nicht speichern."); ok = false; } else setErr("consent", "");
      return ok;
    }
    return true;
  };

  /* Vorschlag für Tanja: A / B / C — nur ein Hinweis, keine Entscheidung */
  var einstufung = function () {
    var anfang = val("SITUATION") === "Ich schaue erst mal nur" ||
                 val("STAND") === "Ich möchte erst verstehen, worum es überhaupt geht" ||
                 val("ZEIT") === "Im Moment eigentlich keine";
    if (anfang) return "C";
    var entscheiden = val("STAND") === "Ich möchte in absehbarer Zeit eine Entscheidung treffen";
    var zeitGenug = val("ZEIT") === "3 bis 5 Stunden" || val("ZEIT") === "Mehr als 5 Stunden";
    return entscheiden && zeitGenug ? "A" : "B";
  };

  btnNext.addEventListener("click", function () {
    if (!validateStep(current)) {
      var bad = steps[current].querySelector("input");
      if (bad) bad.focus();
      return;
    }
    show(current + 1, true);
  });
  btnBack.addEventListener("click", function () { show(current - 1, true); });

  /* Enter in Textfeldern soll nicht vorzeitig absenden */
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && current < total - 1) {
      e.preventDefault();
      btnNext.click();
    }
  });

  /* Auswahl einer Antwort blendet den Fehlerhinweis sofort aus */
  form.addEventListener("change", function (e) {
    if (e.target.type === "radio") setErr(e.target.name, "");
    if (e.target.name === "KONTAKTWEG") {
      telField.hidden = e.target.value === "E-Mail";
      if (telField.hidden) setErr("TELEFON", "");
    }
  });

  anliegen.addEventListener("input", function () {
    count.textContent = anliegen.value.length + " / 400";
  });

  document.querySelectorAll("[data-open-quiz]").forEach(function (a) {
    a.addEventListener("click", function () { show(0, false); });
  });

  form.addEventListener("submit", function (e) {
    for (var i = 0; i < total; i++) {
      if (!validateStep(i)) {
        e.preventDefault();
        show(i, true);
        return;
      }
    }
    if (form.getAttribute("action").indexOf("BREVO_FORM_URL") !== -1) {
      e.preventDefault();
      msg.textContent = "Das Formular ist noch nicht mit Brevo verbunden. Bitte schreib mir so lange über den Link „E‑Mail schreiben“ unten auf der Seite.";
      msg.hidden = false;
      return;
    }
    if (val("KONTAKTWEG") === "E-Mail") form.elements.TELEFON.value = "";
    var grade = einstufung();
    document.getElementById("einstufung").value = grade;

    /* Der Browser sendet jetzt an das versteckte Brevo-iframe. Vorname und Einstufung
       legen wir im Zwischenspeicher ab (nie in der Adresszeile) und wechseln dann auf
       die Danke-Seite. Klappt der Wechsel nicht, erscheint die Bestätigung hier. */
    var name = val("VORNAME");
    try {
      sessionStorage.setItem("eleftheri_vorname", name);
      sessionStorage.setItem("eleftheri_einstufung", grade);
    } catch (e) {}
    form.hidden = true;
    intro.hidden = true;
    var result = document.getElementById(grade === "C" ? "resultC" : "resultAB");
    result.querySelectorAll(".js-name").forEach(function (s) { s.textContent = name; });
    result.hidden = false;
    scrollToEl(wrap);
    result.focus({ preventScroll: true });
    /* Erst wechseln, wenn Brevo geantwortet hat (iframe geladen) — sonst bricht der
       Seitenwechsel den Versand ab. Spätestens nach 4 Sekunden trotzdem wechseln. */
    var ziel = wrap.getAttribute("data-danke") || "danke/";
    var gewechselt = false;
    var weiter = function () {
      if (gewechselt) return;
      gewechselt = true;
      window.location.href = ziel;
    };
    var frame = document.querySelector('iframe[name="brevoFrame"]');
    if (frame) frame.addEventListener("load", function () { setTimeout(weiter, 250); });
    setTimeout(weiter, 4000);
  });

  show(0, false);
})();
