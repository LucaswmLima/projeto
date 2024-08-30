import { Request, Response } from 'express';
import { uploadToLocalStorage } from '../services/storageService';
import Picture from '../models/PictureModel';
import { v4 as uuidv4 } from 'uuid';
import { processMeterImage } from '../services/geminiService';

// Gera ID unico
const generateUUID = (): string => uuidv4();

// Função de validação de base64
const isValidBase64Image = (base64Data: string): boolean => {
  return /^data:image\/\w+;base64,/.test(base64Data);
};

export const create = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime } = req.body;
    let { measure_type } = req.body;

    // Validade se todos os campos estão sendo enviados
    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Todos os campos são obrigatórios',
      });
    }

    // Valida o formato base64 da imagem enviada
    if (!isValidBase64Image(image)) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Formato da imagem base64 inválido"
      });
    }

    //Valida o tipo de medição
    measure_type = measure_type.toUpperCase();

    if (measure_type !== 'WATER' && measure_type !== 'GAS') {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: "O tipo de medição deve ser 'WATER' ou 'GAS'",
      });
    }

    // Validação do formato da data
    const date = new Date(measure_datetime);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Formato de data/hora inválido',
      });
    }

    //Encontra as datas para usar na validação de tempo
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

    // Valida por tempo
    if (existingPicture) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    // Processa a imagem no serviço do google
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    let measure_value;
    try {
      measure_value = await processMeterImage(base64Data);
    } catch (err) {
      console.error('Erro ao processar a imagem:', err);
      return res.status(500).json({
        error_code: 'IMAGE_PROCESSING_ERROR',
        error_description: 'Erro ao processar a imagem.',
      });
    }

    // Faz upload da imagem no serviço de storage local e gera o link
    const imageUrl = uploadToLocalStorage(base64Data, 'image/jpeg'); // Define o tipo de conteúdo conforme necessário

    // Cria a picture que irá ser salva
    const picture = new Picture({
      image_url: imageUrl,
      customer_code,
      measure_datetime,
      measure_type,
      measure_uuid: generateUUID(),
      measure_value,
    });

    // Salva no banco
    await picture.save();

    // Resposta caso tudo ocorra bem
    res.status(200).json({
      image_url: imageUrl,
      measure_value: parseInt(measure_value, 10),
      measure_uuid: picture.measure_uuid,
    });
  } catch (error) {
    return res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Ocorreu um erro ao processar a requisição',
    });
  }
};
