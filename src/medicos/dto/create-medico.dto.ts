
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateMedicoDto {
  @IsString()
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  name!: string;

  @IsEmail({}, { message: "El correo no tiene un formato válido" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "El teléfono es obligatorio" })
  phone!: string;

  @IsInt({ message: "La especialidad debe ser un número entero" })
  specialtyId!: number;
}
