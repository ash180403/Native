export interface SubscriptionPlan {
  id: string;
  name: string;
  headerIcon: string;
  tag?: string;
  controllers: string;
  smsStorage: string;
  priceAmount: number;
  isInitialPlan: boolean;
  features: { id: string; text: string; isIncluded: boolean; }[];
}
