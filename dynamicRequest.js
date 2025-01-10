const fs = require("fs");
const csv = require("csv-parser");
const newman = require("newman");
const { parse } = require("json2csv");

// File CSV Input dan Output
const inputFilePath =
  "C:\\Users\\hendri.christianto_f\\Downloads\\newman\\encrypted_data.csv"; // CSV untuk request body
const outputFilePath =
  "C:\\Users\\hendri.christianto_f\\Downloads\\newman\\responses.csv"; // File hasil response

// Array untuk menyimpan data dari CSV
const dataRows = [];

// Membaca CSV terlebih dahulu
fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    dataRows.push(row); // Simpan setiap baris CSV ke array
  })
  .on("end", () => {
    console.log("CSV Input processed successfully. Running Newman...");

    // Jalankan Newman untuk semua data di CSV
    newman.run(
      {
        collection:
          "C:\\Users\\hendri.christianto_f\\Downloads\\newman\\Load data.postman_collection.json", // Path ke koleksi Postman
        iterationData: dataRows, // Data CSV untuk semua iterasi
      },
      (err, summary) => {
        if (err) {
          console.error("Error running Newman:", err);
          return;
        }

        // Simpan response body ke array
        const responses = [];
        summary.run.executions.forEach((execution, index) => {
          try {
            const responseBody = execution.response.stream.toString(); // Ambil respons
            responses.push({
              requestData: dataRows[index], // Data request dari iterasi
              responseBody: JSON.parse(responseBody), // Parse JSON dari respons
            });
          } catch (error) {
            console.error(
              `Error parsing response for row ${index}:`,
              error.message
            );
          }
        });

        // Tulis ke file CSV
        if (responses.length > 0) {
          const csvData = parse(responses, {
            fields: ["requestData", "responseBody"],
          });
          fs.writeFileSync(outputFilePath, csvData);
          console.log("Responses saved to:", outputFilePath);
        } else {
          console.log("No valid responses to save.");
        }
      }
    );
  });
