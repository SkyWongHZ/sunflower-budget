import { IsString, IsNotEmpty, IsEnum, IsObject, IsOptional } from 'class-validator';

export enum NotificationType {
  MONTHLY_BUDGET = 'MONTHLY_BUDGET',
  TAG_BUDGET = 'TAG_BUDGET',
}

export enum NotificationLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateNotificationDto {
  @IsString()
  @IsOptional()
  userId?: string;

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
    year?: number;
    month?: number;
    isMidMonthReminder?: boolean;
  };
}
