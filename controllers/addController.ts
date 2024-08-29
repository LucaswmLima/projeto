import { Request, Response } from "express";
import Picture from "../models/PictureModel";
import { v4 as uuidv4 } from "uuid";
import { processMeterImage } from "../services/geminiService";

// Codigo para gerar o id unico para as leituras
const generateUUID = (): string => uuidv4();

export const create = async (req: Request, res: Response) => {
  try {
    // Recebendo dados, measure_type em variavel para que possa ser convertido uppercase
    const { image, customer_code, measure_datetime } = req.body;
    let { measure_type } = req.body;

    // Validação dos dados recebidos
    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Todos os campos são obrigatórios",
      });
    }

    //Transforma para uppcase
    measure_type = measure_type.toUpperCase();

    // Verificação do tipo de medição com tratamento de capitalização
    if (measure_type !== "WATER" && measure_type !== "GAS") {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "O tipo de medição deve ser 'WATER' ou 'GAS'",
      });
    }

    // Verificação de duplicidade
    const measureDate = new Date(measure_datetime);
    const startOfMonth = new Date(
      measureDate.getFullYear(),
      measureDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      measureDate.getFullYear(),
      measureDate.getMonth() + 1,
      1
    );

    const existingPicture = await Picture.findOne({
      customer_code,
      measure_type,
      measure_datetime: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    if (existingPicture) {
      return res.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      });
    }

    // Trata a string da base 64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    let measure_value;
    try {
      // Processa a imagem para obter o valor da medição
      measure_value = await processMeterImage(base64Data);
    } catch (err) {
      console.error("Erro ao processar a imagem:", err);
      return res.status(500).json({
        error_code: "IMAGE_PROCESSING_ERROR",
        error_description: "Erro ao processar a imagem.",
      });
    }

    // Cria um novo Picture
    const picture = new Picture({
      image,
      customer_code,
      measure_datetime,
      measure_type,
      measure_uuid: generateUUID(),
      measure_value,
    });

    // Salva no banco de dados
    await picture.save();

    // Responde com sucesso
    res.status(200).json({
      image_url: picture.image, // Retorna a URL da imagem
      measure_value: parseInt(measure_value, 10), // Retorna o valor da medição
      measure_uuid: picture.measure_uuid, // Retorna um id
    });
  } catch (error) {
    return res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a requisição",
    });
  }
};
