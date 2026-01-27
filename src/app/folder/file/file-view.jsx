import { PANEL_UPDATE_FILE_FOLDER } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useApiMutation } from "@/hooks/use-mutation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Loader2,
  Rows,
  Columns,
  Trash2,
  Save,
  Sheet,
  Plus,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as XLSX from "xlsx";
const FileView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileUrl = state?.fileUrl ?? "";
  const fileName = state?.fileName ?? "";
  const folderUnique = state?.id ?? "";
  const [sheets, setSheets] = useState([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [modifiedCells, setModifiedCells] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const { trigger: updateFileTrigger, loading: isSaving } = useApiMutation();
  const trimmedName = fileName.replace(/\.[^/.]+$/, "");
  const [resizing, setResizing] = useState({
    active: false,
    colIndex: null,
    startX: 0,
    startWidth: 0,
  });

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const res = await axios.get(fileUrl, {
          responseType: "arraybuffer",
        });

        const arrayBuffer = res.data;

        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const parsed = workbook.SheetNames.map((name) => ({
          name,
          data: XLSX.utils.sheet_to_json(workbook.Sheets[name], {
            header: 1,
            defval: "",
          }),
          colWidths: [],
        }));

        setSheets(parsed);
        setCurrentSheetIndex(0);
      } catch (err) {
        console.error("Error loading Excel:", err);
        toast.error(err.message || "Failed to load Excel file.");
      }
    };
    if (fileUrl) loadExcel();
  }, [fileUrl]);

  const currentSheet = sheets[currentSheetIndex];
  const rows = currentSheet?.data || [];
  const headers = rows[0] || [];
  const colWidths = currentSheet?.colWidths || [];

  /** Update entire sheet */
  const updateSheet = (newData) => {
    const updated = [...sheets];
    updated[currentSheetIndex].data = newData;
    setSheets(updated);
  };

  /** Edit cell */
  const handleCellChange = (ri, ci, value) => {
    const updated = [...rows];
    if (!updated[ri]) updated[ri] = [];
    updated[ri][ci] = value;

    updateSheet(updated);
    setModifiedCells((prev) => ({
      ...prev,
      [currentSheetIndex]: {
        ...(prev[currentSheetIndex] || {}),
        [`${ri}-${ci}`]: true,
      },
    }));
  };
  const modifyRow = (index, type) => {
    const data = [...rows];
    const cols = data[0]?.length || 0;
    if (type === "addAbove") data.splice(index, 0, new Array(cols).fill(""));
    if (type === "addBelow")
      data.splice(index + 1, 0, new Array(cols).fill(""));
    if (type === "delete" && index !== 0) data.splice(index, 1);
    updateSheet(data);
    setContextMenu(null);
  };

  /** Modify columns */
  const modifyColumn = (index, type) => {
    const data = [...rows];
    data.forEach((row) => {
      if (type === "addLeft") row.splice(index, 0, "");
      if (type === "addRight") row.splice(index + 1, 0, "");
      if (type === "delete") row.splice(index, 1);
    });
    updateSheet(data);

    const updatedSheets = [...sheets];
    const sheet = { ...updatedSheets[currentSheetIndex] };
    const widths = sheet.colWidths ? [...sheet.colWidths] : [];

    if (type === "addLeft" || type === "addRight") {
      const newWidth = 150;
      const insertIndex = type === "addLeft" ? index : index + 1;
      widths.splice(insertIndex, 0, newWidth);
    } else if (type === "delete") {
      widths.splice(index, 1);
    }
    sheet.colWidths = widths;
    updatedSheets[currentSheetIndex] = sheet;
    setSheets(updatedSheets);

    setContextMenu(null);
  };

  /** Save edited workbook */
  const handleSave = async () => {
    try {
      const workbook = XLSX.utils.book_new();
      sheets.forEach((sheet) => {
        const worksheet = XLSX.utils.aoa_to_sheet(sheet.data);
        if (sheet.colWidths && sheet.colWidths.length > 0) {
          worksheet["!cols"] = sheet.colWidths.map((w) => ({ wpx: w }));
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
      });

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const formData = new FormData();
      formData.append("file_folder_unique", folderUnique);
      formData.append("file_name", blob, fileName);
      formData.append("folder_file_name", trimmedName);

      const res = await updateFileTrigger({
        url: PANEL_UPDATE_FILE_FOLDER,
        method: "post",
        data: formData,
      });

      if (res?.code === 201) {
        toast.success("File updated successfully!");
        navigate(-1, { state: { shouldRefetch: true } });
      } else {
        toast.error(res?.message || "Failed to update file");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving the file");
    }
  };

  /** Column resize handlers */
  const handleMouseDown = (e, ci) => {
    e.preventDefault();
    setResizing({
      active: true,
      colIndex: ci,
      startX: e.clientX,
      startWidth: colWidths[ci] || 150,
    });
  };
  const deleteSheet = (idx) => {
    if (sheets.length === 1) {
      toast.error("At least one sheet must exist");
      return;
    }

    const updated = sheets.filter((_, i) => i !== idx);
    setSheets(updated);

    if (currentSheetIndex === idx) {
      setCurrentSheetIndex(0);
    } else if (currentSheetIndex > idx) {
      setCurrentSheetIndex(currentSheetIndex - 1);
    }
  };
  useEffect(() => {
    if (!resizing.active) return;

    const handleMouseMove = (e) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(50, resizing.startWidth + delta);

      const updatedSheets = [...sheets];
      const sheet = { ...updatedSheets[currentSheetIndex] };
      const widths = sheet.colWidths ? [...sheet.colWidths] : [];
      widths[resizing.colIndex] = newWidth;
      sheet.colWidths = widths;
      updatedSheets[currentSheetIndex] = sheet;
      setSheets(updatedSheets);
    };

    const handleMouseUp = () =>
      setResizing({ active: false, colIndex: null, startX: 0, startWidth: 0 });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing, sheets, currentSheetIndex]);

  /** Add New Sheet */
  const addNewSheet = () => {
    const newSheetIndex = sheets.length + 1;
    const newSheetName = `Sheet${newSheetIndex}`;
    const defaultData = [
      ["Column1", "Column2", "Column3"],
      ["", "", ""],
      ["", "", ""],
    ];
    const defaultColWidths = [150, 150, 150];
    const newSheet = {
      name: newSheetName,
      data: defaultData,
      colWidths: defaultColWidths,
    };
    setSheets([...sheets, newSheet]);
    setCurrentSheetIndex(sheets.length);
  };

  /** Rename Sheet */
  const renameSheet = (idx) => {
    const newName = prompt("Enter sheet name", sheets[idx].name);
    if (!newName) return;
    const updated = [...sheets];
    updated[idx].name = newName;
    setSheets(updated);
  };

  if (!sheets.length)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading Excel...
      </div>
    );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Sheet className="text-blue-600" size={22} />
          Excel Editor
        </h2>
        <div className="flex gap-2">
          <Button onClick={addNewSheet} className="flex items-center gap-2">
            <Plus size={18} /> Add Sheet
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sheet Tabs */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {sheets.map((sheet, idx) => (
          <div
            key={sheet.name + idx}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-all cursor-pointer ${
              currentSheetIndex === idx
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <button
              key={sheet.name + idx}
              onClick={() => setCurrentSheetIndex(idx)}
              onDoubleClick={() => renameSheet(idx)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all flex items-center gap-1 ${
                currentSheetIndex === idx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Sheet size={16} /> {sheet.name}
            </button>
            <Trash2
              size={14}
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => deleteSheet(idx)}
            />
          </div>
        ))}
      </div>

      {/* Excel Table */}
      <div className="overflow-auto max-h-[calc(100vh-200px)] border rounded-md bg-white shadow-sm">
        <table className="min-w-full table-auto text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="w-10 bg-gray-50 text-center">#</th>
              {headers.map((header, ci) => {
                const modified = modifiedCells[currentSheetIndex]?.[`0-${ci}`];
                const width = colWidths[ci] || 150;

                return (
                  <th
                    key={ci}
                    className={`border px-2 py-1 font-semibold text-gray-700 relative ${
                      modified ? "bg-red-100" : ""
                    }`}
                    style={{ width }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        col: ci,
                        type: "header",
                      });
                    }}
                  >
                    <textarea
                      value={header}
                      onChange={(e) => handleCellChange(0, ci, e.target.value)}
                      className="w-full bg-transparent focus:outline-none resize-none overflow-hidden whitespace-pre-wrap"
                      rows={1}
                      onInput={(e) => {
                        const target = e.target;
                        target.style.height = "auto";
                        target.style.height = target.scrollHeight + "px";
                      }}
                    />
                    {/* Resizer */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, ci)}
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-400/40"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, ri) => {
              const actualRow = ri + 1;
              return (
                <tr key={ri} className="even:bg-gray-50">
                  <td className="text-center text-gray-500 bg-gray-100 border">
                    {actualRow}
                  </td>
                  {headers.map((_, ci) => {
                    const key = `${actualRow}-${ci}`;
                    const modified = modifiedCells[currentSheetIndex]?.[key];
                    const width = colWidths[ci] || 150;
                    return (
                      <td
                        key={ci}
                        className={`border px-2 py-1 ${
                          modified ? "bg-yellow-100" : ""
                        }`}
                        style={{ width }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            x: e.clientX,
                            y: e.clientY,
                            row: actualRow,
                            col: ci,
                            type: "body",
                          });
                        }}
                      >
                        <textarea
                          value={row[ci] ?? ""}
                          onChange={(e) =>
                            handleCellChange(actualRow, ci, e.target.value)
                          }
                          className="w-full bg-transparent focus:outline-none resize-none overflow-hidden whitespace-pre-wrap"
                          rows={1}
                          onInput={(e) => {
                            const target = e.target;
                            target.style.height = "auto";
                            target.style.height = target.scrollHeight + "px";
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Context Menu */}
        {contextMenu && (
          <Popover
            open={!!contextMenu}
            onOpenChange={() => setContextMenu(null)}
          >
            <PopoverTrigger asChild>
              <div
                style={{
                  position: "fixed",
                  top: contextMenu.y,
                  left: contextMenu.x,
                  width: 1,
                  height: 1,
                }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 text-sm space-y-1">
              {contextMenu.type === "body" && (
                <>
                  <button
                    onClick={() => modifyRow(contextMenu.row, "addAbove")}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100"
                  >
                    <Rows size={16} /> Add Row Above
                  </button>
                  <button
                    onClick={() => modifyRow(contextMenu.row, "addBelow")}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100"
                  >
                    <Plus size={16} /> Add Row Below
                  </button>
                  <button
                    onClick={() => modifyRow(contextMenu.row, "delete")}
                    className="flex items-center gap-2 w-full px-2 py-1 text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} /> Delete Row
                  </button>
                  <hr />
                </>
              )}
              {(contextMenu.type === "header" ||
                contextMenu.type === "body") && (
                <>
                  <button
                    onClick={() => modifyColumn(contextMenu.col, "addLeft")}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100"
                  >
                    <Columns size={16} /> Add Column Left
                  </button>
                  <button
                    onClick={() => modifyColumn(contextMenu.col, "addRight")}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100"
                  >
                    <Plus size={16} /> Add Column Right
                  </button>
                  <button
                    onClick={() => modifyColumn(contextMenu.col, "delete")}
                    className="flex items-center gap-2 w-full px-2 py-1 text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} /> Delete Column
                  </button>
                </>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default FileView;
