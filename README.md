# API para Medições de Medidores

Esta API é uma solução desenvolvida com Node.js e Express para processar imagens de medidores, validar e armazenar medições localmente no servidor. Utiliza o Google Gemini para a leitura das imagens e está configurada para rodar em um ambiente Docker.

## Sobre

A API permite o upload de imagens de medidores em formato base64, realiza a leitura das medições com o Google Gemini, e armazena as imagens e dados no servidor. Ela valida os dados recebidos para evitar leituras duplicadas e permite a gestão de medições via endpoints RESTful.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express**: Framework para construção da API.
- **Google Gemini**: API para leitura de medições em imagens.
- **Docker**: Contêiner para facilitar o ambiente de desenvolvimento e deployment.

## Estrutura do Projeto

- **`src/`**: Código-fonte da aplicação
  - **`controllers/`**: Controladores que lidam com as requisições e respostas
    - `addController.ts`: Controlador para adicionar medições
    - `listController.ts`: Controlador para listar medições
    - `confirmController.ts`: Controlador para confirmar medições
  - **`services/`**: Serviços para processar imagens e interagir com APIs externas
    - `imageService.ts`: Serviço para processamento de imagens e comunicação com o Google Gemini
  - **`validations/`**: Funções de validação
    - `addValidations.ts`: Validações para as requisições de adição de medições
  - **`helpers/`**: Funções auxiliares e helpers
    - `dateHelper.ts`: Funções para encontrar limites de datas
    - `uuidHelper.ts`: Funções para gerar UUIDs
  - **`interfaces/`**: Interfaces TypeScript para tipagem
    - `ValidationResult.ts`: Interface para o resultado da validação
  - **`middlewares/`**: Middlewares para a aplicação
  - **`config/`**: Configurações e constantes da aplicação

## Funcionalidades

- **Upload e Processamento de Imagens**: Recebe imagens em base64, utiliza o Google Gemini para identificar medições e armazena as imagens localmente no servidor.
- **Validação de Dados**: Verifica dados recebidos e evita leituras duplicadas.
- **Endpoints**:
  - `POST /measurements`: Adiciona uma nova medição.
  - `GET /measurements`: Lista medições.
  - `PATCH /measurements/confirm`: Confirma uma medição.

## Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd SEU_REPOSITORIO
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias. Inclua a chave da API do Google Gemini e outras configurações, como no exemplo abaixo:
   ```
   GEMINI_API_KEY=suachaveapi
   PORT=3000
   DB_URI=mongodb://localhost:27017/mydatabase
   ```

   - **`GEMINI_API_KEY`**: Sua chave da API do Google Gemini.
   - **`PORT`**: Porta na qual o servidor irá rodar. O padrão é 3000 se não especificado.
   - **`DB_URI`**: URI de conexão com o banco de dados MongoDB. O Docker Compose já configura a conexão com o banco de dados, mas você pode adicionar ou modificar a URI e a porta no `.env` conforme necessário.

## Uso

1. **Rodar Localmente**: Inicie o servidor com:
   ```bash
   npm start
   ```

2. **Rodar com Docker**: O projeto já está configurado para ser executado em um ambiente Docker. Para construir e iniciar o container, use:
   ```bash
   docker-compose up --build
   ```

## Testes

O projeto inclui testes para garantir a funcionalidade da API. Para rodar os testes, utilize o seguinte comando:

```bash
npm test
```

Os testes verificam a validade dos dados recebidos e a funcionalidade dos endpoints da API.

## Contribuindo

Se você deseja contribuir com o projeto, siga estas etapas:

1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b minha-mudanca`).
3. Faça suas mudanças e commit (`git commit -am 'Adiciona nova funcionalidade'`).
4. Envie a branch para o repositório (`git push origin minha-mudanca`).
5. Crie um Pull Request no GitHub.

## Contato

Se você tiver alguma dúvida, entre em contato com [Lucas William](mailto:lucaswilliamml@gmail.com).
