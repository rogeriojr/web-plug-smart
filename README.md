# Admin Smart Plug

Admin Smart Plug é um painel administrativo desenvolvido em React com Vite, utilizando TypeScript e TailwindCSS para estilização. Ele oferece uma interface moderna e responsiva para gerenciar dispositivos smart plug.

## Espaço para Prints



## Tecnologias Utilizadas

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)
- [React Router Dom](https://reactrouter.com/)

## Instalação e Configuração

### 1. Clonar o repositório
```sh
git clone https://github.com/rogeriojr/admin-smart-plug.git
cd admin-smart-plug
```

### 2. Instalar dependências
```sh
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes configurações:

```env
VITE_API_BASE_URL=  # AJUSTAR DE ACORDO COM SUA API
VITE_API_TOKEN_AUTHORIZATION=""  # AJUSTAR DE ACORDO COM SUA API
```

> **Nota:** Certifique-se de configurar corretamente a `VITE_API_BASE_URL` e a `VITE_API_TOKEN_AUTHORIZATION` antes de iniciar o projeto.

### 4. Executar o projeto

#### Ambiente de Desenvolvimento
```sh
npm run dev
```

#### Build para Produção
```sh
npm run build
```

#### Visualizar Build
```sh
npm run preview
```

## Estrutura do Projeto

```
admin-smart-plug/
│── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Páginas principais
│   ├── routes/        # Configuração das rotas
│   ├── services/      # Consumo de APIs (AJUSTAR DE ACORDO COM SUA API)
│   ├── styles/        # Estilos globais
│   ├── utils/         # Funções auxiliares
│── public/            # Arquivos estáticos
│── .env               # Variáveis de ambiente
│── package.json       # Configuração do projeto
│── vite.config.ts     # Configuração do Vite
```

## Contribuição

Se deseja contribuir para o projeto, siga estas etapas:
1. Faça um fork do repositório
2. Crie uma nova branch: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'Minha nova feature'`
4. Envie suas alterações: `git push origin minha-feature`
5. Abra um Pull Request

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
