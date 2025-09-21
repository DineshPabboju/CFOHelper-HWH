const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server/logs/app.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Mock financial data
let mockFinancialData = {
  revenue: 100000,
  expenses: 70000,
  cashBalance: 300000,
  monthlyBurn: 70000,
  employees: 10,
  marketingSpend: 15000,
  productPrice: 1000,
  timestamp: new Date().toISOString()
};

// Usage tracking
let usageData = {
  scenariosTested: 0,
  reportsExported: 0,
  timestamp: new Date().toISOString()
};

// Save usage data to file
const saveUsageData = () => {
  try {
    if (!fs.existsSync('server/data')) {
      fs.mkdirSync('server/data', { recursive: true });
    }
    fs.writeFileSync('server/data/usage.json', JSON.stringify(usageData, null, 2));
  } catch (error) {
    logger.error('Error saving usage data:', error);
  }
};

// Load usage data from file
const loadUsageData = () => {
  try {
    if (fs.existsSync('server/data/usage.json')) {
      const data = fs.readFileSync('server/data/usage.json', 'utf8');
      usageData = JSON.parse(data);
    }
  } catch (error) {
    logger.error('Error loading usage data:', error);
  }
};

// Initialize Gemini (you'll need to set GEMINI_API_KEY environment variable)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key-here');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Routes
app.get('/api/financial-data', (req, res) => {
  try {
    logger.info('Fetching financial data');
    res.json({
      success: true,
      data: mockFinancialData
    });
  } catch (error) {
    logger.error('Error fetching financial data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch financial data' });
  }
});

app.post('/api/calculate-scenario', (req, res) => {
  try {
    const { hiring, marketingSpend, priceChange } = req.body;
    
    // Calculate adjusted values
    const adjustedEmployees = mockFinancialData.employees + hiring;
    const adjustedMarketingSpend = marketingSpend;
    const adjustedPrice = mockFinancialData.productPrice * (1 + priceChange / 100);
    
    // Calculate financial impact
    const salaryPerEmployee = 5000; // Average monthly salary
    const additionalSalaryCost = hiring * salaryPerEmployee;
    const marketingDelta = adjustedMarketingSpend - mockFinancialData.marketingSpend;
    
    const adjustedExpenses = mockFinancialData.expenses + additionalSalaryCost + marketingDelta;
    const revenueMultiplier = (adjustedPrice / mockFinancialData.productPrice);
    const adjustedRevenue = mockFinancialData.revenue * revenueMultiplier;
    
    const currentRunway = mockFinancialData.cashBalance / mockFinancialData.monthlyBurn;
    const adjustedRunway = mockFinancialData.cashBalance / Math.max(adjustedExpenses, 1000);
    
    // Increment usage counter
    usageData.scenariosTested += 1;
    saveUsageData();
    
    const result = {
      current: {
        revenue: mockFinancialData.revenue,
        expenses: mockFinancialData.expenses,
        runway: Math.round(currentRunway * 10) / 10,
        employees: mockFinancialData.employees,
        marketingSpend: mockFinancialData.marketingSpend,
        productPrice: mockFinancialData.productPrice
      },
      adjusted: {
        revenue: Math.round(adjustedRevenue),
        expenses: Math.round(adjustedExpenses),
        runway: Math.round(adjustedRunway * 10) / 10,
        employees: adjustedEmployees,
        marketingSpend: adjustedMarketingSpend,
        productPrice: Math.round(adjustedPrice)
      },
      changes: {
        hiring,
        marketingSpend: marketingDelta,
        priceChange
      }
    };
    
    logger.info('Scenario calculated', { scenario: result });
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error calculating scenario:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate scenario' });
  }
});

app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { question, scenarioData } = req.body;
    
    const prompt = `You are an expert CFO financial advisor. Based on the following financial scenario data, please answer the user's question with clear, actionable insights.

Current Financial Data:
- Revenue: ₹${scenarioData?.current?.revenue || mockFinancialData.revenue}
- Expenses: ₹${scenarioData?.current?.expenses || mockFinancialData.expenses}
- Cash Runway: ${scenarioData?.current?.runway || 'N/A'} months
- Employees: ${scenarioData?.current?.employees || mockFinancialData.employees}

User Question: ${question}

Please provide a concise, professional response with specific recommendations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    logger.info('AI response generated', { question, response: aiResponse.substring(0, 100) });
    res.json({ success: true, data: { response: aiResponse } });
  } catch (error) {
    logger.error('Error calling Gemini AI assistant:', error);
    // Fallback response for demo purposes
    const fallbackResponse = "I'm currently unable to access the Gemini AI service. However, based on typical financial scenarios, I'd recommend focusing on cash flow optimization and monitoring your burn rate closely.";
    res.json({ success: true, data: { response: fallbackResponse } });
  }
});

app.post('/api/export-report', (req, res) => {
  try {
    const { scenarioData, aiSummary } = req.body;
    
    // Increment usage counter
    usageData.reportsExported += 1;
    saveUsageData();
    
    // In a real app, you'd generate a PDF here
    // For this MVP, we'll return the data to be processed on the frontend
    const reportData = {
      timestamp: new Date().toISOString(),
      scenarioData,
      aiSummary,
      exportId: `CFO-${Date.now()}`
    };
    
    logger.info('Report exported', { exportId: reportData.exportId });
    res.json({ success: true, data: reportData });
  } catch (error) {
    logger.error('Error exporting report:', error);
    res.status(500).json({ success: false, error: 'Failed to export report' });
  }
});

app.get('/api/usage', (req, res) => {
  try {
    res.json({ success: true, data: usageData });
  } catch (error) {
    logger.error('Error fetching usage data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch usage data' });
  }
});

// Create necessary directories
const createDirectories = () => {
  const dirs = ['server/logs', 'server/data'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize server
createDirectories();
loadUsageData();

app.listen(PORT, () => {
  logger.info(`CFO Helper Agent server running on port ${PORT}`);
});