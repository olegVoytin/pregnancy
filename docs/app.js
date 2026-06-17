const data = window.PREGNANCY_DASHBOARD_DATA;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const confidenceLabels = {
  high: "подтверждено",
  medium: "проверить",
  low: "неуверенно"
};

function parseIsoDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function todayFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const override = params.get("date");
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) {
    return parseIsoDate(override);
  }
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function daysBetween(start, end) {
  return Math.round((end - start) / MS_PER_DAY);
}

function formatDate(value, options = {}) {
  return parseIsoDate(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options
  });
}

function formatDateLong(date) {
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}

function getGestationalAge(currentDate) {
  const days = Math.max(0, daysBetween(parseIsoDate(data.pregnancy.lmp), currentDate));
  return {
    weeks: Math.floor(days / 7),
    days: days % 7,
    totalDays: days
  };
}

function createBadge(confidence) {
  return `<span class="confidence confidence-${confidence}">${confidenceLabels[confidence] || confidence}</span>`;
}

function eventState(event, currentDate) {
  const eventDate = parseIsoDate(event.date);
  const distance = daysBetween(currentDate, eventDate);
  if (distance < 0) return { label: "прошло", className: "is-past", distance };
  if (distance === 0) return { label: "сегодня", className: "is-today", distance };
  return { label: `через ${distance} дн.`, className: "is-future", distance };
}

function sourceLink(source) {
  if (!source) return "";
  if (source.startsWith("pregnancy-info-")) {
    return `<a href="../human-readable/index.html#${source}">${source}</a>`;
  }
  if (source.includes("screening_info")) {
    return `<a href="../human-readable/screening_info_1.md">${source}</a>`;
  }
  if (source.includes("deep-research")) {
    return `<a href="../human-readable/deep-research-report.md">${source}</a>`;
  }
  if (source === "calculated-from-due-date") {
    return "<span>расчет от ПДР</span>";
  }
  return `<span>${source}</span>`;
}

function renderStatus(currentDate) {
  const gestation = getGestationalAge(currentDate);
  const dueDate = parseIsoDate(data.pregnancy.dueDate);
  const daysToDue = daysBetween(currentDate, dueDate);
  const isPostpartum = daysToDue < 0;
  const futureEvents = data.events
    .map((event) => ({ ...event, state: eventState(event, currentDate) }))
    .filter((event) => event.state.distance >= 0)
    .sort((a, b) => a.state.distance - b.state.distance);
  const next = futureEvents[0] || data.events[data.events.length - 1];

  document.body.classList.toggle("is-postpartum", isPostpartum);
  document.getElementById("current-date").textContent = `Сегодня, ${formatDateLong(currentDate)}`;
  document.getElementById("gestation-age").textContent = `${gestation.weeks}+${gestation.days}`;
  document.getElementById("pregnancy-phase").textContent = isPostpartum
    ? "ПДР уже прошла. Основной акцент переключен на послеродовые задачи."
    : "Расчет срока выполнен от LMP 25.03.2026.";
  document.getElementById("next-deadline-title").textContent = next.title;
  document.getElementById("next-deadline-meta").textContent = `${formatDate(next.date)} · ${next.detail}`;

  const statusItems = [
    { label: "ПДР", value: formatDate(data.pregnancy.dueDate), detail: "медицинская дата" },
    { label: isPostpartum ? "после ПДР" : "до ПДР", value: `${Math.abs(daysToDue)} дн.`, detail: isPostpartum ? "ориентир для послеродового режима" : "осталось до расчетной даты" },
    { label: "Mutterschutz", value: "18.11.2026", detail: "6 недель до ПДР" },
    { label: "Подтверждение", value: "12.05.2026", detail: "срок 6+6" }
  ];

  document.getElementById("status-grid").innerHTML = statusItems.map((item) => `
    <div class="status-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.detail}</small>
    </div>
  `).join("");
}

function renderEvents(currentDate, filter = "all") {
  const events = data.events
    .map((event) => ({ ...event, state: eventState(event, currentDate) }))
    .filter((event) => filter === "all" || event.type === filter)
    .sort((a, b) => {
      const aFuture = a.state.distance >= 0;
      const bFuture = b.state.distance >= 0;
      if (aFuture !== bFuture) return aFuture ? -1 : 1;
      return aFuture
        ? a.state.distance - b.state.distance
        : b.state.distance - a.state.distance;
    });

  document.getElementById("event-list").innerHTML = events.map((event) => `
    <article class="event-row ${event.state.className}" data-event-type="${event.type}">
      <div class="event-date">
        <strong>${formatDate(event.date, { month: "short" })}</strong>
        <span>${event.state.label}</span>
      </div>
      <div class="event-line" aria-hidden="true"></div>
      <div class="event-content">
        <div class="event-head">
          <h3>${event.title}</h3>
          <span class="type-pill type-${event.type}">${event.type === "medical" ? "медицина" : "админ"}</span>
        </div>
        <p>${event.detail}</p>
        <div class="meta-row">${createBadge(event.confidence)}${sourceLink(event.source)}</div>
      </div>
    </article>
  `).join("");
}

function renderScreenings() {
  document.getElementById("screening-grid").innerHTML = data.screenings.map((screening) => `
    <article class="screening-card">
      <div class="card-topline">
        <span>${formatDate(screening.date)}</span>
        ${createBadge(screening.confidence)}
      </div>
      <h3>${screening.title}</h3>
      <p>${screening.summary}</p>
      <div class="measurement-grid">
        ${screening.measurements.map((item) => `
          <div>
            <span>${item.label}</span>
            <strong>${item.value}</strong>
            <small>${item.note}</small>
          </div>
        `).join("")}
      </div>
      <div class="meta-row">${sourceLink(screening.source)}</div>
    </article>
  `).join("");
}

function renderVisits() {
  document.getElementById("visit-table").innerHTML = data.visits.map((visit) => `
    <tr>
      <td>${formatDate(visit.date)}</td>
      <td>${visit.gestationalAge}</td>
      <td>${visit.weightKg || " -"}</td>
      <td>${visit.bloodPressure || " -"}</td>
      <td>${visit.hb || " -"}</td>
      <td>${visit.urine || " -"}</td>
      <td>${visit.fetalHeartSounds || " -"}</td>
      <td>
        ${createBadge(visit.confidence)}
        <button class="row-note" type="button" aria-label="Показать примечание" data-note="${visit.notes}">i</button>
      </td>
    </tr>
  `).join("");
}

function renderPhases() {
  document.getElementById("phase-grid").innerHTML = data.phases.map((phase, index) => `
    <details class="phase-card" ${index === 0 ? "open" : ""}>
      <summary>
        <span>
          <strong>${phase.title}</strong>
          <small>${phase.range}</small>
        </span>
      </summary>
      <ul>
        ${phase.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </details>
  `).join("");
}

function renderDocuments() {
  document.getElementById("document-list").innerHTML = data.documents.map((item) => `
    <label class="check-row">
      <input type="checkbox">
      <span>${item}</span>
    </label>
  `).join("");

  document.getElementById("agency-list").innerHTML = data.agencies.map((agency) => `
    <article>
      <h3>${agency.name}</h3>
      <p>${agency.purpose}</p>
    </article>
  `).join("");
}

function renderVerification() {
  document.getElementById("verification-list").innerHTML = data.verificationNeeded.map((item) => `
    <article class="verification-item">
      <div>
        <h3>${item.title}</h3>
        <p>${item.detail}</p>
        <div class="meta-row">${createBadge(item.confidence)}<span>${item.source}</span></div>
      </div>
    </article>
  `).join("");
}

function renderSources() {
  document.getElementById("source-strip").innerHTML = data.sources.map((source) => `
    <a class="source-card" href="${source.href}">
      <span class="source-thumb" aria-hidden="true"></span>
      <strong>${source.id.replace("pregnancy-info-", "#")}</strong>
      <small>${source.status.replaceAll("_", " ")}</small>
    </a>
  `).join("");
}

function bindFilters(currentDate) {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderEvents(currentDate, button.dataset.filter);
    });
  });
}

function bindRowNotes() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".row-note");
    if (!button) return;
    window.alert(button.dataset.note);
  });
}

function bindSectionObserver() {
  const links = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.nav === visible.target.id));
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.4, 0.8] });
  sections.forEach((section) => observer.observe(section));
}

function init() {
  const currentDate = todayFromQuery();
  renderStatus(currentDate);
  renderEvents(currentDate);
  renderScreenings();
  renderVisits();
  renderPhases();
  renderDocuments();
  renderVerification();
  renderSources();
  bindFilters(currentDate);
  bindRowNotes();
  bindSectionObserver();
}

init();
