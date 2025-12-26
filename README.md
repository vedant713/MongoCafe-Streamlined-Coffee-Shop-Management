# MongoCafe: Coffee Shop Management System

A streamlined, modern web application for managing coffee shop operations. Built for speed, usability, and scale using **FastAPI** and **React**.

![Dashboard Preview](https://via.placeholder.com/800x400?text=MongoCafe+Dashboard+Preview)

## 🚀 Key Features

### 🎨 Premium UI/UX Experience
-   **Dynamic Landing Page**: Interactive split-screen layout with hover expansions and floating 3D animations.
-   **Animated Interactions**: Staggered product loading, hover zoom effects, and liquid-style buttons.
-   **Glassmorphism**: Modern frosted glass aesthetics across the dashboard, menu, and modals.
-   **Global Themes**: Dark mode optimized with vibrant gradients and "OUTFIT" typography.

### 🛒 E-Commerce & POS Flow
-   **Visual Menu**: Beautiful grid layout with staggered animation entrance.
-   **Sidebar Cart**: Persistent slide-out cart drawer for seamless shopping.
-   **Dedicated Checkout**: Full-page, Amazon-style checkout experience with order summaries and multiple payment modes (Cash, Card, UPI, Split).
-   **Smart Bill Splitting**: validation logic for complex payment scenarios.

### 🔐 Advanced Security & RBAC
-   **Dual Login Modes**:
    -   **Staff Portal**: Secure access for Owner, Managers, and Cashiers.
    -   **Customer Kiosk**: Limited access for self-service ordering.
-   **Authentication Methods**:
    -   **PIN Login**: Quick numeric access for POS terminals.
    -   **Password Login**: Secure admin access.
    -   **OTP Login**: Simulated mobile OTP for customers.
-   **Role-Based Access Control (RBAC)**:
    -   **Owner**: Full Access (Analytics, Employees, Menu Management, Inventory).
    -   **Manager**: Operations Management.
    -   **Cashier**: POS & Order Management.
    -   **Customer**: Place Orders only.

### 📦 Inventory & Menu Management
-   **Live Inventory**: Monitor stock levels (Coffee Beans, Milk, Cups).
-   **Menu Editor**: **New!** Owners can Add items with image uploads directly from the UI.
-   **Real-time Updates**: Price and stock changes reflect instantly.

### 📊 Analytics & Insights
-   **Real-time Dashboard**: Live sales metrics and order counters.
-   **Charts**: Peak sales hours and popular items visualization.
-   **Financials**: Daily revenue tracking.

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
| **Manager** | `2222` | Manage Staff, Menu |
| **Cashier** | `3333` | POS & Orders Only |
| **Barista** | `4444` | View Orders Only |

### Passwords (Login via Email)
-   **Owner**: `owner` / `admin123`
-   **Manager**: `manager` / `manager123`

### Customer Login
-   Select **"Customer"** on the landing page.
-   Enter any phone number.
-   **OTP**: `1234` (Hardcoded for simulation).

---

## 🛠️ Technology Stack

-   **Frontend**: React 19, Vite, React Router v7, Lucide Icons.
-   **Styling**: Custom CSS Variables, Glassmorphism, Advanced Keyframe Animations.
-   **State Management**: React Context API (Auth, Cart, Theme).
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
│   │   ├── components/ # Reusable UI (CartDrawer, Layout)
│   │   ├── pages/      # Views (Menu, Dashboard, Checkout)
│   │   ├── context/    # Global State (Auth, Cart)
│   │   └── index.css   # Global Styles & Animations
└── run_app.sh          # Startup Script
```

---
*Developed with ❤️ for Coffee Lovers.*