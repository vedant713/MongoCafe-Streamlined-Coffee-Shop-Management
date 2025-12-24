# MongoCafe: Coffee Shop Management System

A streamlined, modern web application for managing coffee shop operations. Built for speed, usability, and scale using **FastAPI** and **React**.

![Dashboard Preview](https://via.placeholder.com/800x400?text=MongoCafe+Dashboard+Preview)

## 🚀 Key Features

### 🔐 Advanced Security & RBAC
-   **Dual Login Modes**:
    -   **Staff Portal**: Secure access for Owner, Managers, and Cashiers.
    -   **Customer Kiosk**: Limited access for self-service ordering.
-   **Authentication Methods**:
    -   **PIN Login**: Quick numeric access for POS terminals.
    -   **Password Login**: Secure admin access.
    -   **OTP Login**: Simulated mobile OTP for customers.
-   **Role-Based Access Control (RBAC)**:
    -   **Owner**: Full Access (Analytics, Employees, Menu, Inventory).
    -   **Manager**: Operations Management.
    -   **Cashier**: POS & Order Management only.
    -   **Customer**: Place Orders only.

### 🛒 Point of Sale (POS)
-   **Visual Menu**: Beautiful glassmorphic grid with product images.
-   **Smart Cart**: Real-time total calculation, tax, and bill splitting.
-   **Checkout**: Integrated receipt generation and order tracking.

### 📊 Analytics & Insights
-   **Real-time Dashboard**: Live sales metrics and order counters.
-   **Charts**: Peak sales hours and popular items visualization.
-   **Financials**: Daily revenue tracking.

### 📦 Inventory & Menu
-   **Inventory Tracking**: Monitor stock levels of ingredients (Coffee Beans, Milk, Cups).
-   **Menu Management**: Add/Edit products, update prices and images.

---

## ⚡ Quick Start

### Prerequisites
-   **Python 3.9+**
-   **Node.js 16+** & **npm**

### One-Command Startup 🚀
We have provided a unified script to run both Backend and Frontend simultaneously.

1.  **Run the App**:
    ```bash
    ./run_app.sh
    ```
    This script will:
    -   Kill existing processes on ports 8000 (API) and 5173+ (Frontend).
    -   Start the FastAPI Backend.
    -   Start the React Frontend.

2.  **Access the App**:
    -   Open your browser and note the URL provided in the terminal (usually `http://localhost:5173` or similar).

---

## 🔑 Default Credentials (Testing)

The application uses an **In-Memory Database (Mongomock)** by default, so data resets on every restart. Use these credentials to test:

### Staff PINs
| Role | PIN | Permissions |
| :--- | :--- | :--- |
| **Owner** | `1111` | Full Admin Access |
| **Manager** | `2222` | Manage Staff, Inventory |
| **Cashier** | `3333` | POS & Orders Only |
| **Barista** | `4444` | View Orders Only |

### Passwords (Login via Email)
-   **Owner**: `owner` / `admin123`
-   **Manager**: `manager` / `manager123`

### Customer Login
-   Select **"I'm a Customer"** on the landing page.
-   Enter any phone number.
-   **OTP**: `1234` (Hardcoded for simulation).

---

## 🛠️ Technology Stack

-   **Frontend**: React, Vite, React Router, Lucide Icons, Glassmorphism CSS.
-   **Backend**: FastAPI, Pydantic, Python 3.9.
-   **Database**: MongoDB (Production) / Mongomock (Dev/Testing).
-   **Security**: JWT (JSON Web Tokens), BCrypt Hashing.

## 📂 Project Structure

```
├── backend/
│   ├── routers/        # API Endpoints (auth, orders, products...)
│   ├── database.py     # DB Connection & Seeding
│   ├── security.py     # JWT & Hashing Logic
│   └── main.py         # App Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI (Layout, ProtectedRoute)
│   │   ├── pages/      # Views (POS, Dashboard, Login)
│   │   └── context/    # Auth & Theme State
└── run_app.sh          # Startup Script
```

---
*Developed with ❤️ for Coffee Lovers.*