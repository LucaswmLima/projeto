import { IValidationResult } from "../interfaces/validationResult";
import Picture from "../models/MeasureModel";

// Valida os dados recebidos para a confirmação
export const validateConfirmData = (
  measure_uuid: any,
  confirmed_value: any
): IValidationResult => {
  if (typeof measure_uuid !== "string" || typeof confirmed_value !== "number") {
    return {
      valid: false,
      error_code: "INVALID_DATA",
      error_description: "Dados fornecidos no corpo da requisição são inválidos",
    };
  }
  return { valid: true };
};

// Verifica se a leitura existe
export const validateMeasureExists = async (
  measure_uuid: string
): Promise<IValidationResult> => {
  const measure = await Picture.findOne({ measure_uuid });

  if (!measure) {
    return {
      valid: false,
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Leitura não encontrada",
    };
  }
  return { valid: true, measure };
};

// Verifica se a leitura já foi confirmada
export const validateDuplicateConfirmation = (
  measure: any
): IValidationResult => {
  if (measure.has_confirmed) {
    return {
      valid: false,
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura já confirmada",
    };
  }
  return { valid: true };
};
