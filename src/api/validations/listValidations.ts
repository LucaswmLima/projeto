export const validateMeasureType = (measure_type: any) => {
    if (measure_type && !["WATER", "GAS"].includes((measure_type as string).toUpperCase())) {
      return {
        valid: false,
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição não permitida",
      };
    }
    return { valid: true };
  };
  
  export const validateCustomerCode = (customer_code: String) => {
    if (typeof customer_code !== "string" || customer_code.trim() === "") {
      return {
        valid: false,
        error_code: "INVALID_CUSTOMER_CODE",
        error_description: "O campo 'customer_code' é obrigatório e deve ser uma string não vazia",
      };
    }
    return { valid: true };
  };
  