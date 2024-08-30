import { IValidationResult } from "../interfaces/validationResult";
import { getStartOfMonth, getEndOfMonth } from "../utils/helpers";
import Measure from "../models/MeasureModel";

// Validador dos campos
export const validateRequiredFields = (
  image: string,
  customer_code: string,
  measure_datetime: string,
  measure_type: string
): IValidationResult => {
  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return {
      valid: false,
      error_code: "INVALID_DATA",
      error_description: "Todos os campos são obrigatórios",
    };
  }
  return { valid: true };
};

// validador da imagem
export const validateBase64Image = (image: string): IValidationResult => {
  if (!/^data:image\/\w+;base64,/.test(image)) {
    return {
      valid: false,
      error_code: "INVALID_DATA",
      error_description: "Formato da imagem base64 inválido",
    };
  }
  return { valid: true };
};

// Validador do tipo de medição
export const validateMeasureType = (
  measure_type: string
): IValidationResult => {
  measure_type = measure_type.toUpperCase();
  if (measure_type !== "WATER" && measure_type !== "GAS") {
    return {
      valid: false,
      error_code: "INVALID_DATA",
      error_description: "O tipo de medição deve ser 'WATER' ou 'GAS'",
    };
  }
  return { valid: true };
};

// Validador da data
export const validateDateFormat = (
  measure_datetime: string
): IValidationResult => {
  const date = new Date(measure_datetime);
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      error_code: "INVALID_DATA",
      error_description: "Formato de data/hora inválido",
    };
  }
  return { valid: true };
};

//Validador de medições duplicada no mesmo mes
export const validateDuplicateReading = async (
  customer_code: string,
  measure_type: string,
  measure_datetime: Date
): Promise<IValidationResult> => {
  const startOfMonth = getStartOfMonth(measure_datetime);
  const endOfMonth = getEndOfMonth(measure_datetime);

  const existingMeasure = await Measure.findOne({
    customer_code,
    measure_type,
    measure_datetime: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  });

  if (existingMeasure) {
    return {
      valid: false,
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada",
    };
  }

  return { valid: true };
};
