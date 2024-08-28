import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyBZ0uwFXjWWyvi0lx6wPr7lIYCdhC3sOTo';

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const processMeterImage = async (base64Image: string): Promise<string> => {
  const prompt = `
    Please identify the measurement displayed on the meter. 
    Focus only on the digits shown on the meter's display, 
    ignoring any surrounding text, symbols, or irrelevant numbers. 
    The display shows only integer values. 
    Disregard any leading zeros and return the result as a whole number. 
    Sometimes the meter is new so it can be only zeros.
  `;

  const image = {
    inlineData: {
      data: base64Image,
      mimeType: "image/webp", // Assumindo que a imagem é JPG
    },
  };

  try {
    const result = await model.generateContent([prompt, image]);
    return result.response.text();
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
};
