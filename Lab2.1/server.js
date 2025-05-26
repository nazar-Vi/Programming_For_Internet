const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Для статичних файлів

// Шляхи до файлів даних
const DATA_DIR = path.join(__dirname, "data");
const JSON_FILE = path.join(DATA_DIR, "library_records.json");
const XML_FILE = path.join(DATA_DIR, "library_records.xml");

// Створення директорії для даних, якщо не існує
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ініціалізація файлів, якщо не існують або порожні
function initializeDataFiles() {
  // Ініціалізація JSON файлу
  if (!fs.existsSync(JSON_FILE)) {
    console.log("Створюємо новий JSON файл...");
    fs.writeFileSync(JSON_FILE, JSON.stringify([], null, 2));
  } else {
    // Перевіряємо, чи файл не порожній та містить валідний JSON
    try {
      const data = fs.readFileSync(JSON_FILE, "utf8");
      if (!data.trim()) {
        console.log("JSON файл порожній, ініціалізуємо...");
        fs.writeFileSync(JSON_FILE, JSON.stringify([], null, 2));
      } else {
        JSON.parse(data); // Перевіряємо валідність JSON
      }
    } catch (error) {
      console.log("JSON файл пошкоджений, переініціалізуємо...");
      fs.writeFileSync(JSON_FILE, JSON.stringify([], null, 2));
    }
  }

  // Ініціалізація XML файлу
  if (!fs.existsSync(XML_FILE)) {
    console.log("Створюємо новий XML файл...");
    fs.writeFileSync(
      XML_FILE,
      '<?xml version="1.0" encoding="UTF-8"?>\n<library_records>\n</library_records>'
    );
  }
}

// Викликаємо ініціалізацію
initializeDataFiles();

// Функції для роботи з даними
function readJSONData() {
  try {
    if (!fs.existsSync(JSON_FILE)) {
      // Якщо файл не існує, створюємо його з порожнім масивом
      writeJSONData([]);
      return [];
    }

    const data = fs.readFileSync(JSON_FILE, "utf8");

    // Перевіряємо, чи файл не порожній
    if (!data.trim()) {
      console.log("JSON файл порожній, ініціалізуємо порожнім масивом");
      writeJSONData([]);
      return [];
    }

    const parsedData = JSON.parse(data);

    // Перевіряємо, чи результат є масивом
    if (!Array.isArray(parsedData)) {
      console.log("JSON дані не є масивом, ініціалізуємо порожнім масивом");
      writeJSONData([]);
      return [];
    }

    return parsedData;
  } catch (error) {
    console.error("Помилка читання JSON:", error);
    console.log("Ініціалізуємо новий порожній масив");

    // У випадку помилки, створюємо новий файл з порожнім масивом
    writeJSONData([]);
    return [];
  }
}

function writeJSONData(data) {
  try {
    fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Помилка запису JSON:", error);
    return false;
  }
}

function arrayToXML(records) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<library_records>\n';

  records.forEach((record) => {
    xml += "  <record>\n";
    xml += `    <id>${record.id}</id>\n`;
    xml += `    <lastName>${escapeXML(record.lastName)}</lastName>\n`;
    xml += `    <address>${escapeXML(record.address)}</address>\n`;
    xml += `    <passportSeries>${escapeXML(
      record.passportSeries
    )}</passportSeries>\n`;
    xml += `    <passportNumber>${escapeXML(
      record.passportNumber
    )}</passportNumber>\n`;
    xml += `    <readerType>${escapeXML(record.readerType)}</readerType>\n`;
    xml += `    <createdAt>${record.createdAt}</createdAt>\n`;
    xml += "  </record>\n";
  });

  xml += "</library_records>";
  return xml;
}

function escapeXML(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
}

function writeXMLData(data) {
  try {
    const xmlData = arrayToXML(data);
    fs.writeFileSync(XML_FILE, xmlData);
    return true;
  } catch (error) {
    console.error("Помилка запису XML:", error);
    return false;
  }
}

// REST API маршрути

// GET /api/records - отримати всі записи
app.get("/api/records", (req, res) => {
  try {
    const records = readJSONData();
    res.json({
      success: true,
      data: records,
      count: records.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Помилка отримання записів",
      error: error.message,
    });
  }
});

// GET /api/records/:id - отримати запис за ID
app.get("/api/records/:id", (req, res) => {
  try {
    const records = readJSONData();
    const record = records.find((r) => r.id === req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Запис не знайдено",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Помилка отримання запису",
      error: error.message,
    });
  }
});

// POST /api/records - створити новий запис
app.post("/api/records", (req, res) => {
  try {
    console.log("Отримано POST запит:", req.body);

    const { lastName, address, passportSeries, passportNumber, readerType } =
      req.body;

    // Валідація даних
    if (
      !lastName ||
      !address ||
      !passportSeries ||
      !passportNumber ||
      !readerType
    ) {
      console.log("Валідація не пройдена:", {
        lastName,
        address,
        passportSeries,
        passportNumber,
        readerType,
      });
      return res.status(400).json({
        success: false,
        message: "Всі поля є обов'язковими",
      });
    }

    console.log("Читаємо існуючі записи...");
    const records = readJSONData();
    console.log("Кількість існуючих записів:", records.length);

    // Перевірка на унікальність паспортних даних
    const existingRecord = records.find(
      (r) =>
        r.passportSeries === passportSeries &&
        r.passportNumber === passportNumber
    );

    if (existingRecord) {
      console.log("Знайдено дублікат паспортних даних");
      return res.status(409).json({
        success: false,
        message: "Читач з такими паспортними даними вже існує",
      });
    }

    const newRecord = {
      id: uuidv4(),
      lastName: lastName.trim(),
      address: address.trim(),
      passportSeries: passportSeries.trim().toUpperCase(),
      passportNumber: passportNumber.trim(),
      readerType: readerType,
      createdAt: new Date().toISOString(),
    };

    console.log("Створено новий запис:", newRecord);

    records.push(newRecord);

    // Збереження в обох форматах
    console.log("Зберігаємо дані...");
    const jsonSaved = writeJSONData(records);
    const xmlSaved = writeXMLData(records);

    console.log("JSON збережено:", jsonSaved);
    console.log("XML збережено:", xmlSaved);

    if (!jsonSaved || !xmlSaved) {
      return res.status(500).json({
        success: false,
        message: "Помилка збереження даних",
      });
    }

    console.log("Запис успішно створено");
    res.status(201).json({
      success: true,
      message: "Запис успішно створено",
      data: newRecord,
    });
  } catch (error) {
    console.error("Помилка створення запису:", error);
    res.status(500).json({
      success: false,
      message: "Помилка створення запису",
      error: error.message,
    });
  }
});

// PUT /api/records/:id - оновити запис
app.put("/api/records/:id", (req, res) => {
  try {
    const { lastName, address, passportSeries, passportNumber, readerType } =
      req.body;
    const recordId = req.params.id;

    // Валідація даних
    if (
      !lastName ||
      !address ||
      !passportSeries ||
      !passportNumber ||
      !readerType
    ) {
      return res.status(400).json({
        success: false,
        message: "Всі поля є обов'язковими",
      });
    }

    const records = readJSONData();
    const recordIndex = records.findIndex((r) => r.id === recordId);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Запис не знайдено",
      });
    }

    // Перевірка на унікальність паспортних даних (окрім поточного запису)
    const existingRecord = records.find(
      (r) =>
        r.id !== recordId &&
        r.passportSeries === passportSeries &&
        r.passportNumber === passportNumber
    );

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message: "Читач з такими паспортними даними вже існує",
      });
    }

    // Оновлення запису
    records[recordIndex] = {
      ...records[recordIndex],
      lastName: lastName.trim(),
      address: address.trim(),
      passportSeries: passportSeries.trim().toUpperCase(),
      passportNumber: passportNumber.trim(),
      readerType: readerType,
      updatedAt: new Date().toISOString(),
    };

    // Збереження в обох форматах
    const jsonSaved = writeJSONData(records);
    const xmlSaved = writeXMLData(records);

    if (!jsonSaved || !xmlSaved) {
      return res.status(500).json({
        success: false,
        message: "Помилка збереження даних",
      });
    }

    res.json({
      success: true,
      message: "Запис успішно оновлено",
      data: records[recordIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Помилка оновлення запису",
      error: error.message,
    });
  }
});

// DELETE /api/records/:id - видалити запис
app.delete("/api/records/:id", (req, res) => {
  try {
    const recordId = req.params.id;
    const records = readJSONData();
    const recordIndex = records.findIndex((r) => r.id === recordId);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Запис не знайдено",
      });
    }

    const deletedRecord = records[recordIndex];
    records.splice(recordIndex, 1);

    // Збереження в обох форматах
    const jsonSaved = writeJSONData(records);
    const xmlSaved = writeXMLData(records);

    if (!jsonSaved || !xmlSaved) {
      return res.status(500).json({
        success: false,
        message: "Помилка збереження даних",
      });
    }

    res.json({
      success: true,
      message: "Запис успішно видалено",
      data: deletedRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Помилка видалення запису",
      error: error.message,
    });
  }
});

// Маршрут для отримання XML даних
app.get("/api/records/export/xml", (req, res) => {
  try {
    const xmlData = fs.readFileSync(XML_FILE, "utf8");
    res.set("Content-Type", "application/xml");
    res.send(xmlData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Помилка експорту XML",
      error: error.message,
    });
  }
});

// Обробка помилок 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Маршрут не знайдено",
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
  console.log(`📁 Дані зберігаються в: ${DATA_DIR}`);
  console.log("📚 API маршрути:");
  console.log("  GET    /api/records        - отримати всі записи");
  console.log("  GET    /api/records/:id    - отримати запис за ID");
  console.log("  POST   /api/records        - створити новий запис");
  console.log("  PUT    /api/records/:id    - оновити запис");
  console.log("  DELETE /api/records/:id    - видалити запис");
  console.log("  GET    /api/records/export/xml - експорт в XML");
});

module.exports = app;
