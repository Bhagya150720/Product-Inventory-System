# StockFlow - Product Inventory System

A clean and responsive Product Inventory System built using the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS v3. 

This project was built for an interview evaluation, emphasizing proper client-side/server-side validations, numbered pagination, multi-select category filters, and soft-delete business logic.

---

## Key Features

1. **Product Management**:
   - Create products with fields: unique active name, description, quantity (integer >= 0), and multiple categories.
   - Client-side validation prevents form submission if inputs are invalid.
   - Server-side validation captures field-specific errors and maps them back directly to individual form inputs.
2. **Paginated Listing**:
   - Dynamically pulls products from the database, displaying names, descriptions, categories (as tag pills), creation date, and stock levels.
   - Numbered pagination controls (Prev, Page 1, Page 2..., Next) highlighting active pages and showing current range counts (e.g., "Showing 6 to 10 of 10 products").
3. **Advanced Filtering**:
   - **Search by Name**: Case-insensitive substring matching on product names.
   - **Multi-select Category Dropdown**: Filters items belonging to *any* of the selected categories.
   - Filter criteria reset the active page index automatically to prevent out-of-bound display errors.
4. **Soft Delete**:
   - Deleting a product sets an `isDeleted` flag to `true` instead of deleting the database record.
   - A custom unique check ensures product names must be unique among active products, but allows reuse of names once a prior product has been deleted.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v3, Lucide React (Icons)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), CORS, Dotenv
- **Database**: MongoDB (Local Instance)

---

## Project Structure

```
product-inventory-system/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # ProductForm, ProductTable, ProductsFilter
│   │   ├── App.jsx      # Global state orchestrator
│   │   └── index.css    # Tailwind directives
│   └── tailwind.config.js
├── server/              # Node/Express backend
│   ├── config/          # Database connection setup
│   ├── models/          # Category & Product Mongoose schemas
│   ├── controllers/     # Business logic for routes
│   ├── routes/          # Express API endpoints
│   ├── scripts/         # Database seeder script
│   └── server.js        # Main entrypoint
└── README.md
```

---

## Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed and running locally on your system.

### 1. Setup the Backend
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `server/` folder and add:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/product_inventory
   ```
4. Seed the database with default categories and products:
   ```bash
   npm run seed
   ```
5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *(The server will start on `http://localhost:5000`)*

---

### 2. Setup the Frontend
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *(The app will start on `http://localhost:5173`)*

---

## API Endpoints

- **Categories**:
  - `GET /api/categories` - Fetch all seeded categories.
- **Products**:
  - `GET /api/products` - Fetch paginated, filtered active products.
    - Query Params: `page`, `limit`, `search`, `categories`.
  - `POST /api/products` - Create a new product.
  - `DELETE /api/products/:id` - Soft-delete a product.
