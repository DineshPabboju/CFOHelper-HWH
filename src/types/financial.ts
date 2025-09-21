export interface FinancialData {
  revenue: number;
  expenses: number;
  cashBalance: number;
  monthlyBurn: number;
  employees: number;
  marketingSpend: number;
  productPrice: number;
  timestamp: string;
}

export interface ScenarioResult {
  current: {
    revenue: number;
    expenses: number;
    runway: number;
    employees: number;
    marketingSpend: number;
    productPrice: number;
  };
  adjusted: {
    revenue: number;
    expenses: number;
    runway: number;
    employees: number;
    marketingSpend: number;
    productPrice: number;
  };
  changes: {
    hiring: number;
    marketingSpend: number;
    priceChange: number;
  };
}

export interface UsageData {
  scenariosTested: number;
  reportsExported: number;
  timestamp: string;
}