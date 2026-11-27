import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'

import { CreatePacienteDto } from './dto/create-paciente.dto'
import { UpdatePacienteDto } from './dto/update-paciente.dto'
import { PacientesService } from './pacientes.service'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '../generated/prisma/client'

@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RECEPCIONISTA)
export class PacientesController {
  constructor(
    private readonly pacientesService: PacientesService,
  ) {}

  @Get()
  findAll() {
    return this.pacientesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacientesService.findOne(Number(id))

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado')
    }

    return paciente
  }

  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(Number(id), dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(Number(id))
  }
}