const { whatsapp } = require("../config/whatsapp.config");
const { MessageMedia } = require("whatsapp-web.js");
// const convertirABase64 = require("../convert");
// const path = require("path");

// const fs = require("fs");

const Usuario = {
  findAll: async () => [
    { nombre: "Pedro", telefono: "51914563128" },
    { nombre: "Ana", telefono: "51 946914475" },
  ],
};

// const sendImage = async (req, res) => {
//   try {
//     let { imagen, mensaje } = req.body;

//     if (!imagen) {
//       return res.status(400).json({
//         error: "La imagen es obligatoria",
//       });
//     }
//     const usuarios = await Usuario.findAll();

//     if (!usuarios.length) {
//       return res.status(404).json({
//         success: false,
//         error: "No hay usuarios en la base de datos",
//       });
//     }

//     const mimeType = imagen.startsWith("/9j/") ? "image/jpeg" : "image/png";

//     const media = new MessageMedia(mimeType, imagen, "imagen_enviada");

//     let enviados = 0;
//     let errores = 0;

//     for (const usuario of usuarios) {
//       const numero = usuario.telefono.replace(/\s+/g, "");
//       const chatId = `${numero}@c.us`;

//       try {
//         await whatsapp.sendMessage(chatId, media, { caption: mensaje || "" });
//         enviados++;
//       } catch (err) {
//         console.error(`❌ Error enviando a ${numero}:`, err);
//         errores++;
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: `✅ Imagen enviada a ${enviados} usuarios`,
//       errores,
//     });
//   } catch (error) {
//     console.error("❌ Error enviando imagen:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Error enviando la imagen",
//     });
//   }
// };

const sendImages = async (req, res) => {
  try {
    let { imagenes, mensaje } = req.body;

    if (!imagenes || !Array.isArray(imagenes) || imagenes.length === 0) {
      return res.status(400).json({
        error: "Al menos una imagen es obligatoria",
      });
    }

    const usuarios = await Usuario.findAll();

    if (!usuarios.length) {
      return res.status(404).json({
        success: false,
        error: "No hay usuarios en la base de datos",
      });
    }

    let enviados = 0;
    let errores = 0;

    for (const usuario of usuarios) {
      const numero = usuario.telefono.replace(/\s+/g, "");
      const chatId = `${numero}@c.us`;

      try {
        // Enviar mensaje de texto primero (si hay mensaje)
        if (mensaje) {
          await whatsapp.sendMessage(chatId, mensaje);
        }

        // Enviar imágenes después
        for (const img of imagenes) {
          const mimeType = img.startsWith("/9j/") ? "image/jpeg" : "image/png";
          const media = new MessageMedia(mimeType, img, "imagen_enviada");

          await whatsapp.sendMessage(chatId, media);
        }

        enviados++;
      } catch (err) {
        console.error(`❌ Error enviando a ${numero}:`, err);
        errores++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `✅ Mensaje y imágenes enviadas a ${enviados} usuarios`,
      errores,
    });
  } catch (error) {
    console.error("❌ Error enviando mensaje e imágenes:", error);
    return res.status(500).json({
      success: false,
      error: "Error enviando el mensaje e imágenes",
    });
  }
};

const sendMessage = async (req, res) => {
  let { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ error: "El mensaje es requerido" });
  }

  try {
    const usuarios = await Usuario.findAll(); // Obtener usuarios de la "base de datos falsa"

    for (const user of usuarios) {
      const chatId = `${user.telefono}@c.us`;
      await whatsapp.sendMessage(chatId, mensaje);
      console.log(`📩 Mensaje enviado a ${user.nombre} (${user.telefono})`);
    }

    res.status(200).json({
      success: true,
      message: "Mensajes enviados correctamente",
    });
  } catch (error) {
    console.error("❌ Error enviando mensajes:", error);
    res.status(500).json({
      success: false,
      error: "Error enviando los mensajes",
    });
  }
};

module.exports = { sendMessage, sendImages };
