import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { Reflector } from '@nestjs/core'
import { Role } from '../../generated/prisma/client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    )

    // Si no se especificaron roles, permite el acceso
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const user = request.user as { role?: Role } | undefined

    // Verifica si el usuario tiene alguno de los roles permitidos
    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este recurso',
      )
    }

    return true
  }
}