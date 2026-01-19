import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const API_BASE = "http://localhost:3000/api"; // adjust if needed

export default function Dashboard() {
  const [kpi, setKpi] = useState(null);
  const [netGraph, setNetGraph] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/dashboard/kpi`).then((r) => r.json()),
      fetch(`${API_BASE}/dashboard/net-graph`).then((r) => r.json()),
      fetch(`${API_BASE}/dashboard/sales-distribution`).then((r) => r.json()),
    ])
      .then(([kpiRes, netRes, distRes]) => {
        setKpi(kpiRes);
        setNetGraph(netRes);
        setDistribution(distRes);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading dashboard...</div>;
  }

  /* ---------- Charts ---------- */

  const netChartData = {
    labels: netGraph.map((d) => d.date),
    datasets: [
      {
        label: "Net",
        data: netGraph.map((d) => d.net),
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const COLORS = [
    "#4e79a7", // blue
    "#f28e2b", // orange
    "#e15759", // red
    "#76b7b2", // teal
    "#59a14f", // green
    "#edc949", // yellow
    "#af7aa1", // purple
    "#ff9da7", // pink
  ];

  const pieChartData = {
    labels: distribution.map((d) => d.item_name),
    datasets: [
      {
        data: distribution.map((d) => d.sold),
        backgroundColor: distribution.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <h2 className="mb-4">Dashboard</h2>

      {/* KPI CARDS */}
      <div className="row mb-4">
        <KpiCard title="Revenue" value={`₱ ${kpi.revenue}`} />
        <KpiCard title="Cost" value={`₱ ${kpi.cost}`} />
        <KpiCard title="Net" value={`₱ ${kpi.net}`} />
        <KpiCard title="Items Sold" value={kpi.items_sold} />
      </div>

      {/* CHARTS */}
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-body">
              <h5>Net Over Time</h5>
              <Line data={netChartData} />
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5>Sales Distribution</h5>
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- KPI CARD COMPONENT ---------- */

function KpiCard({ title, value }) {
  return (
    <div className="col-md-3 mb-3">
      <div className="card text-center">
        <div className="card-body">
          <h6 className="text-muted">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
