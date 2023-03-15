import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


export const ExportToExcel = (apiData, fileName, columnHeaders) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
  
    const exportToCSV = (apiData, fileName) => {
      const worksheet  = XLSX.utils.json_to_sheet(apiData);
      console.log(worksheet);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Reserva");
      XLSX.utils.sheet_add_aoa(worksheet, [columnHeaders], { origin: "A1" });
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    };    
    exportToCSV(apiData, fileName);
  };