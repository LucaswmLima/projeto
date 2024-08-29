import { Request, Response } from "express";
import Picture from "../models/PictureModel";

export const list = async (req: Request, res: Response) => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    // Verificação do tipo de medição (opcional)
    if (measure_type && !["WATER", "GAS"].includes((measure_type as string).toUpperCase())) {
      return res.status(400).json({
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição não permitida",
      });
    }

    // Query para a busca
    const query: any = { customer_code };

    // Verifica se tem o parametro opcional WATER ou GAS pra adicionar na query
    if (measure_type) {
      query.measure_type = (measure_type as string).toUpperCase();
    }

    // Busca das medições no banco de dados
    const measures = await Picture.find(query).select("-_id measure_uuid measure_datetime measure_type has_confirmed image");

    // Verifica se encontrou medições
    if (!measures || measures.length === 0) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada",
      });
    }

    // Responde com a lista de medições
    return res.status(200).json({
      customer_code,
      measures: measures.map(measure => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image, // Pode adaptar se for necessário gerar um link de acesso à imagem
      }))
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
