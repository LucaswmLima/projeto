import { Request, Response } from "express";
import Picture from "../models/PictureModel";

export const confirm = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Validação dos dados recebidos
    if (
      typeof measure_uuid !== "string" ||
      typeof confirmed_value !== "number"
    ) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description:
          "Dados fornecidos no corpo da requisição são inválidos",
      });
    }

    // Armazena a busca na variavel measure para validações
    const measure = await Picture.findOne({ measure_uuid });

    // Verifica se a leitura existe
    if (!measure) {
      return res.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês já realizada", //Leitura não encontrada
      });
    }

    // Verifica se a leitura já foi confirmada
    if (measure.has_confirmed) {
      return res.status(409).json({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada", //Leitura já realizada
      });
    }

    // Atualiza o valor confirmado e marca a leitura como confirmada
    measure.measure_value = confirmed_value;
    measure.has_confirmed = true;

    // Salva as alterações no banco de dados
    await measure.save();

    // Responde com sucesso
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a requisição",
    });
  }
};
