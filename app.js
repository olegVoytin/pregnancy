const data = window.PREGNANCY_DASHBOARD_DATA;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const documentChecklistStorageKey = "pregnancy-dashboard-document-checklist";
const documentChecklistCookieMaxAge = 60 * 60 * 24 * 365;
const confidenceLabels = {
  high: "подтверждено",
  medium: "проверить",
  low: "неуверенно"
};

const growthMeasurements = [
  [8, 1.6, 1, "малину"], [9, 2.3, 2, "вишню"], [10, 3.1, 4, "клубнику"],
  [11, 4.1, 7, "инжир"], [12, 5.4, 14, "лайм"], [13, 7.4, 23, "персик"],
  [14, 8.7, 43, "киви"], [15, 10.1, 70, "апельсин"], [16, 11.6, 100, "авокадо"],
  [17, 13, 140, "гранат"], [18, 14.2, 190, "грушу"], [19, 15.3, 240, "манго"],
  [20, 25.6, 300, "банан"], [21, 26.7, 360, "грейпфрут"], [22, 27.8, 430, "папайю"],
  [23, 28.9, 500, "питахайю"], [24, 30, 600, "небольшую дыню"], [25, 34.6, 660, "помело"],
  [26, 35.6, 760, "огурец"], [27, 36.6, 875, "кабачок"], [28, 37.6, 1000, "баклажан"],
  [29, 38.6, 1150, "мускатную тыкву"], [30, 39.9, 1320, "кокос"], [31, 41.1, 1500, "ананас"],
  [32, 42.4, 1700, "крупный ананас"], [33, 43.7, 1920, "дыню"], [34, 45, 2150, "мускусную дыню"],
  [35, 46.2, 2380, "крупную папайю"], [36, 47.4, 2620, "салат ромэн"], [37, 48.6, 2860, "мангольд"],
  [38, 49.8, 3080, "лук-порей"], [39, 50.7, 3290, "арбуз"], [40, 51.2, 3460, "тыкву"]
].map(([week, lengthCm, weightG, comparisonName]) => ({ week, lengthCm, weightG, comparisonName }));

let growthWeeks = [];
let currentGrowthWeek = null;
let selectedGrowthWeek = null;

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

function formatDecimal(value) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
}

function formatWeight(value) {
  if (value >= 1000) {
    return `≈ ${formatDecimal(value / 1000)} кг`;
  }
  return `≈ ${value} г`;
}

function weekLabel(week) {
  return `${week} неделя`;
}

function clampGrowthWeek(week) {
  return Math.min(40, Math.max(8, week));
}

function renderGrowthWeek(week) {
  const item = growthWeeks.find((candidate) => candidate.week === week);
  if (!item) return;

  selectedGrowthWeek = item.week;
  const lengthText = `≈ ${formatDecimal(item.lengthCm)} см`;
  document.getElementById("growth-title").textContent = item.week === currentGrowthWeek
    ? `Сегодня малыш размером с ${item.comparisonName}`
    : `На ${item.week}-й неделе малыш размером с ${item.comparisonName}`;
  document.getElementById("growth-week").textContent = weekLabel(item.week);
  document.getElementById("growth-length").textContent = lengthText;
  document.getElementById("growth-weight").textContent = formatWeight(item.weightG);

  const fruit = document.getElementById("growth-fruit");
  fruit.src = `assets/growth/${item.asset}`;
  fruit.alt = `${item.name} — сравнение для ${item.week}-й недели беременности`;
  document.getElementById("growth-fruit-caption").textContent = `сейчас ${lengthText}`;

  const proportionalWidth = Math.max(3.2, Math.min(45, (item.lengthCm / 50) * 44));
  document.getElementById("growth-fruit-figure").style.setProperty("--fruit-width", `${proportionalWidth}%`);

  const previous = document.querySelector('[data-growth-action="previous"]');
  const next = document.querySelector('[data-growth-action="next"]');
  previous.disabled = item.week === 8;
  next.disabled = item.week === 40;
  document.getElementById("growth-card").classList.toggle("is-current-week", item.week === currentGrowthWeek);
}

async function renderGrowthCard(currentDate) {
  const gestation = getGestationalAge(currentDate);
  currentGrowthWeek = clampGrowthWeek(gestation.weeks);

  try {
    const response = await fetch("assets/growth/manifest.json");
    if (!response.ok) throw new Error(`Growth manifest: ${response.status}`);
    const manifest = await response.json();
    growthWeeks = manifest.weeks.map((item) => ({
      ...item,
      ...growthMeasurements.find((measurement) => measurement.week === item.week)
    }));
    renderGrowthWeek(currentGrowthWeek);
  } catch (error) {
    document.getElementById("growth-title").textContent = "Сравнение временно недоступно";
    document.getElementById("growth-card").classList.add("has-error");
    console.error(error);
  }
}

function bindGrowthControls() {
  document.getElementById("growth-card").addEventListener("click", (event) => {
    const button = event.target.closest("[data-growth-action]");
    if (!button || button.disabled || !growthWeeks.length) return;

    if (button.dataset.growthAction === "current") {
      renderGrowthWeek(currentGrowthWeek);
      return;
    }

    const direction = button.dataset.growthAction === "previous" ? -1 : 1;
    renderGrowthWeek(clampGrowthWeek(selectedGrowthWeek + direction));
  });
}

function createBadge(confidence) {
  return `<span class="confidence confidence-${confidence}">${confidenceLabels[confidence] || confidence}</span>`;
}

function documentChecklistId(index) {
  return `document-${index}`;
}

function getCookieValue(name) {
  try {
    const prefix = `${name}=`;
    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

function getStoredDocumentChecklistText() {
  try {
    const saved = window.localStorage.getItem(documentChecklistStorageKey);
    if (saved) return saved;
  } catch {
    // Safari can throw here when local storage is unavailable.
  }
  return getCookieValue(documentChecklistStorageKey);
}

function getSavedDocumentChecklist() {
  try {
    const saved = JSON.parse(getStoredDocumentChecklistText() || "[]");
    if (!Array.isArray(saved)) return new Set();

    return new Set(saved.map((item) => {
      if (/^document-\d+$/.test(item)) return item;
      const legacyIndex = data.documents.indexOf(item);
      return legacyIndex >= 0 ? documentChecklistId(legacyIndex) : null;
    }).filter(Boolean));
  } catch {
    return new Set();
  }
}

function saveDocumentChecklist(checkedItems) {
  const serialized = JSON.stringify(Array.from(checkedItems));
  try {
    window.localStorage.setItem(documentChecklistStorageKey, serialized);
  } catch {
    // Keep going: cookie fallback below covers Safari storage failures.
  }

  try {
    document.cookie = `${documentChecklistStorageKey}=${encodeURIComponent(serialized)}; Max-Age=${documentChecklistCookieMaxAge}; Path=/; SameSite=Lax`;
  } catch {
    // If the browser blocks every storage mechanism, persistence is not possible.
  }
}

function getCheckedDocumentIdsFromPage() {
  return new Set(Array.from(document.querySelectorAll("#document-list input:checked"))
    .map((checkbox) => checkbox.dataset.documentId)
    .filter(Boolean));
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
    return `<a href="human-readable/index.html#${source}">${source}</a>`;
  }
  if (source.includes("screening_info")) {
    return `<a href="human-readable/screening_info_1.md">${source}</a>`;
  }
  if (source.includes("deep-research")) {
    return `<a href="human-readable/deep-research-report.md">${source}</a>`;
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
  const checkedItems = getSavedDocumentChecklist();
  document.getElementById("document-list").innerHTML = data.documents.map((item, index) => {
    const documentId = documentChecklistId(index);
    return `
    <label class="check-row">
      <input type="checkbox" data-document-id="${documentId}" ${checkedItems.has(documentId) ? "checked" : ""}>
      <span>${item}</span>
    </label>
  `;
  }).join("");

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
      <img class="source-thumb" src="${source.href}" alt="${source.id}" loading="lazy">
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

function bindDocumentChecklist() {
  const documentList = document.getElementById("document-list");
  const saveCheckboxState = (event) => {
    const checkbox = event.target.closest('input[type="checkbox"][data-document-id]');
    if (!checkbox) return;
    saveDocumentChecklist(getCheckedDocumentIdsFromPage());
  };

  ["input", "change"].forEach((eventName) => {
    documentList.addEventListener(eventName, saveCheckboxState);
  });

  window.addEventListener("pagehide", () => {
    saveDocumentChecklist(getCheckedDocumentIdsFromPage());
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
  renderGrowthCard(currentDate);
  renderEvents(currentDate);
  renderScreenings();
  renderVisits();
  renderPhases();
  renderDocuments();
  renderVerification();
  renderSources();
  bindFilters(currentDate);
  bindGrowthControls();
  bindRowNotes();
  bindDocumentChecklist();
  bindSectionObserver();
}

init();
