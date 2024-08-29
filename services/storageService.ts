import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const uploadToLocalStorage = (base64Data: string, mimeType: string): string => {
  // Remove o prefixo data:image/...;base64, se estiver presente
  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
  
  const buffer = Buffer.from(base64String, 'base64');
  const fileName = `${uuidv4()}.${mimeType.split('/')[1]}`;
  const filePath = path.join(__dirname, '..','uploads', fileName);
  
  // Salva o arquivo no sistema de arquivos
  fs.writeFileSync(filePath, buffer);
  
  // Retorna a URL acessível publicamente
  return `/uploads/${fileName}`;
};
