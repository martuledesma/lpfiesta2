const titleReveal = document.querySelector("[data-title-reveal]");
const polaroids = Array.from(document.querySelectorAll(".polaroid"));

if (titleReveal) {
  titleReveal.classList.add("is-active", "is-auto");
  let isAutoReveal = true;

  const setRevealPosition = (clientX, clientY) => {
    const rect = titleReveal.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    titleReveal.style.setProperty("--reveal-x", `${Math.max(0, Math.min(100, x))}%`);
    titleReveal.style.setProperty("--reveal-y", `${Math.max(0, Math.min(100, y))}%`);
  };

  titleReveal.addEventListener("pointermove", (event) => {
    titleReveal.classList.add("is-active");
    titleReveal.classList.remove("is-auto");
    isAutoReveal = false;
    setRevealPosition(event.clientX, event.clientY);
  });

  titleReveal.addEventListener("pointerenter", (event) => {
    titleReveal.classList.add("is-active");
    titleReveal.classList.remove("is-auto");
    isAutoReveal = false;
    setRevealPosition(event.clientX, event.clientY);
  });

  titleReveal.addEventListener("pointerleave", () => {
    titleReveal.classList.add("is-auto", "is-active");
    isAutoReveal = true;
  });

  titleReveal.addEventListener("pointercancel", () => {
    titleReveal.classList.add("is-auto", "is-active");
    isAutoReveal = true;
  });

  const driftReveal = (time) => {
    if (isAutoReveal) {
      const x = 50 + Math.sin(time / 1150) * 42;
      const y = 50 + Math.cos(time / 870) * 18;
      titleReveal.style.setProperty("--reveal-x", `${x}%`);
      titleReveal.style.setProperty("--reveal-y", `${y}%`);
    }

    requestAnimationFrame(driftReveal);
  };

  requestAnimationFrame(driftReveal);
}

polaroids.forEach((polaroid) => {
  polaroid.tabIndex = 0;
  polaroid.addEventListener("pointerdown", () => {
    const wasExpanded = polaroid.classList.contains("is-expanded");
    polaroids.forEach((item) => item.classList.remove("is-expanded"));
    if (!wasExpanded) polaroid.classList.add("is-expanded");
  });
});

document.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".polaroid")) return;
  polaroids.forEach((item) => item.classList.remove("is-expanded"));
});

const animatedItems = [
  [".hero-copy", "reveal-zoom", 0],
  [".photo-stack figure", "reveal-zoom", 80],
  [".concept-copy", "reveal-left", 0],
  [".festival-stats > div", "reveal-zoom", 100],
  [".timeline-item", "reveal-left", 90],
  [".ticket-tier", "reveal-zoom", 100],
  [".kit-item", "reveal-left", 90],
  [".split-section > div", "reveal-right", 120],
  [".experience-card", "reveal-zoom", 80],
  [".experience-items article", "reveal-left", 80],
  [".section-head", "reveal-left", 0],
  [".tickets-panel", "reveal-left", 110],
  ["footer span", "reveal-right", 80],
];

const revealTargets = animatedItems.flatMap(([selector, direction, step]) =>
  Array.from(document.querySelectorAll(selector)).map((element, index) => {
    element.classList.add("revealable", direction);
    element.style.setProperty("--reveal-delay", `${index * step}ms`);
    return element;
  })
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
