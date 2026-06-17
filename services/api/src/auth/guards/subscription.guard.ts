import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

/**
 * Guard to check if user has an active subscription
 * IMPORTANT: Admins automatically bypass this check
 */
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('Authentication required');
    }

    // ADMIN users don't need a subscription
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Check for active subscription
    const activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: user.userId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
    });

    if (!activeSubscription) {
      throw new ForbiddenException(
        'Active subscription required. Please subscribe to access premium content.',
      );
    }

    return true;
  }
}
