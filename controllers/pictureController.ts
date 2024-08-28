import { Request, Response } from "express";
import Picture from "../models/PictureModel";
import { v4 as uuidv4 } from 'uuid'; // Usando a biblioteca uuid
import { processMeterImage } from "../services/geminiService"; // Importando a função de processamento

// Função para gerar UUID
const generateUUID = (): string => uuidv4();

export const create = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Validação dos dados recebidos
    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Todos os campos são obrigatórios",
      });
    }
    if (measure_type !== "WATER" && measure_type !== "GAS") {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "O tipo de medição deve ser 'WATER' ou 'GAS'",
      });
    }

    // Remove o prefixo da imagem base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    // Processa a imagem para obter o valor da medição
    const measure_value = await processMeterImage(base64Data);

    // Cria um novo Picture
    const picture = new Picture({
      image,
      customer_code,
      measure_datetime,
      measure_type,
      measure_uuid: generateUUID(),
      measure_value
    });

    // Salva no banco de dados
    await picture.save();

    // Responde com sucesso
    res.status(200).json({
      image_url: picture.image, // Retorna a URL da imagem
      measure_value: parseInt(measure_value, 10), // Retorna o valor da medição
      measure_uuid: picture.measure_uuid // Retorna um id
    });
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).code === 11000) {
        // Código de erro de duplicação de índice
        return res.status(409).json({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        });
      }

      // Outros erros
      return res.status(500).json({
        error_code: "SERVER_ERROR",
        error_description: "Ocorreu um erro ao processar a requisição",
      });
    }
    
    // Caso o erro não seja uma instância de Error
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Ocorreu um erro inesperado",
    });
  }
};
