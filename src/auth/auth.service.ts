import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from '../generated/prisma/client'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(name: string, email: string, password: string, role: Role) {
    const passwordHash = await bcrypt.hash(password, 10)

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new InternalServerErrorException(
        'No se ha configurado JWT_SECRET',
      )
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: '8h' },
    )

    return { token }
  }
}