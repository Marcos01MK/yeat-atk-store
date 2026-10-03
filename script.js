document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#product-grid"),
    filters = document.querySelector("#filters"),
    modal = document.querySelector("#product-modal");

  const discord = document.querySelector("#discord-button"),
    buy = document.querySelector("#modal-buy");

  discord.href = DISCORD_INVITE;

  let currentCategory = "Todos";
  const categories = ["Todos", ...new Set(products.map((p) => p.category))];

  categories.forEach((cat) => {
    const b = document.createElement("button");
    b.className = "filter" + (cat === "Todos" ? " active" : "");
    b.textContent = cat.toUpperCase();
    b.addEventListener("click", () => {
      currentCategory = cat;
      document
        .querySelectorAll(".filter")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      render();
    });
    filters.appendChild(b);
  });

  function render() {
    grid.innerHTML = "";
    const list =
      currentCategory === "Todos"
        ? products
        : products.filter((p) => p.category === currentCategory);

    list.forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "product-card reveal is-visible";
      card.innerHTML = `<div class="product-banner" style="background-image:url('${p.banner}')"><span class="product-number">${String(i + 1).padStart(2, "0")}</span></div><div class="product-info"><span class="product-category">${p.category.toUpperCase()}</span><h3>${p.title}</h3><p>${p.description}</p><span class="product-arrow">↗</span></div>`;
      card.addEventListener("click", () => openProduct(p));
      grid.appendChild(card);
    });
  }

  function openProduct(p) {
    document.querySelector("#modal-category").textContent =
      p.category.toUpperCase();
    document.querySelector("#modal-title").textContent = p.title;
    document.querySelector("#modal-description").textContent = p.description;
    document.querySelector("#modal-price").textContent = p.price;
    document.querySelector("#modal-banner").style.backgroundImage = `url('${p.banner}')`;
    document.querySelector("#modal-tags").innerHTML = p.tags
      .map((t) => `<span>${t}</span>`)
      .join("");
    buy.href = DISCORD_INVITE;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document
    .querySelectorAll("[data-close-modal]")
    .forEach((x) => x.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  render();

  const reveals = document.querySelectorAll(".content .reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    reveals.forEach((e) => obs.observe(e));
  } else {
    reveals.forEach((e) => e.classList.add("is-visible"));
  }

  if (
    window.matchMedia("(hover:hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion:reduce)").matches
  ) {
    const glow = document.querySelector(".cursor-glow");
    document.addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }
});