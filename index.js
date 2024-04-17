const express = require("express");
const multer = require("multer"); // middleware for handling multipart/form-data, used for uploading files
const csv = require("csv-parser"); // used for parsing CSV data
const stream = require("stream"); // for creating readable streams

// App setup
const app = express();
const port = 3000;

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  return res.send("Hello, Astronaut :)");
});

app.post("/convert", upload.single("file"), (req, res) => {
  // init all variable
  let message = "Congratulations, your action has been successful :)";
  let error = "Failed";
  let csvData = [];

  // Check if file is provided
  if (!req.file) {
    return res.status(400).json({
      status: false,
      error: error,
    });
  }

  // Convert buffer to readable stream
  const bufferStream = stream.Readable.from(req.file.buffer.toString());

  // the logic starts from here !!!
  bufferStream
    .pipe(
      csv({
        separator: ";", // Specify the separator as semicolon
      })
    )
    .on("data", (row) => {
      csvData.push(row);
    })
    .on("end", () => {
      // send response after CSV parsing is complete
      res.json({
        status: true,
        message: message,
        data: csvData,
      });
    });
  // the logic has ended !!!
});

app.listen(port, () => {
  console.log(
    `Walking Among the Stars, Entrance [${port}] Triumphantly Accomplished....`
  );
});
