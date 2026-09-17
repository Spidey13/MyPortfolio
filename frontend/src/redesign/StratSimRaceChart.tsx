import type { CSSProperties } from "react";
import { STRATSIM_RACE_POINTS as points } from "../data/stratSimRace";

const chart = { left: 54, right: 728, top: 28, bottom: 266, width: 674, height: 238 };

function x(lap: number) {
  return chart.left + ((lap - 1) / (points.length - 1)) * chart.width;
}

function yWear(value: number) {
  return chart.bottom - (value / 80) * chart.height;
}

function yGrip(value: number) {
  return chart.bottom - value * chart.height;
}

function pathFor(key: "wear" | "grip", y: (value: number) => number) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.lap).toFixed(1)},${y(point[key]).toFixed(1)}`).join(" ");
}

export default function StratSimRaceChart() {
  const decisionStart = x(points.find((point) => point.shouldPit)?.lap ?? 32);
  const decisionEnd = x(points.findLast((point) => point.shouldPit)?.lap ?? 40);
  const rainStart = x(points.find((point) => point.rain > 0)?.lap ?? 30);
  const pitX = x(points.find((point) => point.pitExecuted)?.lap ?? 41);
  const labelStyle: CSSProperties = { fontFamily: "IBM Plex Mono, monospace", fontSize: 10, letterSpacing: ".04em" };

  return (
    <figure className="stratsim-race-figure">
      <svg className="stratsim-race-chart" viewBox="0 0 760 340" role="img" aria-labelledby="race-chart-title race-chart-desc">
        <title id="race-chart-title">Saved tire-manager simulation, laps 1 to 50</title>
        <desc id="race-chart-desc">Medium tires lose grip over the first stint. Rain begins at lap 30. The tire manager recommends pitting from laps 32 to 40, and the saved run pits on lap 41 onto hard tires, resetting grip.</desc>
        <rect x={rainStart} y={chart.top} width={chart.right - rainStart} height={chart.height} fill="#dce7d7" opacity=".65" />
        <rect x={decisionStart} y={chart.top} width={decisionEnd - decisionStart} height={chart.height} fill="#e8c94a" opacity=".22" />
        {[0, 20, 40, 60, 80].map((tick) => <g key={tick}><line x1={chart.left} x2={chart.right} y1={yWear(tick)} y2={yWear(tick)} stroke="#c9c8bd" strokeWidth="1" /><text x={chart.left - 10} y={yWear(tick) + 4} textAnchor="end" fill="#72766d" style={labelStyle}>{tick}</text></g>)}
        <line x1={chart.left} x2={chart.right} y1={chart.bottom} y2={chart.bottom} stroke="#777b72" />
        <line x1={chart.left} x2={chart.left} y1={chart.top} y2={chart.bottom} stroke="#777b72" />
        <path d={pathFor("wear", yWear)} fill="none" stroke="#d8664b" strokeWidth="3" strokeLinejoin="round" />
        <path d={pathFor("grip", yGrip)} fill="none" stroke="#263128" strokeWidth="2.5" strokeLinejoin="round" strokeDasharray="5 4" />
        <line x1={pitX} x2={pitX} y1={chart.top} y2={chart.bottom} stroke="#d8664b" strokeDasharray="3 4" />
        <circle cx={pitX} cy={yWear(0)} r="5" fill="#d8664b" stroke="#f2efe6" strokeWidth="3" />
        <text x={rainStart + 8} y={chart.top + 16} fill="#526456" style={labelStyle}>RAIN / 0.5</text>
        <text x={decisionStart + 8} y={chart.top + 34} fill="#8b7621" style={labelStyle}>RECOMMENDATION WINDOW</text>
        <text x={pitX + 8} y={chart.top + 52} fill="#b24c36" style={labelStyle}>PIT / LAP 41</text>
        {[1, 10, 20, 30, 40, 50].map((lap) => <text key={lap} x={x(lap)} y={chart.bottom + 22} textAnchor="middle" fill="#72766d" style={labelStyle}>{String(lap).padStart(2, "0")}</text>)}
        <text x={chart.left} y={chart.bottom + 44} fill="#72766d" style={labelStyle}>LAP</text>
        <text x={chart.left} y={chart.top - 10} fill="#d8664b" style={labelStyle}>TIRE WEAR / 80</text>
        <text x={chart.right} y={chart.top - 10} textAnchor="end" fill="#263128" style={labelStyle}>GRIP / 1.0</text>
        <rect x={chart.left} y="300" width="674" height="12" fill="#263128" opacity=".9" />
        <rect x={chart.left} y="300" width={x(40) - chart.left} height="12" fill="#d8664b" />
        <text x={chart.left + 6} y="309" fill="#fff" style={{ ...labelStyle, fontSize: 9 }}>MEDIUM</text>
        <text x={pitX + 6} y="309" fill="#fff" style={{ ...labelStyle, fontSize: 9 }}>HARD</text>
      </svg>
      <figcaption className="stratsim-race-figure__caption">
        <span>Saved run / tire manager test</span>
        <span>Grip falls from 1.0 to 0.34 before the lap 41 stop; the hard compound resets it to 1.0.</span>
      </figcaption>
    </figure>
  );
}
