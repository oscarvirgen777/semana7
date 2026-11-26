
import { PrismaService } from "../prisma/prisma.service";
import { CreatePacienteDto } from "./dto/create-paciente.dto";
import { UpdatePacienteDto } from "./dto/update-paciente.dto";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.patient.findMany();
  }

  findOne(id: number) {
    return this.prisma.patient.findUnique({
      where: { id },
    });
  }

create(data: CreatePacienteDto) {
  const fecha = new Date(data.dateOfBirth);

  if (fecha > new Date()) {
    throw new BadRequestException(
      "La fecha de nacimiento no puede ser futura",
    );
  }

  return this.prisma.patient.create({
    data: {
      ...data,
      dateOfBirth: fecha,
    },
  });
}

update(id: number, data: UpdatePacienteDto) {
  if (data.dateOfBirth) {
    const fecha = new Date(data.dateOfBirth);

    if (fecha > new Date()) {
      throw new BadRequestException(
        "La fecha de nacimiento no puede ser futura",
      );
    }
  }

  return this.prisma.patient.update({
    where: { id },
    data: {
      ...data,
      ...(data.dateOfBirth
        ? { dateOfBirth: new Date(data.dateOfBirth) }
        : {}),
    },
  });
}
  remove(id: number) {
    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
