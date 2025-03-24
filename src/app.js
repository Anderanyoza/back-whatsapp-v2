const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  whatsapp,
  getIsAuthenticated,
  getQrCode,
} = require("./config/whatsapp.config");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Middlewares
app.use(
  cors({
    origin: "*", // Permite peticiones desde cualquier dominio
    methods: ["GET", "POST"], // Permite métodos GET y POST
  })
);
app.use(express.json());

// Rutas
const whatsappRoutes = require("./routes/whatsapp.routes");
app.use("/api/whatsapp", whatsappRoutes);

app.get("/api/whatsapp/status", (req, res) => {
  res.json({ isAuthenticated: getIsAuthenticated(), qrCode: getQrCode() });
});

module.exports = app;
