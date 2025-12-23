# MongoCafe: Coffee Shop Management System

A modern, full-stack web application for managing coffee shop operations, including sales tracking, customer management, employee roles, and menu customization.

This project has been modernized from a legacy Tkinter desktop application to a robust web architecture using **FastAPI** (Backend) and **React** (Frontend).

## 🚀 Key Features

*   **📊 Interactive Dashboard**:
    *   Real-time overview of Sales, Orders, and Active Employees.
    *   Visual statistics and quick action shortcuts.
*   **👥 Customer Management**:
    *   Add, edit, view, and delete customer records.
    *   **Search**: Instantly filter customers by name or phone number.
*   **👔 Employee Management**:
    *   Manage staff profiles and roles (Manager, Barista, Cashier, etc.).
    *   **Search**: Filter employees by name or role.
*   **☕ Menu Management**:
    *   Organized product catalog with categories (Hot Coffee, Cold Coffee, Snacks).
    *   Quickly update prices and view product details.
*   **✨ Modern UI/UX**:
    *   **Glassmorphism Design**: Sleek, translucent visuals with a modern aesthetic.
    *   **Responsive**: Works on various screen sizes.
    *   **Icons**: Integrated `Lucide React` icons for a polished look.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: CSS Modules / Standard CSS (Glassmorphism Theme)
*   **Icons**: Lucide React
*   **HTTP Client**: Fetch API

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: MongoDB (Motor / PyMongo)
*   **Server**: Uvicorn

## 📂 Project Structure

```
├── backend/                # FastAPI application
│   ├── main.py             # Entry point
│   ├── database.py         # MongoDB connection config
│   └── routers/            # API endpoints (customers, employees, etc.)
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Modal, Layout)
│   │   ├── pages/          # Main views (Dashboard, Menu, etc.)
│   │   └── App.jsx         # Routing
├── legacy/                 # Archived Tkinter application & assets
└── requirements.txt        # Python dependencies
```

## ⚡ Getting Started

### Prerequisites
*   Python 3.8+
*   Node.js & npm
*   MongoDB Instance (Local or Atlas)

### 1. Backend Setup (FastAPI)

1.  Navigate to the root directory.
2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # macOS/Linux
    # venv\Scripts\activate   # Windows
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    uvicorn backend.main:app --reload --port 8000
    ```
    *Server will start at `http://localhost:8000`*

### 2. Frontend Setup (React)

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    *App will be live at `http://localhost:5173`*

## 📝 Notes

*   **Authentication**: Login functionality is currently disabled for easier development access. The backend still retains the `auth` router and database collections (`login`, `owner`) for future re-enablement.
*   **Legacy Code**: The original Python Tkinter application files have been moved to the `legacy/` directory for reference.