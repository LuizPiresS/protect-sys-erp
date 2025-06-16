
## Módulo de autenticação 
### Arvore de diretórios
```text
src/modules/auth/
├── application/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── refresh-token.dto.ts
│   ├── mappers/
│   │   └── user.mapper.ts
│   ├── use-cases/
│   │   ├── login.use-case.ts
│   │   ├── register.use-case.ts
│   │   ├── refresh-token.use-case.ts
│   │   └── logout.use-case.ts
│   └── services/
│       ├── token.service.ts
│       └── auth.service.ts
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   └── session.entity.ts
│   ├── repositories/
│   │   ├── user.repository.interface.ts
│   │   └── session.repository.interface.ts
│   ├── services/
│   │   └── hashing.service.interface.ts
│   └── value-objects/
│       ├── email.vo.ts
│       └── password.vo.ts
├── infrastructure/
│   ├── http/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── session.controller.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── strategies/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   ├── database/
│   │   ├── repositories/
│   │   │   ├── user.prisma.repository.ts
│   │   │   └── session.prisma.repository.ts
│   │   └── migrations/
│   └── providers/
│       ├── bcrypt.service.ts
│       └── jwt.service.ts
└── auth.module.ts
```