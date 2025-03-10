import { IsString, IsNotEmpty, IsEnum, IsObject } from 'class-validator';

enum NotificationType {
  MONTHLY_BUDGET = 'MONTHLY_BUDGET',
  TAG_BUDGET = 'TAG_BUDGET',
}

enum NotificationLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationLevel)
  level: NotificationLevel;

  @IsObject()
  data: {
    spentAmount: number;
    budgetAmount: number;
    spentPercentage: number;
    remainingAmount: number;
    tagName?: string;
  };
}
