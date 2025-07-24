# Vyapari App

https://vyapari-frontend.onrender.com

Vyapari is a full-stack inventory and sales management application designed for businesses to streamline their operations. It provides features for managing employees, products, and sales, as well as generating invoices and visualizing key business data.

## Features

- **Login and Role-Based Navigation**:
  - Customers can browse products and receive invoices at checkout.
  - Employees can manage inventory and view analytics.

- **Dashboard**:
  - Clean and modern UI resembling an admin panel.
  - Stock levels, sales, and profit data visualization using Matplotlib.
  - Left sidebar with tabs for:
    - Invoice Generation
    - Product Info
    - Employee Info
  - Top-right corner for profile and notifications.
  - Search bar for easy navigation.
  - Vyapari logo redirects to the home page.

- **Products Page**:
  - List of products with stock details.
  - Option to add, edit, and delete products.

- **Employee Management**:
  - Displays employee details (EmpID, Name, Phone) from an SQL database.
  - Ability to delete employee records.

- **Checkout Page**:
  - Customers can select products, view the total, and generate invoices.

- **Custom Color Theme**:
  - Dashboard color theme: `#38d39f`.

## Technologies Used

### Frontend:
- React
- Tailwind CSS

### Backend:
- Node.js
- Express.js

### Database:
- MySQL

### Data Visualization:
- Matplotlib (Python)

## Prerequisites

1. **Frontend**:
   - Node.js installed (v16+ recommended).
   - Navigate to `vyapari-frontend` directory.
   
2. **Backend**:
   - Node.js installed.
   - MySQL server set up (Port: `3067`).

3. **Database**:
   - PHP my admin (XAMPP Control Panel).

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/vyapari.git
cd vyapari
BACKEND
cd vyapari-backend
npm install
node server.js
FRONTEND
cd vyapari-frontend
npm install
npm run dev
