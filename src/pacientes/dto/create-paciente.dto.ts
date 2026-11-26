
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePacienteDto {
  @IsString()
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  name!: string;

  @IsEmail({}, { message: "El correo no tiene un formato válido" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "El teléfono es obligatorio" })
  phone!: string;

  @IsDateString({}, { message: "La fecha de nacimiento no es válida" })
  dateOfBirth!: string;

  @IsOptional()
  @IsString()
  address?: string;
}
