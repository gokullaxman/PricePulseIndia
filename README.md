# PricePulse India

⚡ **PricePulse** is a live price tracking application for India. It provides daily updates on gold rates, petrol/diesel prices, grocery costs, and offers a comprehensive EMI calculator with interactive graphical visualizations.

## 🌟 Features

- **🏦 Loans & EMI Calculator**: Check your loan eligibility and compute EMIs instantly with interactive visualizations. Compare interest rates across different central banks.
- **🥇 Metals & Commodities**: Track live global rates for precious metals like Gold, Silver, and Platinum.
- **🛒 Grocery Prices**: Search through a comprehensive catalog of average retail grocery prices across India, categorized by Vegetables, Grains, Dairy, and Oils.
- **🛢️ Fuel Prices**: Get daily price updates for Petrol, Diesel, and CNG across 24 major Indian cities, automatically refreshed at 6:00 AM IST.
- **🌐 Localization**: Multi-language support to provide an accessible interface.
- **⚙️ Admin Dashboard**: Manage and update central bank rates locally.

## 🛠️ Tech Stack

PricePulse is built with pure web technologies. There is no complex build step required, resulting in a lightning-fast and universally compatible project:
- **HTML5** & **Vanilla CSS**
- **Vanilla JavaScript (ES6 Modules)**
- Custom UI components with SVGs and Animations
- Responsive Design for mobile, tablet, and desktop

## 📂 Project Structure

```text
pricepulse/
├── index.html         # Main entry point and semantic views layout
├── css/ & styles/     # Core and modular CSS
├── data/              # Static JSON acting as the mock database
└── js/                # Vanilla JavaScript ES6 Modules
    ├── components/    # Reusable complex UI logic (Cards, Tables, EMI Charts)
    ├── controllers/   # Glue code between UI modules and App State
    ├── modules/       # Domain-specific logic
    ├── store/         # Custom state management system
    └── utils/         # Helper functions
```

## 🚀 How to Run Locally

You have multiple options to start the application:

### Option 1: Using Node & NPM
If you have [Node.js](https://nodejs.org/) installed, you can start a local development server using `npx`:

1. Open your terminal and navigate to the project directory:
   ```bash
   cd pricepulse
   ```
2. Run the application:
   ```bash
   npm start
   # or
   npm run dev
   ```
3. Your browser will automatically list the host, usually `http://localhost:3000` or `http://127.0.0.1:8080`.

### Option 2: Live Server (VS Code Extension)
1. Open the project in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **"Open with Live Server"**.

### Option 3: Local File Protocol
Simply double-click `index.html` within your file explorer to open it natively in your web browser. (Note: Running via a server like Options 1 or 2 is strongly recommended to prevent CORS policies from blocking the local `.json` file fetches.)

---
**Disclaimer**: Data (such as bank interest rates and fuel prices) is derived from aggregated sources and provided for informational purposes only.
