const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

let isAuthenticated = false;
let qrCode = null;

const whatsapp = new Client({
  puppeteer: {
    headless: true, // Render no tiene entorno gráfico
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

whatsapp.on("qr", (qr) => {
  qrCode = qr;
  isAuthenticated = false;
  qrcode.generate(qr, { small: true });
  console.log("📲 Escanea el código QR en WhatsApp Web.");
});

whatsapp.on("ready", () => {
  isAuthenticated = true;
  qrCode = null;
  console.log("✅ WhatsApp Web conectado y listo.");
});

whatsapp.on("disconnected", (reason) => {
  console.log(`⚠️ Desconectado: ${reason}. Reiniciando cliente...`);
  isAuthenticated = false;
  qrCode = null;
});

whatsapp.initialize();
//cambios
module.exports = {
  whatsapp,
  getIsAuthenticated: () => isAuthenticated,
  getQrCode: () => qrCode,
};
