const ADMIN_ENDPOINT = window.PRAKASH_CONFIG?.googleSheetsWebAppUrl || "";
const sessionKey = "prakash_admin_password_hash";

const loginPanel = document.querySelector("#loginPanel");
const dashboard = document.querySelector("#dashboard");
const loginForm = document.querySelector("#loginForm");
const loginStatus = document.querySelector("#loginStatus");
const leadRows = document.querySelector("#leadRows");
const leadSearch = document.querySelector("#leadSearch");
const totalLeads = document.querySelector("#totalLeads");
const latestLead = document.querySelector("#latestLead");
const emptyState = document.querySelector("#emptyState");
const refreshLeads = document.querySelector("#refreshLeads");
const lockDashboard = document.querySelector("#lockDashboard");

let leads = [];
let passwordHash = sessionStorage.getItem(sessionKey) || "";

const setStatus = (message) => {
  if (loginStatus) loginStatus.textContent = message;
};

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function buildAppsScriptUrl(baseUrl, payload) {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${new URLSearchParams(payload).toString()}`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Apps Script returned ${response.status}.`);
  }

  return response.json();
}

function fetchJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `prakashLeads_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement("script");
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Lead request timed out."));
    }, 15000);

    function cleanup() {
      clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
    }

    window[callbackName] = (payload) => {
      cleanup();
      resolve(payload);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Unable to reach Google Apps Script."));
    };

    script.src = buildAppsScriptUrl(url, {
      callback: callbackName,
    });
    document.body.appendChild(script);
  });
}

async function requestAppsScript(payload) {
  const url = buildAppsScriptUrl(ADMIN_ENDPOINT, payload);

  try {
    return await fetchJson(url);
  } catch (error) {
    return fetchJsonp(url);
  }
}

async function loadLeads() {
  if (!ADMIN_ENDPOINT) {
    throw new Error("Add your Google Apps Script Web App URL in config.js first.");
  }

  if (!passwordHash) {
    throw new Error("Enter the admin password.");
  }

  const payload = {
    action: "listLeads",
    passwordHash,
  };
  const responsePayload = await requestAppsScript(payload);

  if (!responsePayload?.ok) {
    throw new Error(responsePayload?.message || "Access denied.");
  }

  leads = Array.isArray(responsePayload.leads) ? responsePayload.leads : [];
  renderLeads();
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderLeads() {
  const query = leadSearch?.value.trim().toLowerCase() || "";
  const filtered = leads.filter((lead) =>
    [lead.date, lead.name, lead.phone, lead.email, lead.message].some((value) =>
      String(value || "").toLowerCase().includes(query)
    )
  );

  if (totalLeads) totalLeads.textContent = leads.length.toLocaleString("en-IN");
  if (latestLead) latestLead.textContent = leads.length ? formatDate(leads[0].date) : "-";
  if (emptyState) emptyState.hidden = filtered.length > 0;

  if (!leadRows) return;
  leadRows.innerHTML = filtered
    .map(
      (lead) => `
        <tr>
          <td data-label="Date">${escapeHtml(formatDate(lead.date))}</td>
          <td data-label="Name">${escapeHtml(lead.name || "-")}</td>
          <td data-label="Phone">${escapeHtml(lead.phone || "-")}</td>
          <td data-label="Email">${escapeHtml(lead.email || "-")}</td>
          <td data-label="Message">${escapeHtml(lead.message || "-")}</td>
        </tr>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function unlock(password) {
  passwordHash = await sha256(password);
  sessionStorage.setItem(sessionKey, passwordHash);
  setStatus("Checking password...");
  await loadLeads();
  loginPanel.hidden = true;
  dashboard.hidden = false;
  setStatus("");
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = new FormData(event.currentTarget).get("password");

  try {
    await unlock(password);
  } catch (error) {
    sessionStorage.removeItem(sessionKey);
    passwordHash = "";
    setStatus(error.message);
  }
});

refreshLeads?.addEventListener("click", async () => {
  try {
    await loadLeads();
  } catch (error) {
    alert(error.message);
  }
});

lockDashboard?.addEventListener("click", () => {
  sessionStorage.removeItem(sessionKey);
  passwordHash = "";
  leads = [];
  dashboard.hidden = true;
  loginPanel.hidden = false;
});

leadSearch?.addEventListener("input", renderLeads);

if (passwordHash) {
  loadLeads()
    .then(() => {
      loginPanel.hidden = true;
      dashboard.hidden = false;
    })
    .catch(() => {
      sessionStorage.removeItem(sessionKey);
      passwordHash = "";
    });
}
