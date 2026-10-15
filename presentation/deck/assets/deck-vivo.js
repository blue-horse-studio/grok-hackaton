// Forja NL — modo en vivo del deck. Solo corre dentro de <hyperframes-slideshow>
// (hyperframes present). No participa en render/check/snapshot: ahí el deck usa el
// timeline determinista registrado en index.html.
//  - Reproduce en tiempo real la entrada de cada slide (el deck navega por seek).
//  - Video de intro: clic = reproducir/pausar con sonido; aviso si falta el MP4.
(function () {
        // ---------- modo en vivo (solo dentro de <hyperframes-slideshow>) ----------
        // El deck navega por seek (sin reproducir); aquí reproducimos la entrada de cada
        // slide en tiempo real cuando se vuelve visible. Fuera del deck (render, check,
        // snapshot) no corre nada de esto.
        var vivo = false;
        try { vivo = window.parent !== window && !!window.parent.document.querySelector("hyperframes-slideshow"); } catch (e) { vivo = false; }
        if (!vivo || !window.__forjaDeck) return;
        var B = window.__forjaDeck.B;

        var escenas = Array.prototype.slice.call(document.querySelectorAll(".scene[data-composition-id]"));
        var activa = null;
        var enVivo = null;
        var ss = null;
        try { ss = window.parent.document.querySelector("hyperframes-slideshow"); } catch (e) { ss = null; }
        function indiceActual() {
          try {
            var pos = ss && ss.controller ? ss.controller.position : null;
            if (pos && pos.sequenceId === "main") return pos.slideIndex;
            if (pos) return pos.slideIndex;
          } catch (e) {}
          return 0;
        }
        function revisar() {
          var idx = indiceActual();
          for (var i = 0; i < escenas.length; i++) {
            var on = i === idx;
            escenas[i].style.setProperty("display", on ? "block" : "none", "important");
            escenas[i].style.setProperty("visibility", on ? "visible" : "hidden", "important");
            escenas[i].style.setProperty("opacity", on ? "1" : "0", "important");
          }
          var actual = escenas[idx] ? escenas[idx].getAttribute("data-composition-id") : null;
          if (actual === activa) return;
          activa = actual;
          if (enVivo) { enVivo.progress(1).kill(); enVivo = null; }
          if (actual && B[actual]) {
            enVivo = gsap.timeline();
            B[actual](enVivo, 0, true);
          }
        }
        setInterval(revisar, 50);

        // Video de intro: clic = reproducir/pausar con sonido; aviso si aún no existe el MP4.
        var escenaIntro = document.getElementById("s-intro");
        var video = document.getElementById("intro-video");
        function estado() {
          var espera = video.paused && !video.ended && !escenaIntro.classList.contains("sin-video");
          escenaIntro.classList.toggle("en-espera", espera);
        }
        ["play", "pause", "ended", "playing", "loadeddata"].forEach(function (ev) { video.addEventListener(ev, estado); });
        video.addEventListener("error", function () { escenaIntro.classList.add("sin-video"); estado(); });
        escenaIntro.addEventListener("click", function () {
          if (escenaIntro.classList.contains("sin-video")) return;
          video.muted = false;
          if (video.paused || video.ended) { if (video.ended) video.currentTime = 0; video.play().catch(function () {}); }
          else video.pause();
        });
        setTimeout(function () { if (video.readyState === 0 && video.networkState === 3) escenaIntro.classList.add("sin-video"); estado(); }, 1500);
        estado();
})();
