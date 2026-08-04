const API_BASE = "https://rallypoint-unlock-worker.roxzone.workers.dev";

function query(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || "";
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function setStatus(message, kind) {
  const node = document.getElementById("status");
  if (!node) {
    return;
  }
  node.textContent = message;
  node.className = kind ? `status ${kind}` : "status";
}

// Pull the current price from the worker (single source of truth) so the price
// display always matches what checkout charges. On any failure the hardcoded
// prices in index.html stay as a fallback.
async function loadPricing() {
  try {
    const res = await fetch(`${API_BASE}/api/pricing`);
    if (!res.ok) {
      return;
    }
    const {usd, inr} = await res.json();
    if (usd) {
      // Write into the number span only. Setting textContent on the whole
      // amount wipes its children, which would silently delete the "incl. tax"
      // pill the moment this fetch resolves. Falls back to the old behaviour
      // for any markup that predates the span.
      const setAmount = (el, text) => {
        const num = el.querySelector(".rp-price-num");
        if (num) { num.textContent = text; } else { el.textContent = text; }
      };
      document.querySelectorAll("#price-intl .rp-price-amount").forEach((el) => {
        setAmount(el, `$${usd}`);
      });
      const statIntl = document.querySelector("#stat-price-intl strong");
      if (statIntl) statIntl.textContent = `$${usd}`;
    }
    if (inr) {
      const inrInt = String(inr).replace(/\.00$/, "");
      document.querySelectorAll("#price-inr .rp-price-amount").forEach((el) => {
        const num = el.querySelector(".rp-price-num");
        if (num) { num.textContent = `₹${inrInt}`; } else { el.textContent = `₹${inrInt}`; }
      });
      const statInr = document.querySelector("#stat-price-inr strong");
      if (statInr) statInr.textContent = inrInt;
    }
  } catch (_) {
    // leave hardcoded HTML values as fallback
  }
}

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let data = null;
  if (text && text.length > 0) {
    data = JSON.parse(text);
  }

  if (!response.ok) {
    const message = data && data.error ? data.error : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}
