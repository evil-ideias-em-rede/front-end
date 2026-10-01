# Front-End do Contraponto

Front-end do [Contraponto](https://evil-levi.01424210.xyz/), uma plataforma baseada em agentes de inteligência artificial para apoiar docentes na criação de materiais didáticos a partir de fontes primárias.

O projeto disponibiliza a interface web utilizada pelos docentes para interagir com a plataforma, consultar informações, fornecer referências e visualizar e editar os materiais didáticos gerados pelo sistema.

## Tecnologias

* **React** — construção da interface web
* **TypeScript** — tipagem estática
* **Vite** — ferramenta de desenvolvimento e build
* **Tailwind CSS** — estilização da interface
* **Chakra UI** — componentes de interface
* **Lucide React** — ícones

Todas as dependências do projeto estão disponíveis em `package.json`.

## Estrutura

A organização principal do projeto é:

```text
front-end/
├── public/              # Arquivos públicos da aplicação
├── src/                 # Código-fonte da aplicação
├── .firebase/           # Configurações relacionadas ao Firebase
├── .env.example         # Exemplo das variáveis de ambiente
├── Dockerfile
├── firebase.json
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Requisitos

Para executar o projeto localmente, são necessários:

* Node.js;
* npm;
* acesso ao back-end do Contraponto para utilizar as funcionalidades que dependem da API.

## Execução

Clone o repositório e entre no diretório:

```bash
git clone https://github.com/evil-ideias-em-rede/front-end.git
cd front-end
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Após iniciar a aplicação, o Vite disponibiliza o endereço local para acesso à interface.

A opção de desenvolvimento permite que alterações realizadas no código sejam refletidas automaticamente durante a execução.

## Build

Para gerar a versão de produção da aplicação:

```bash
npm run build
```

O processo de build executa a verificação de tipos e gera os arquivos da aplicação para produção.

Para visualizar a versão de produção localmente, utilize:

```bash
npm run preview
```

## Interface

A interface web disponibiliza os recursos necessários para a interação do docente com o Contraponto.

Entre as principais funcionalidades estão:

* interação com os agentes de inteligência artificial;
* seleção e consulta de debates;
* visualização das informações recuperadas;
* criação e gerenciamento de materiais;
* utilização de templates;
* visualização e edição dos materiais em HTML;
* exportação dos materiais para diferentes formatos.

A interface se comunica com o back-end por meio da API disponibilizada pelo projeto.

## Integração com o back-end

O front-end utiliza a API do repositório `back-end` para realizar as operações que dependem dos serviços do sistema.

A documentação das rotas, métodos HTTP, parâmetros e estruturas das requisições e respostas está disponível no repositório do back-end:

https://github.com/evil-ideias-em-rede/back-end/blob/sandbox/API_FRONTEND.md

O endereço utilizado para a API deve ser configurado de acordo com o ambiente de execução.

## Exportação de materiais

A aplicação disponibiliza recursos para exportação dos materiais produzidos durante a interação com a plataforma.

Entre os formatos suportados pelo front-end estão:

* **PDF**;
* **DOCX**;
* **PPTX**.

A geração dos arquivos é realizada pelo próprio front-end utilizando as bibliotecas correspondentes disponíveis nas dependências do projeto.

## Firebase

O projeto possui configuração para utilização do Firebase, incluindo os arquivos de configuração presentes no repositório.

As configurações necessárias para cada ambiente devem ser definidas conforme as variáveis e arquivos de configuração disponibilizados pelo projeto.

## Scripts

Os principais scripts disponíveis em `package.json` são:

| Comando           | Descrição                                    |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento         |
| `npm run build`   | Verifica os tipos e gera o build de produção |
| `npm run lint`    | Executa a verificação de lint                |
| `npm run preview` | Executa localmente o build de produção       |

## Reprodução do ambiente

Para reproduzir o ambiente utilizado no desenvolvimento do projeto:

1. Clone o repositório.
2. Configure as variáveis de ambiente a partir de `.env.example`.
3. Instale as dependências com `npm install`.
4. Configure o endereço do back-end.
5. Inicie a aplicação com `npm run dev`.

Para utilizar as funcionalidades que dependem da API, o back-end do Contraponto também deve estar em execução.

O objetivo deste repositório é disponibilizar o código e a configuração necessários para executar a interface web do protótipo do Contraponto.

## Arquitetura

O diagrama mostra a comunicação entre frontend, API, agente, ferramentas,
fontes de dados e sandbox de execução.

![Arquitetura frontend/backend do Contraponto](docs/arquitetura-front-back.svg)

### Agente LangGraph

Grafo exportado diretamente com `GRAPH_BUILDER.get_graph().draw_mermaid()`.
As setas condicionais mostram os destinos declarados; durante a execução,
o roteamento escolhe o caminho conforme o estado da conversa.

![Grafo do agente Contraponto gerado pelo LangGraph](docs/agente-langgraph-gerado.svg)

As figuras são cópias dos SVGs de `back-end/docs`. Consulte a
[documentação da arquitetura no backend](https://github.com/evil-ideias-em-rede/back-end/blob/microsandbox/docs/arquitetura-contraponto.md)
para os endpoints, os dados enviados e as ferramentas disponíveis em cada modo.
