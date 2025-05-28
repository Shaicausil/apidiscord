async function sendToGemini() {
  const inputText = document.getElementById('inputText').value;
  const responseContainer = document.getElementById('responseContainer');
  const discordMessage = document.getElementById('discordMessage');
  const loader = document.getElementById('loader');

  const apiKey = "AIzaSyChaQyBi2MYjba6NR6lGyM4DyPK1ZsZ8AM"; 

  if (!inputText.trim()) {
    responseContainer.textContent = "Por favor, ingresa algún texto.";
    return;
  }

  loader.style.display = 'block';
  responseContainer.textContent = "";
  discordMessage.textContent = "";

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Agregamos la instrucción para que Gemini nos diga si se debe enviar a Discord
  const promptParaIA = `${inputText} Ahora responde normalmente, pero al final responde solo con "ENVÍA A DISCORD: SÍ" o "ENVÍA A DISCORD: NO" para indicar si debo enviar esto a Discord.
  `.trim();

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: promptParaIA
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    loader.style.display = 'none';

    const fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (fullText && fullText.trim() !== "") {
      // Mostrar la respuesta de Gemini
      responseContainer.textContent = fullText;

      // Revisar si la respuesta contiene "ENVÍA A DISCORD: SÍ"
      if (fullText.includes("ENVÍA A DISCORD: SÍ")) {
        discordMessage.textContent = "MENSAJE ENVIADO AL DISCORD";
      } else {
        discordMessage.textContent = "";
      }
    } else {
      responseContainer.textContent = "No se recibió una respuesta válida de Gemini.";
    }

  } catch (error) {
    loader.style.display = 'none';
    console.error("Error:", error);
    responseContainer.textContent = "Error al conectar con la API. Revisa la consola para más detalles.";
  }
}
