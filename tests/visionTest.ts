import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";

// Configuração do ambiente
dotenv.config();

// Verifique se a chave da API está definida
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined");
}

// Inicialize GoogleAIFileManager com sua API_KEY.
const fileManager = new GoogleAIFileManager(API_KEY);

// Função para fazer o upload do arquivo e obter o URI
const uploadFile = async (filePath: string) => {
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: "image/jpeg", // Certifique-se de que o MIME type está correto
    displayName: "Measurement Image",
  });
  return uploadResponse.file.uri;
};

// Inicialize GoogleGenerativeAI com sua API_KEY.
const genAI = new GoogleGenerativeAI(API_KEY);

// Função para gerar conteúdo usando o URI do arquivo
const generateContent = async (fileUri: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });

  const prompt = "Does this look store-bought or homemade?";

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: "image/jpeg",
        fileUri: fileUri,
      },
    },
    { text: prompt },
  ]);

  return result.response.text();
};

const measure = async () => {
  try {
    // Ajuste o caminho do arquivo usando __dirname
    const filePath = path.join(__dirname, '..', 'uploads', 'medidor.jpg'); // Caminho relativo à raiz do projeto
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    // Faça o upload do arquivo e obtenha o URI
    const fileUri = await uploadFile(filePath);
    console.log(`Uploaded file URI: ${fileUri}`);

    // Gere o conteúdo usando o URI do arquivo
    const content = await generateContent(fileUri);
    console.log("Generated content:", content);
  } catch (error) {
    console.error("Error:", error);
  }
};

measure();
