import { Request, Response } from "express";
import Picture from "../models/PictureModel";

export const confirmMeasurement = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Validação dos dados recebidos
    if (typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Dados fornecidos no corpo da requisição são inválidos",
      });
    }

    // Verifica se a leitura existe
    const picture = await Picture.findOne({ measure_uuid });
    if (!picture) {
      return res.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura não encontrada",
      });
    }

    // Verifica se a leitura já foi confirmada
    if (picture.has_confirmed) {
      return res.status(409).json({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura já confirmada",
      });
    }

    // Atualiza o valor confirmado e marca a leitura como confirmada
    picture.measure_value = confirmed_value;
    picture.has_confirmed = true;

    // Salva as alterações no banco de dados
    await picture.save();

    // Responde com sucesso
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    // Tratamento de erros genéricos
    if (error instanceof Error) {
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
