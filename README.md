#FullStack Intern Coding Challenge

A full-stack web application that allows users to register, rate stores, and manage access based on user roles.

##Tech Stack

- **Frontend**: React.js  
- **Backend**: Express.js / NestJS / LoopBack (choose one)  
- **Database**: PostgreSQL or MySQL

---

##Features

###Authentication & Authorization
- Single login system for all users
- Role-based access control for:
  - **System Administrator**
  - **Normal User**
  - **Store Owner**

---

##User Roles & Functionalities

### 1. System Administrator
- Add new stores, users (normal & admin)
- Dashboard overview:
  - Total Users
  - Total Stores
  - Total Ratings
- View & filter:
  - Stores (Name, Email, Address, Rating)
  - Users (Name, Email, Address, Role)
- View user details (includes store rating for store owners)
- Logout

### 2. Normal User
- Register & login
- Update password
- View and search stores (by Name and Address)
- See:
  - Store Name
  - Address
  - Overall Rating
  - Their own submitted rating
- Submit or update rating (1 to 5)
- Logout

### 3. Store Owner
- Login
- Update password
- Dashboard:
  - List of users who rated their store
  - Store's average rating
- Logout

---

##Form Validations

| Field     | Rules |
|-----------|-------|
| Name      | 20-60 characters |
| Address   | Max 400 characters |
| Password  | 8-16 characters, 1 uppercase, 1 special character |
| Email     | Valid email format |

---

##Additional Notes

- All tables support sorting (asc/desc) by key fields like Name and Email.
- Follow best practices for frontend, backend, and DB schema design.
- Use secure authentication and input sanitation to prevent common vulnerabilities.

---

##Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/fullstack-intern-challenge.git
cd fullstack-intern-challenge

# Setup backend
cd backend
npm install
# Configure your DB connection in .env
npm run start

# Setup frontend
cd ../frontend
npm install
npm start
