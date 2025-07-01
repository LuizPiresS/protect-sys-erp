# Protect-Sys-ERP

Sistema ERP multi-tenant para gestão de segurança e monitoramento, desenvolvido em NestJS, Prisma e AWS (emulado via LocalStack).

---

## 🚀 Visão Geral

O Protect-Sys-ERP é uma solução robusta para empresas de segurança, com arquitetura enxuta, modular e escalável. O sistema oferece gestão de usuários, perfis, planos, pagamentos, auditoria, permissões e integrações com serviços AWS (S3, SNS, Location, Secrets Manager) — tudo pronto para rodar em ambiente local com Docker e LocalStack.

---

## 🏗️ Arquitetura

- **Lean Architecture**: Simplicidade, eficiência, modularidade e eliminação de desperdício.
- **NestJS + TypeScript**: Framework principal, com injeção de dependências e modularização.
- **Prisma ORM**: Modelagem e acesso a dados em PostgreSQL.
- **Padrões**: Repository, Service, DTO, Use Case, Dependency Injection.
- **Multi-Tenant**: Isolamento de dados por tenant.
- **AWS Services (emulados)**: S3, SNS, Location, Secrets Manager via LocalStack.

---

## 📁 Estrutura do Projeto

```
src/
├── modules/         # Módulos de negócio (users, profiles, tenant, auth, etc)
├── shared/          # Recursos compartilhados (aws, hashing, config, errors, etc)
├── infrastructure/  # Integração com banco e serviços externos
├── core/            # Middlewares e lógica central
├── main.ts          # Bootstrap da aplicação
└── app.module.ts    # Módulo principal
```

---

## ⚙️ Como rodar localmente

### 1. Pré-requisitos

- [Docker](https://www.docker.com/)
- [Node.js 18+](https://nodejs.org/)
- [unzip](https://linux.die.net/man/1/unzip) (instalado automaticamente se necessário)

### 2. Configuração de variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```sh
cp env.example .env
```

**⚠️ Importante:** Para desenvolvimento local com Docker, a `DATABASE_URL` no arquivo `.env` deve usar `localhost:5432`, mas o Docker Compose já está configurado para usar `db:5432` automaticamente.

### 3. Instale o AWS CLI (se necessário)

```sh
./scripts/setup-aws-cli.sh
```

### 4. Suba o ambiente LocalStack e crie recursos AWS

```sh
./scripts/setup-localstack.sh
```

Esse script irá:
- Subir o LocalStack
- Criar buckets S3, tópicos SNS, Place Index (Location) e secrets necessários

### 5. Suba o restante dos serviços

```sh
docker-compose up -d
```

### 6. Gere o client do Prisma (se necessário)

```sh
npm run prisma:generate
```

### 7. Acesse a aplicação

- API: http://localhost:3000
- Swagger: http://localhost:3000/api

---

## 🧩 Principais Tecnologias

- **NestJS 11**
- **TypeScript 5**
- **Prisma 6**
- **PostgreSQL**
- **Redis**
- **LocalStack (AWS S3, SNS, Location, Secrets Manager)**
- **Jest (testes)**
- **ESLint + Prettier**

---

## 🛠️ Comandos Úteis

| Comando                        | Descrição                                 |
| ------------------------------ | ----------------------------------------- |
| `docker-compose up -d`         | Sobe todos os serviços                    |
| `docker-compose down`          | Para todos os serviços                    |
| `./scripts/setup-aws-cli.sh`   | Instala AWS CLI automaticamente           |
| `./scripts/setup-localstack.sh`| Inicializa LocalStack e recursos AWS      |
| `npm run start:dev`            | Inicia a API em modo desenvolvimento      |
| `npm run test`                 | Executa os testes                         |
| `npm run lint`                 | Executa o linter                          |
| `npm run prisma:generate`      | Gera o client do Prisma                   |
| `npm run prisma:migrate`       | Executa as migrations do banco            |

---

## 🌐 Variáveis de Ambiente

Veja o arquivo [`env.example`](./env.example) para todas as variáveis necessárias, incluindo:

- Configuração do banco de dados
- Chaves e endpoints AWS (LocalStack)
- Buckets S3, tópicos SNS, Place Index, secrets
- E-mail, JWT, Redis, Swagger, etc.

---

## 🏛️ Padrões e Arquitetura

- [Lean Architecture](docs/concepts/lean-architecture.md)
- [Repository Pattern](docs/concepts/repository-pattern.md)
- [Service Pattern](docs/concepts/service-pattern.md)
- [DTO Pattern](docs/concepts/dtos-pattern.md)
- [Single Responsibility Principle](docs/concepts/single-responsibility-principle.md)
- [Dependency Inversion Principle](docs/concepts/dependency-inversion-principle.md)

---

## 📝 Documentação

- **Swagger**: http://localhost:3000/api
- **Documentação de arquitetura**: veja a pasta [`docs/`](./docs/)

---

## 🧪 Testes

Execute todos os testes com:

```sh
npm run test
```

---

## 🐳 Observações sobre LocalStack

- Todos os recursos AWS (S3, SNS, Location, Secrets Manager) são criados automaticamente via scripts em `scripts/localstack/`.
- Para testar comandos AWS manualmente:
  ```sh
  aws --endpoint-url=http://localhost:4566 s3 ls
  aws --endpoint-url=http://localhost:4566 sns list-topics
  aws --endpoint-url=http://localhost:4566 location list-place-indexes
  aws --endpoint-url=http://localhost:4566 secretsmanager list-secrets
  ```

---

## 👨‍💻 Contribuição

1. Fork este repositório
2. Crie sua branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é **UNLICENSED**.

---

Se precisar de exemplos de uso dos serviços AWS, integração, ou dúvidas sobre arquitetura, consulte a documentação ou abra uma issue!




