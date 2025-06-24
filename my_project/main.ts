import { createChart } from "./chart.ts";
import { DOMParser } from "https://esm.sh/linkedom";

const data = [
  { name: "Apples", value: 30 },
  { name: "Bananas", value: 20 },
  { name: "Cherries", value: 50 },
];

const chart = createChart(data);

// Convert chart SVG node to HTML if running in CLI
const parser = new DOMParser();
const doc = parser.parseFromString("<!DOCTYPE html><body></body>", "text/html");
doc.body.append(chart);

console.log(doc.body.innerHTML);  // prints SVG markup