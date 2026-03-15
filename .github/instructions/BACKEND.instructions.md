---
applyTo: 'packages/backend/**'
description: 'Backend development guidelines for NestJS API'
---

# Backend Development Instructions

## Technology Stack

- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL with TypeORM 0.3.x
- **Authentication:** JWT with Passport
- **Validation:** class-validator + class-transformer
- **Testing:** Jest

## Project Structure

```
packages/backend/src/
├── auth/           # Authentication module (JWT, guards, strategies)
├── categories/     # Categories module (CRUD operations)
├── payment-methods/# Payment methods module (CRUD operations)
├── transactions/   # Transactions module (CRUD, filters)
├── user-preferences/# User preferences module
├── db/             # Database configuration, migrations, seeders
├── migrations/     # TypeORM migrations
└── main.ts         # Application entry point
```

## Code Conventions

### Module Organization

Each feature module should follow this structure:
```
feature/
├── feature.module.ts       # Module definition
├── feature.controller.ts   # HTTP endpoints
├── feature.service.ts      # Business logic
├── feature.repository.ts   # Data access
├── entities/
│   └── feature.entity.ts   # TypeORM entity
├── dto/
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── find-feature.dto.ts
└── __tests__/
    ├── feature.controller.spec.ts
    ├── feature.service.spec.ts
    └── feature.repository.spec.ts
```

### Controllers

- Use proper HTTP methods (GET, POST, PATCH, DELETE)
- Use DTOs for validation
- Return BaseResponse or BaseListResponse
- Handle errors with proper HTTP status codes
- Add Swagger decorators (@ApiOperation, @ApiResponse)

```typescript
@Controller('api/me/resource')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({ status: 200, type: ResourceListResponse })
  async findAll(@Req() req: AuthRequest): Promise<BaseListResponse<Resource>> {
    const resources = await this.service.findAll(req.user.id);
    return new BaseListResponse(resources);
  }

  @Post()
  @ApiOperation({ summary: 'Create resource' })
  @ApiResponse({ status: 201, type: ResourceResponse })
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateResourceDto,
  ): Promise<BaseResponse<Resource>> {
    const resource = await this.service.create(req.user.id, dto);
    return new BaseResponse(resource, 'Resource created successfully');
  }
}
```

### Services

- Contain business logic
- Throw appropriate exceptions (NotFoundException, ConflictException, etc.)
- Use repositories for data access
- Should be easily testable

```typescript
@Injectable()
export class ResourceService {
  constructor(private readonly repository: ResourceRepository) {}

  async create(userId: string, dto: CreateResourceDto): Promise<Resource> {
    // Business logic here
    return this.repository.create(userId, dto);
  }

  async delete(userId: string, id: string): Promise<void> {
    const resource = await this.repository.findById(userId, id);
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    
    // Check for conflicts
    const isInUse = await this.repository.isInUse(id);
    if (isInUse) {
      throw new ConflictException('Resource is in use');
    }

    await this.repository.delete(id);
  }
}
```

### Repositories

- Handle data access only
- Use TypeORM QueryBuilder for complex queries
- Return domain entities, not raw data

```typescript
@Injectable()
export class ResourceRepository {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly repository: Repository<ResourceEntity>,
  ) {}

  async findById(userId: string, id: string): Promise<Resource | null> {
    const entity = await this.repository.findOne({
      where: { id, userId },
    });
    return entity ? this.mapToModel(entity) : null;
  }

  private mapToModel(entity: ResourceEntity): Resource {
    return new Resource({
      id: entity.id,
      name: entity.name,
      // ... map all properties
    });
  }
}
```

### DTOs

- Use class-validator decorators
- Include Swagger decorators
- Keep them simple and focused

```typescript
export class CreateResourceDto {
  @ApiProperty({ description: 'Resource name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Resource type', enum: ResourceType })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({ description: 'Optional description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
```

### Entities

- Use TypeORM decorators
- Define proper relationships
- Include timestamps

```typescript
@Entity('resources')
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ResourceType })
  type: ResourceType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
```

## Database Migrations

### Creating Migrations

```bash
# Generate migration from entity changes
npm run migration:generate

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Migration Best Practices

- Always test migrations in development first
- Include both `up` and `down` methods
- Make migrations idempotent when possible
- Never modify existing migrations that ran in production

## Error Handling

Use NestJS built-in exceptions:

```typescript
import { 
  NotFoundException, 
  ConflictException, 
  BadRequestException,
  UnauthorizedException 
} from '@nestjs/common';

// Resource not found
throw new NotFoundException('Resource not found');

// Resource in use / conflict
throw new ConflictException('Resource is in use');

// Invalid input
throw new BadRequestException('Invalid input data');

// Authentication failed
throw new UnauthorizedException('Invalid credentials');
```

## Authentication

- All endpoints except `/auth/*` require JWT authentication
- Use `@UseGuards(JwtAuthGuard)` decorator
- Access user info via `@Req() req: AuthRequest`
- User ID is in `req.user.id`

## Testing

### Unit Tests

- Test each service method
- Mock dependencies (repositories, external services)
- Test success and error cases
- Aim for > 95% coverage

```typescript
describe('ResourceService', () => {
  let service: ResourceService;
  let repository: jest.Mocked<ResourceRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new ResourceService(repository);
  });

  describe('delete', () => {
    it('should delete resource', async () => {
      const resource = new Resource({ id: '1', name: 'Test' });
      repository.findById.mockResolvedValue(resource);
      repository.isInUse.mockResolvedValue(false);

      await service.delete('user-id', '1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('user-id', '1'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
```

## Common Patterns

### Filtering / Query Parameters

```typescript
export class FindResourcesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;
}
```

### Pagination (if needed in future)

```typescript
export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
```

## Configuration

- Use environment variables for configuration
- Define in `.env` file (never commit!)
- Access via `ConfigService`

```typescript
@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {
    const dbHost = this.configService.get<string>('DB_HOST');
  }
}
```

## Swagger Documentation

- Access at: `http://localhost:3000/api/docs`
- All endpoints should have proper decorators
- Document request/response types
- Document error responses

## Checklist for New Endpoints

- [ ] Controller endpoint created with proper HTTP method
- [ ] DTO created with validation decorators
- [ ] Service method implemented with business logic
- [ ] Repository method for data access
- [ ] Error handling (NotFoundException, ConflictException, etc.)
- [ ] Swagger decorators added
- [ ] Unit tests for service (> 95% coverage)
- [ ] Integration tests for controller
- [ ] Manual testing with Postman/Swagger UI
- [ ] TypeScript compiles without errors (`npm run typecheck`)

