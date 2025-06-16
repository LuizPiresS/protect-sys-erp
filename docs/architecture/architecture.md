```text
sas-erp-seguranca/
├── src/
│   ├── core/                       # Camada de Domínio (Independente de frameworks)
│   │   ├── entities/               # Entidades de negócio
│   │   ├── use-cases/              # Casos de uso (regras de negócio)
│   │   ├── repositories/           # Interfaces de repositório
│   │   ├── value-objects/          # Objetos de valor
│   │   ├── exceptions/             # Exceções de domínio
│   │   └── services/               # Serviços de domínio
│   │
│   ├── application/                # Camada de Aplicação (Coordena fluxo de trabalho)
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── mappers/                # Mapeadores entre camadas
│   │   ├── ports/                  # Portas de entrada/saída
│   │   └── services/               # Serviços de aplicação
│   │
│   ├── infrastructure/             # Camada de Infraestrutura (Implementações concretas)
│   │   ├── database/               # Implementações de banco de dados
│   │   │   ├── prisma/             # Prisma ORM
│   │   │   └── migrations/         # Migrações de banco
│   │   ├── http/                   # Controllers e rotas
│   │   ├── cache/                  # Implementação de cache (Redis)
│   │   ├── messaging/              # Mensageria (Kafka/RabbitMQ)
│   │   ├── providers/              # Provedores externos (Email, SMS, etc)
│   │   └── adapters/               # Adaptadores para serviços externos
│   │
│   ├── modules/                    # Módulos de negócio
│   │   ├── auth/                   # Módulo de autenticação
│   │   │   ├── domain/             # Domínio específico
│   │   │   ├── application/        # Aplicação específica
│   │   │   └── infrastructure/     # Infraestrutura específica
│   │   ├── tenants/                # Módulo de multi-tenancy
│   │   ├── users/                  # Módulo de usuários
│   │   ├── notifications/          # Módulo de notificações
│   │   ├── incidents/              # Módulo de incidentes
│   │   ├── locations/              # Módulo de localizações
│   │   ├── equipment/              # Módulo de equipamentos
│   │   ├── patrols/                # Módulo de rondas
│   │   ├── monitoring/             # Módulo de monitoramento
│   │   ├── clients/                # Módulo de clientes
│   │   ├── billing/                # Módulo de faturamento
│   │   ├── reports/                # Módulo de relatórios
│   │   └── integrations/           # Módulo de integrações
│   │
│   ├── shared/                     # Utilitários compartilhados
│   │   ├── decorators/             # Decorators personalizados
│   │   ├── filters/                # Filtros de exceção
│   │   ├── interceptors/           # Interceptores
│   │   ├── pipes/                  # Pipes de validação
│   │   └── utils/                  # Funções utilitárias
│   │
│   ├── app.module.ts               # Módulo raiz
│   └── main.ts                     # Ponto de entrada
│
├── test/                           # Testes automatizados
│   ├── unit/                       # Testes unitários
│   │   ├── core/                   # Testes do domínio
│   │   └── application/            # Testes da camada de aplicação
│   └── integration/                # Testes de integração
│       ├── http/                   # Testes de controllers
│       └── database/               # Testes de banco de dados
│
├── prisma/                         # Configuração do Prisma
│   ├── migrations/                 # Migrações de banco
│   └── schema.prisma               # Schema do banco
│
├── docker/                         # Configurações Docker
│   ├── compose/                    # Docker Compose files
│   └── scripts/                    # Scripts auxiliares
│
├── docs/                           # Documentação
│   ├── api/                        # Documentação da API
│   ├── architecture/               # Diagramas de arquitetura
│   └── decisions/                  # ADRs (Architectural Decision Records)
│
├── .env                            # Variáveis de ambiente
├── .env.example                    # Exemplo de variáveis
├── nest-cli.json                   # Configuração do NestJS
├── package.json                    # Dependências
└── tsconfig.json                   # Configuração do TypeScript
```

```text
+---------------+
|   Interface   |
|    de Usuário |
+---------------+
|
V
+---------------+
|   Controllers |   (Infrastructure)
+---------------+
|
V
+---------------+
|    Use Cases  |   (Application)
+---------------+
|
V
+---------------+
|  Repositórios |   (Domain Interface)
+---------------+
|
V
+---------------+
| Implementação |   (Infrastructure)
|  Repositório  |
+---------------+
|
V
+---------------+
|     Banco     |
|    de Dados   |
+---------------+

```