// utils/exportExcel.js
const ExcelJS = require("exceljs");

async function exportProductsExcel(products, res) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Products");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Name", key: "name", width: 30 },
    { header: "Description", key: "description", width: 50 },
    { header: "Price", key: "price", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Status", key: "status", width: 15 },
    { header: "Created At", key: "created_at", width: 20 },
  ];

  products.forEach((product) => {
    worksheet.addRow(product);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  workbook.xlsx.write(res).then(() => {
    res.end();
  });
}

module.exports = exportProductsExcel;
