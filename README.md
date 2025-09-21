# CFO Helper Agent MVP

A comprehensive financial planning dashboard with AI assistance for scenario analysis and reporting.

## Features

### Core Functionality
- **Financial Dashboard**: Real-time financial snapshot with key metrics
- **Scenario Planning**: Interactive sliders for hiring, marketing spend, and pricing adjustments
- **AI Assistant**: OpenAI GPT-4o-mini integration for financial insights
- **Report Export**: PDF generation with charts and AI-generated analysis
- **Usage Analytics**: Track scenarios tested and reports exported

### Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Charts**: Recharts library for data visualization
- **PDF Export**: jsPDF with html2canvas for chart capture
- **AI Integration**: Google Gemini 1.5 Flash API

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```
   This starts both the React frontend (port 5173) and Express backend (port 3001).

## Architecture

### Frontend Components
- `Dashboard.tsx` - Main dashboard layout and state management
- `FinancialSnapshot.tsx` - Current financial metrics display
- `ScenarioControls.tsx` - Interactive sliders for scenario planning
- `FinancialChart.tsx` - Recharts visualization of financial data
- `AIAssistant.tsx` - Chat interface for AI financial advice
- `UsageCounter.tsx` - Real-time usage analytics
- `ExportReport.tsx` - PDF report generation

### Backend API Endpoints
- `GET /api/financial-data` - Fetch current financial snapshot
- `POST /api/calculate-scenario` - Calculate financial impact of changes
- `POST /api/ai-assistant` - Get AI-powered financial insights
- `POST /api/export-report` - Track report exports
- `GET /api/usage` - Fetch usage analytics

### Data Flow
1. User adjusts scenario parameters via sliders
2. Frontend calls `/api/calculate-scenario` with parameters
3. Backend calculates financial impact and returns comparison data
4. Charts update to show current vs adjusted scenarios
5. User can ask AI for insights about the scenario
6. Export functionality generates PDF with all data and AI analysis

## Configuration

### Financial Calculations
The app uses the following business logic:
- **Salary Cost**: ₹5,000 per employee per month
- **Revenue Impact**: Proportional to price changes
- **Runway Calculation**: Cash balance divided by monthly burn rate
- **Marketing ROI**: Direct expense impact on cash flow

### AI Integration
- Uses Google Gemini 1.5 Flash for financial analysis
- Includes scenario context in prompts for relevant advice
- Fallback responses when API is unavailable

### Usage Tracking
- Persists usage data to `server/data/usage.json`
- Increments counters for scenarios tested and reports exported
- Real-time updates on dashboard

## Deployment Considerations

### Production Setup
- Set `NODE_ENV=production`
- Configure proper CORS origins
- Add rate limiting for AI API calls
- Implement user authentication if required
- Add database persistence for usage data

### Scaling
- Replace in-memory storage with database (Redis/PostgreSQL)
- Add caching for financial calculations
- Implement background job processing for PDF generation
- Add monitoring and logging

## Development

### Adding New Financial Metrics
1. Update the `FinancialData` interface in `src/types/financial.ts`
2. Modify calculation logic in `server/index.js`
3. Update chart components to display new metrics

### Customizing AI Responses
- Modify prompts in the `/api/ai-assistant` endpoint
- Add domain-specific financial knowledge
- Implement response templates for common questions

### Extending Export Functionality
- Add chart capture to PDF using html2canvas
- Include additional financial ratios and KPIs
- Support multiple export formats (Excel, CSV)

## License

MIT License - see LICENSE file for details.