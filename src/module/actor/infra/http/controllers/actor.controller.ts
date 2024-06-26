import { CreateActorUseCase } from 'src/module/actor/use-cases/create-actor';
import { DeleteActorUseCase } from 'src/module/actor/use-cases/delete-actor';
import { ShowActorUseCase } from 'src/module/actor/use-cases/show-actor';
import { UpdateActorUseCase } from 'src/module/actor/use-cases/update-actor';
import { CurrentUser } from 'src/module/auth/current-user-decorator';
import { UserPayload } from 'src/module/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation.-pipe';
import { z } from 'zod';

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

const updateActorBody = z.object({
  name: z.string(),
  actor_id: z.string().uuid(),
});

const createActorBody = z.object({
  name: z.string(),
});

type UpdateActorBody = z.infer<typeof updateActorBody>;
type CreateActorBody = z.infer<typeof createActorBody>;

@Controller('actor')
@ApiTags('Actor')
@UseGuards(AuthGuard('jwt'))
export class ActorController {
  constructor(
    private readonly createActorUseCase: CreateActorUseCase,
    private readonly showActorUseCase: ShowActorUseCase,
    private readonly deleteActorUseCase: DeleteActorUseCase,
    private readonly updateActorUseCase: UpdateActorUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'O Actor foi criado com sucesso.' })
  @UsePipes(new ZodValidationPipe(createActorBody))
  create(@Body() createActorDto: CreateActorBody) {
    return this.createActorUseCase.execute(createActorDto);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    console.log(user);
    return this.showActorUseCase.execute();
  }
  @Put()
  @UsePipes(new ZodValidationPipe(updateActorBody))
  update(@Body() updateActorBody: UpdateActorBody) {
    return this.updateActorUseCase.execute(updateActorBody);
  }
  @Delete(':actor_id')
  delete(@Param('actor_id') actor_id: string) {
    return this.deleteActorUseCase.execute(actor_id);
  }
}
