import * as XLSX from "xlsx-js-style";

/**
 * Common utility to export data to Excel with specific formatting.
 * 
 * @param {Object} options
 * @param {string} options.fileName - Name of the file to be saved (without extension)
 * @param {string} options.sheetName - Name of the worksheet
 * @param {string} options.reportTitle - Title shown at the top of the report
 * @param {string[]} options.headers - Column headers
 * @param {Array[]} options.data - 2D array of data rows
 */
export const exportToExcel = ({ fileName, sheetName, reportTitle, headers, data }) => {
  const wb = XLSX.utils.book_new();
  
  // Prepare data for worksheet
  const wsData = [];
  
  // Row 0: Report Title
  wsData.push([reportTitle]);
  
  // Row 1: Empty for spacing
  wsData.push([]);
  
  // Row 2: Headers
  wsData.push(headers);
  
  // Row 3 onwards: Data
  data.forEach(row => {
    wsData.push(row);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Get range to apply styles
  const range = XLSX.utils.decode_range(ws["!ref"]);
  const colCount = headers.length;
  
  // 1. Heading in middle (merged across columns, centered)
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } }
  ];
  
  const titleCellAddress = XLSX.utils.encode_cell({ r: 0, c: 0 });
  if (ws[titleCellAddress]) {
    ws[titleCellAddress].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }
  
  // 4. Headings of each column is bold (Row 2)
  for (let c = 0; c < colCount; c++) {
    const headerCellAddress = XLSX.utils.encode_cell({ r: 2, c: c });
    if (ws[headerCellAddress]) {
      ws[headerCellAddress].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "F3F4F6" } }, // Light gray background
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };
    }
  }
  
  // 2. Text are in LHS, 3. Numbers are in RHS
  // Apply to all data rows (starting from index 3)
  for (let r = 3; r <= range.e.r; r++) {
    for (let c = 0; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = ws[cellAddress];
      if (cell) {
        const isNumber = typeof cell.v === "number";
        cell.s = {
          alignment: { 
            horizontal: isNumber ? "right" : "left",
            vertical: "center"
          },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
        
        // 5. Cell contain text
        // Ensure numbers don't lose formatting if they are meant to be text (though usually handled by XLSX)
        if (!isNumber && cell.v !== null && cell.v !== undefined) {
           cell.t = 's'; // Force type to string if it's not a number
        }
      }
    }
  }
  
  // Auto-width columns
  const wscols = headers.map((h, i) => {
    let maxLen = h.length;
    for (let r = 2; r <= range.e.r; r++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c: i })];
      if (cell && cell.v) {
        const len = String(cell.v).length;
        if (len > maxLen) maxLen = len;
      }
    }
    return { wch: maxLen + 5 }; // Add some padding
  });
  ws["!cols"] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, sheetName || "Report");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
