# Fastify + Ollama API

API construída com **Fastify** e **Zod** com o objetivo de se conectar a um **modelo de IA executado via Ollama**, permitindo testes, estudos e integração com serviços de inteligência artificial.

---

## 🚀 Tecnologias utilizadas

* **Fastify** – framework web rápido e eficiente
* **Zod** – validação e tipagem de schemas
* **fastify-type-provider-zod** – integração nativa entre Fastify e Zod
* **Ollama** – execução e proxy de modelos de IA
* **Axios** – comunicação HTTP
* **Swagger UI** – documentação interativa
* **Scalar** – documentação moderna de API
* **TypeScript**

---

## 🎯 Objetivo do projeto

Este projeto serve como uma base para:

* Criar APIs Fastify bem tipadas
* Validar requests e responses com Zod
* Integrar a aplicação com um **modelo de IA via Ollama**
* Testar chamadas para LLMs de forma local ou via cloud

---

## 📦 Pré-requisitos

Antes de rodar a aplicação, é necessário:

* **Node.js** (versão recomendada: 18+)
* **npm** ou **yarn**
* **Ollama** instalado na máquina

### Instalar o Ollama

Acesse:
👉 [https://ollama.com](https://ollama.com)

E siga as instruções para o seu sistema operacional.

---

## 🤖 Configurando o Ollama

### 1️⃣ Baixar um modelo

Você pode utilizar qualquer modelo disponível no Ollama. Exemplo com modelo cloud:

```bash
ollama pull gpt-oss:120b-cloud
```

Ou utilize outro modelo de sua preferência.

---

### 2️⃣ Rodar o modelo

```bash
ollama run gpt-oss:120b-cloud
```

> ⚠️ Observação: modelos `*-cloud` exigem login no Ollama e são executados nos servidores da Ollama, mas continuam sendo acessados localmente pela API.

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

```env
OLLAMA_API_URL=https://api.ollama.com
OLLAMA_API_KEY=api_key_aqui
OLLAMA_MODEL=gpt-oss:120b-cloud

JWT_SECRET=super-secret-key
NODE_ENV=development
```

> 💡 Mesmo utilizando Ollama local, essas variáveis permitem flexibilidade para troca de ambiente e modelo.

---

## ▶️ Rodando a aplicação

Instale as dependências:

```bash
npm install
```

Inicie a aplicação em modo desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

```
http://localhost:3333
```

---

## 📚 Documentação da API

Você pode testar e explorar a API de duas formas:

### 🔹 Swagger UI

```
http://localhost:3333/swagger
```

Interface clássica para testes manuais dos endpoints.

---

### 🔹 Scalar Docs

```
http://localhost:3333/docs
```

Interface moderna e mais amigável para navegação e leitura da API.

---

## 🧪 Testando a integração com o Ollama

A aplicação possui uma rota de teste para validar a comunicação com o modelo de IA.

Exemplo:

```http
GET /test/ollama
```

Essa rota envia um prompt simples ao modelo configurado e retorna a resposta, confirmando que:

* O Ollama está rodando
* O modelo está acessível
* A API está corretamente integrada

---

## 🧩 Estrutura geral

* `src/server.ts` – bootstrap da aplicação
* `src/routes` – rotas da API
* `src/plugins` – plugins e handlers globais
* `src/test/ollama` – rota de teste de integração com IA
* `src/utils` – schemas e utilidades

---

## 👨‍💻 Autor

**Gabriel Suptitz**

---

## 📄 Licença

Este projeto está sob a licença ISC.

---

## ✅ Observações finais

* Para modelos locais, prefira opções menores (ex: `llama3`, `mistral`) para melhor performance
* Modelos cloud podem exigir **timeouts maiores**
* O projeto foi pensado para facilitar a troca de modelos apenas via variáveis de ambiente

Bom uso 🚀
