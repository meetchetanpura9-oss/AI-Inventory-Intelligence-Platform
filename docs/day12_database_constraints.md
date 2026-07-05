# Day 12: Database Constraints and Indexes

In an enterprise-grade backend application (like Amazon, Zepto, or Blinkit), data integrity is the single most critical asset. If corrupt, duplicate, or orphan data enters the database, it can result in incorrect order updates, inventory leaks, and system crashes. 

Database constraints and indexes act as the final, unbreakable line of defense that enforces consistency, maintains data relationships, and guarantees lightning-fast query performance.

---

## 1. Primary Key

### What is it?
A **Primary Key (PK)** is a column (or a group of columns) that uniquely identifies each row in a database table. No two rows can share the same primary key value, and a primary key can **never be NULL**.

### Beginner-Friendly Analogy
Think of a primary key like a citizen's National ID or a student's Roll Number. Even if two students share the same name and date of birth, their roll numbers uniquely identify them.

### SQL Example
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,  -- Enforces uniqueness and is automatically indexed
    product_name VARCHAR(255) NOT NULL
);
```

---

## 2. Unique Constraint

### What is it?
A **Unique Constraint** ensures that all values in a column (or combination of columns) are distinct across all rows in a table. Unlike a Primary Key, a unique column **can contain NULL values** (unless specifically marked `NOT NULL`), and a table can have multiple unique constraints.

### Beginner-Friendly Analogy
Think of your registered **Email Address** or **Phone Number** in a store database. Multiple customers cannot register using the same email or phone number.

### SQL Example
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL  -- Enforces that SKU is unique and not empty
);
```

---

## 3. Check Constraint

### What is it?
A **Check Constraint** enforces a specific boolean condition that every row in the table must satisfy. If a write operation (INSERT or UPDATE) attempts to violate this condition, the database rejects it.

### Beginner-Friendly Analogy
Think of a check constraint as a physical validator at an amusement park. If a sign says "Must be at least 4 feet tall to ride", anyone shorter than 4 feet is rejected.

### SQL Example
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    selling_price NUMERIC(10, 2) NOT NULL,
    cost_price NUMERIC(10, 2),
    
    -- Selling price must be greater than zero, cost price cannot exceed selling price
    CONSTRAINT chk_prices CHECK (selling_price > 0 AND (cost_price IS NULL OR cost_price <= selling_price))
);
```

---

## 4. Foreign Key

### What is it?
A **Foreign Key (FK)** is a column or group of columns in one table that points to the primary key of another table. It establishes a link between the data in the two tables and enforces **Referential Integrity** (preventing "orphan" records).

### Beginner-Friendly Analogy
Think of a **Library Book** and its **Borrower**. You cannot check out a book under a borrower ID that does not exist in the students database.

### SQL Example
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category_id INT,
    
    -- Links products.category_id to categories.id
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

---

## 5. Database Index

### What is it?
A **Database Index** is a data structure (typically a B-Tree) that PostgreSQL maintains separately from the table data to speed up search and retrieval operations. Without an index, the database must perform a full table scan (reading every single page on the disk) to find a record.

### Beginner-Friendly Analogy
Think of the **Index section at the back of a textbook**. If you want to find pages mentioning "SQLAlchemy", you look up the word "SQLAlchemy" in the index to find the page numbers directly, instead of flipping through the book page by page.

### SQL Example
```sql
-- Creates an index on the product_name column
CREATE INDEX idx_products_product_name ON products(product_name);
```

---

## 6. Default Value

### What is it?
A **Default Value** is a value that the database automatically assigns to a column if no value is explicitly provided during an `INSERT` statement.

### Beginner-Friendly Analogy
Think of a signup form where the "Country" field automatically fills in "United States" or the "Active Status" checkbox is checked by default.

### SQL Example
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE,            -- Default value at the DB level
    created_at TIMESTAMP DEFAULT NOW()        -- Server-side timestamp
);
```

---

## 7. Why Production Databases Use Constraints

While application layers (like Pydantic or FastAPI business validation) can filter out bad inputs, production systems must use database-level constraints for the following critical reasons:

1. **Concurrency and Race Conditions**: 
   If two requests attempt to register the same SKU at the exact same millisecond, FastAPI validation in both requests might check `SELECT EXISTS` and see it doesn't exist yet, proceeding to write both records. A database-level `UNIQUE` constraint blocks the duplicate at the storage layer, preventing duplicate SKUs from slipping through.
2. **Multiple Entry Points**: 
   A production database is rarely accessed only by the main API. Data engineering pipelines (ETL), admin scripts, direct CLI queries, and analytics dashboards can write directly to the DB. Database-level constraints guarantee that data integrity is enforced regardless of *how* the data got there.
3. **Data Integrity as the Source of Truth**: 
   Codebases change, validation libraries get updated, and bugs can be introduced in the application code. Database constraints guarantee that the data remains clean and consistent forever.
