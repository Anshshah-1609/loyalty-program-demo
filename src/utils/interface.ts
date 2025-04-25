export enum LoyaltyPointType {
  Earned = "earned",
  Redeemed = "redeemed",
}

export enum EarningRuleType {
  Redemption = "redemption",
}

export interface LoyaltyPoints {
  id: string;
  type: LoyaltyPointType;
  points: string;
  amount?: string;
  currency?: string;
  voucherCode?: string;
  additionalInfo?: string;
  createdAt: Date;
}
