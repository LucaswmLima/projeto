import { Request, Response } from 'express';
import { uploadToLocalStorage } from '../services/storageService';
import Picture from '../models/PictureModel';
import { v4 as uuidv4 } from 'uuid';
import { processMeterImage } from '../services/geminiService';

const generateUUID = (): string => uuidv4();

export const create = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime } = req.body;
    let { measure_type } = req.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Todos os campos são obrigatórios',
      });
    }

    measure_type = measure_type.toUpperCase();

    if (measure_type !== 'WATER' && measure_type !== 'GAS') {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: "O tipo de medição deve ser 'WATER' ou 'GAS'",
      });
    }

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
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

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

    const imageUrl = uploadToLocalStorage(base64Data, 'image/jpeg'); // Define o tipo de conteúdo conforme necessário

    const picture = new Picture({
      image_url: imageUrl,
      customer_code,
      measure_datetime,
      measure_type,
      measure_uuid: generateUUID(),
      measure_value,
    });

    await picture.save();

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
