import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Função para fazer o upload da imagem localmente
export const uploadToLocalStorage = (base64Data: string, mimeType: string): string => {
  // Gera um nome de arquivo único
  const fileName = `${uuidv4()}.${mimeType.split('/')[1]}`;
  const filePath = path.join(__dirname, '..', 'uploads', 'images', fileName);
  
  // Cria o diretório se não existir
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  // Converte base64 para buffer e salva o arquivo
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);

  // Retorna o caminho acessível publicamente
  return `/uploads/images/${fileName}`;
};
