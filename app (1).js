
const RIVER_URL = "https://rivertide1.onrender.com/api/river/ironbridge";
const TIDE_URL = "https://rivertide1.onrender.com/api/tides/chester";

let chart = null;

window.onload = () => {
  loadRiver();
  loadTides();
};

async function loadRiver() {
  try {
    const r = await fetch(RIVER_URL, { cache: "no-store" });
    const j = await r.json();

    const readings = j.levels;
    const latest = readings[0];
    const latestLevel = Number(latest.avg_level);
    const latestTime = latest.record_date;

    document.getElementById("riverLevel").textContent = latestLevel.toFixed(2) + " m";
    document.getElementById("riverTime").textContent = latestTime;

    const prev = Number(readings[1].avg_level);
    document.getElementById("riverTrend").textContent =
      latestLevel > prev ? "Rising" :
      latestLevel < prev ? "Falling" : "Steady";

    const chartData = readings.map(r => ({
      time: r.record_date,
      value: Number(r.avg_level)
    }));

    buildChart(chartData);

  } catch (e) {
    document.getElementById("riverLevel").textContent = "Error";
  }
}

function buildChart(rows) {
  const ctx = document.getElementById("riverChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: rows.map(r => r.time),
      datasets: [{
        label: "River Level (m)",
        data: rows.map(r => r.value),
        borderWidth: 2,
        tension: 0.2,
        fill: false
      }]
    }
  });
}

async function loadTides() {
  const ul = document.getElementById("tideList");
  ul.innerHTML = "<li>Loading…</li>";

  try {
    const r = await fetch(TIDE_URL, { cache: "no-store" });
    const j = await r.json();

    ul.innerHTML = "";

    (j.tides || []).forEach(t => {
      const li = document.createElement("li");
      li.textContent = t.type + " — " + t.time + " — " + t.height;
      ul.appendChild(li);
    });

  } catch (e) {
    ul.innerHTML = "<li>Error loading tides</li>";
  }
}
