import { Request, Response } from 'express';
import Picture from '../models/PictureModel';
import { v4 as uuidv4 } from 'uuid'; // Biblioteca uuid
import { uploadImage, processImageWithGemini } from '../services/geminiService'; // Serviço para upload e processamento de imagem

// Função para gerar UUID
const generateUUID = (): string => uuidv4();

exports.create = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Todos os campos são obrigatórios',
      });
    }

    if (measure_type !== 'WATER' && measure_type !== 'GAS') {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'O tipo de medição deve ser \'WATER\' ou \'GAS\'',
      });
    }

    // Upload da imagem e obtenção do URI
    let imageUri: string | null = null;
    try {
      imageUri = await uploadImage(image, 'image/jpeg'); // Define o MIME type adequado
    } catch (error) {
      return res.status(500).json({
        error_code: 'UPLOAD_ERROR',
        error_description: 'Ocorreu um erro ao fazer o upload da imagem',
      });
    }

    if (!imageUri) {
      return res.status(500).json({
        error_code: 'UPLOAD_ERROR',
        error_description: 'URI da imagem não disponível',
      });
    }

    // Processa a imagem com o Google Gemini Vision
    let measure_value: number | null = null;
    try {
      const geminiResult = await processImageWithGemini(imageUri);
      measure_value = geminiResult.measure_value; // Ajuste conforme a estrutura da resposta do Gemini
    } catch (error) {
      return res.status(500).json({
        error_code: 'GEMINI_PROCESSING_ERROR',
        error_description: 'Ocorreu um erro ao processar a imagem com o Google Gemini',
      });
    }

    // Cria um novo documento Picture
    const picture = new Picture({
      image: imageUri, // Armazena o URI da imagem
      customer_code,
      measure_datetime,
      measure_type,
      measure_uuid: generateUUID(),
      has_confirmed: false,
    });

    await picture.save();

    // Responde com sucesso
    res.status(200).json({
      image_url: imageUri, // URL da imagem retornada
      measure_value, // Valor da medição obtido do Gemini
      measure_uuid: picture.measure_uuid,
    });
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).code === 11000) {
        return res.status(409).json({
          error_code: 'DOUBLE_REPORT',
          error_description: 'Leitura do mês já realizada',
        });
      }

      return res.status(500).json({
        error_code: 'SERVER_ERROR',
        error_description: 'Ocorreu um erro ao processar a requisição',
      });
    }

    res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Ocorreu um erro inesperado',
    });
  }
};
