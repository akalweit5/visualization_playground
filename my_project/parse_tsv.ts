import { readFile } from "node:fs/promises"; // or "fs/promises" for Node.js style

export const fs = { readFile }; 

export class Converter {
  /**
   * Convert text file to JSON
   */
  async textToJson(filePath: string, delimiter = "\t") {
    const data = (await fs.readFile(filePath)).toString().split("\n");
    const headers = data.shift()!.split(delimiter);
    const jsonArr = [];

    for (let i = 0; i < data.length; i++) {
      if (/^\s*$/.test(data[i])) continue; // skip empty lines

      const values = data[i].split(delimiter);
      const json: any = {};

      for (let i = 0; i < values.length; i++) {
        const key = headers[i].trim().replace(/ /g, "_");
        json[key] = values[i].trim();
      }

      jsonArr.push(json);
    }

    let jsonStr = "[";

    for (let i = 0; i < jsonArr.length; i++) {
      jsonStr += JSON.stringify(jsonArr[i]);
      if (i !== jsonArr.length - 1) jsonStr += ",";
    }

    jsonStr += "]";
    return JSON.parse(jsonStr) as any[];
  }
}
