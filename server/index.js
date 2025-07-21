const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_PATH = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

// Receive JSON, write as CSV
app.post("/upload", (req, res) => {
  const data = req.body;
  const csv = convertToCSV(data);
  const filename = `data_${Date.now()}.csv`;
  const filepath = path.join(UPLOAD_PATH, filename);

  fs.writeFileSync(filepath, csv);
  console.log("Saved CSV:", filename);

  res.json({ success: true, url: `/files/${filename}` });
});

// Serve CSVs
app.use("/files", express.static(UPLOAD_PATH));

// Root status
app.get("/", (req, res) => res.send("📊 Sync server is running."));

function convertToCSV(json) {
  let rows = [];
  for (const date in json) {
    const names = json[date].map(e => e.name).join(",");
    const heights = json[date].map(e => e.height).join(",");
    rows.push([date, names, heights]);
  }
  return rows.map(r => r.join(",")).join("\n");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
