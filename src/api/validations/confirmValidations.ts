import { IMeasure } from "../interfaces/measure";

export const validateRequestData = (
    measure_uuid: any,
    confirmed_value: any
  ) => {
    // Mensagens de erro específicas
    let error_description = "";
  
    // Verifica se measure_uuid é uma string e se não é uma string vazia
    if (typeof measure_uuid !== "string") {
      error_description += "O campo 'measure_uuid' deve ser uma string. ";
    } else if (measure_uuid.trim() === "") {
      error_description += "O campo 'measure_uuid' não pode estar vazio. ";
    }
  
    // Verifica se confirmed_value é um número
    if (typeof confirmed_value !== "number") {
      error_description += "O campo 'confirmed_value' deve ser um número. ";
    }
  
    // Verifica se measure_uuid está presente (caso seja uma string vazia)
    if (!measure_uuid) {
      error_description += "O campo 'measure_uuid' é obrigatório. ";
    }
  
    // Verifica se confirmed_value está presente
    if (!confirmed_value) {
      error_description += "O campo 'confirmed_value' é obrigatório. ";
    }
  
    if (error_description) {
      return {
        valid: false,
        error_code: "INVALID_DATA",
        error_description: `Dados fornecidos no corpo da requisição são inválidos: ${error_description.trim()}`,
      };
    }
  
    return { valid: true };
  };
  
  
export const checkConfirmationStatus = (measure: IMeasure) => {
  if (measure.has_confirmed) {
    return {
      valid: false,
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura já confirmada",
    };
  }
  return { valid: true };
};
