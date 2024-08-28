const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI("AIzaSyBZ0uwFXjWWyvi0lx6wPr7lIYCdhC3sOTo");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const geminiCall = async () => {
  const prompt =
    "Please identify the measurement displayed on the meter. Focus only on the digits shown on the meter's display, ignoring any surrounding text, symbols, or irrelevant numbers. The display shows only integer values. Disregard any leading zeros and return the result as a whole number. Sometimes the meter is new so it can be only zeros";
  const image = {
    inlineData: {
      data: Buffer.from(fs.readFileSync("./tests/medidor.jpg")).toString("base64"),
      mimeType: "image/jpg",
    },
  };

  const result = await model.generateContent([prompt, image]);
  console.log(result.response.text());
};

geminiCall();
