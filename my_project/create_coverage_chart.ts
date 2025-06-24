import { serve } from "https://deno.land/std/http/server.ts";
import { Converter } from "./parse_tsv.ts";

async function createJson(tsv_file: string) {
    const converter = new Converter();
    return await converter.textToJson(tsv_file);
  }
  
  const coverage_json = await createJson("/Volumes/T7/31462/30606-auto-cell-type.rmd.tsv");
  


const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Plot Example</title>
        <script src="https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm"></script>
        <style>
          body { font-family: sans-serif; padding: 20px; }
        </style>
      </head>
      <body>
        <h2>Coverage Summary</h2>
        <div id="chart"></div>

        <script type="module">
          import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
          import { format } from "https://cdn.jsdelivr.net/npm/d3-format@3/+esm";

          const coverageData = ${JSON.stringify(coverage_json)};

          const chart = Plot.plot({
            marginLeft: 200,
            x: {axis: "top", percent: true},
            y: {label: "Sample ID"},
            marks: [
              Plot.barX(coverageData, {
                x: "proportion_≥_specified_depth",
                y: "sample_id",
                fill: d => {
                    const value = d["proportion_≥_specified_depth"];
                    if (value > 0.9) return "green";
                    if (value < 0.9) return "red";
                    return "red";
                },
                sort: {y: "-x"}
              }),
              Plot.text(coverageData, {
                x: "proportion_≥_specified_depth",
                y: "sample_id",
                text: d => format(".1%")(d["proportion_≥_specified_depth"]),
                textAnchor: "start",
                dx: 3,
                filter: d => d["proportion_≥_specified_depth"] <= 0.07,
                fill: "currentColor"
              }),
              Plot.text(coverageData, {
                x: "proportion_≥_specified_depth",
                y: "sample_id",
                text: d => format(".1%")(d["proportion_≥_specified_depth"]),
                textAnchor: "end",
                dx: -3,
                filter: d => d["proportion_≥_specified_depth"] > 0.07,
                fill: "white"
              }),
              Plot.ruleX([0])
            ]
          });
          document.getElementById("chart").appendChild(chart);
        </script>
      </body>
    </html>`;

await Deno.writeTextFile("chart.html", html);