# SmartAsset - Inventory & Asset Management System

## 1. Project Overview
SmartAsset is a role-based asset and inventory management system that streamlines how organizations track, assign, and request corporate devices. The platform governs administrative workflows, requests, and approvals across three distinct roles: Admin, Manager, and Employee.

### Roles and Capabilities
*   **Admin:** Complete system authorization. Admins can view metrics, perform CRUD operations on assets, manage system accounts (create, update, delete user profiles), review security audit trails, and approve or reject asset requests.
*   **Manager:** Tactical inventory supervisors. Managers can perform CRUD operations on assets (create, update, view), examine asset queues, and approve or reject employee asset requests. Managers are restricted from user account editing and security logs access.    
*   **Employee:** Standard end-users. Employees can view available inventory with filters and search tools, submit asset procurement requests, and view their personal request status and histories.

### Core Implemented Features
*   **Authentication & Session Management:** JWT-based authentication flow with protected client routing and backend validation middleware.
*   **Role-Based Access Control (RBAC):** Restricts route execution and page access based on user authorization roles (Admin, Manager, Employee).
*   **Asset Management CRUD:** Full control over registering, modifying, listing, and archiving corporate hardware and software records.
*   **Request & Approval Workflows:** Operational channel for employees to request devices, and managers or admins to approve/reject them.
*   **Admin User Management:** Admin-only account creator, editor, and deleter with own-role change safety checks.
*   **Audit Logging (Bonus Feature):** Centralized tracking of critical events (asset creations, modifications, deletions, request submissions, approvals, and rejections) into a MongoDB-backed security audit log trail.
*   **Search, Filter, & Pagination (Bonus Feature):** Serverside category selection, text search, and paginated navigation.
*   **Responsive UI Theme (Bonus Feature):** Crisp white styling layouts with purple highlights optimized across desktop, tablet, and mobile browsers.

---

## 2. Technology Stack

### Frontend
*   **Framework:** React v18.3 (Vite-powered SPA)
*   **Routing:** React Router DOM v6.23
*   **Styling:** Vanilla CSS & Tailwind CSS v3.4
*   **Icons:** Lucide React v0.379

### Backend
*   **Runtime Environment:** Node.js
*   **Framework:** Express v4.19
*   **Database & ODM:** MongoDB & Mongoose v8.3
*   **Session Security:** JSON Web Token (jsonwebtoken v9.0)
*   **Password Hashing:** bcryptjs v2.4

---

## 3. Setup and Installation Instructions

### Prerequisites
*   Node.js (v18.x or v20.x recommended)
*   MongoDB (MongoDB Community Server local instance or Atlas URI)

### Installation Steps

1.  Clone the repository and open the workspace.
2.  Install backend dependencies:
    ```bash
    cd server
    npm install
    ```
3.  Install frontend dependencies:
    ```bash
    cd ../client
    npm install
    ```

### Configuration (.env)
Create a `.env` file in the `server` directory and define the following variables:
```env
PORT=8001
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_signing_secret_string
```
*Note: The frontend client is preconfigured to communicate with the backend at `http://localhost:8001/api`.*

### Database Seeding
To initialize the database with default demo users and mock inventory assets:
```bash
cd server
node seed/seedUsers.js
```
*(This deletes existing dummy seeds and inserts 3 default roles and 120 assets into your database).*

### Running the Application

1.  **Start Backend Server:**
    ```bash
    cd server
    npm run dev
    ```
    The API runs at `http://localhost:8001`.

2.  **Start Frontend Client:**
    ```bash
    cd client
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

---

## 4. Default Test Credentials
The database seeder initializes the system with three default accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@smartasset.com` | `Admin@123` |
| **Manager** | `manager@smartasset.com` | `Manager@123` |
| **Employee** | `employee@smartasset.com` | `Employee@123` |

*Note: In production environments, seed accounts must be changed or deleted. Additional users can be registered dynamically via the Admin "User Management" dashboard panel.*

---

## 5. Assumptions and Design Decisions

*   **JWT Storage:** JWT tokens are stored in `localStorage` for simplified access controls. Production systems should store tokens in secure, `httpOnly` cookies to reduce XSS vulnerabilities.
*   **Validation Design:** Maintained a clean codebase by performing manual inputs validation (`if (!field)`) on the controller layer rather than introducing external schema libraries.
*   **Signup Exclusivity:** There is no public user registration page. Account creation is restricted to the Administrator dashboard to prevent unauthorized account access.
*   **Audit Logging Scope:** Tracking is scoped specifically to state-altering actions (CRUD operations and request decisions) rather than generic read-only logs (`GET` listings) to optimize database storage and focus on security-relevant history.
*   **Employee UI Simplification:** Available asset logs in the employee workflow list category dropdowns and text filters but exclude status filters, as employees only need access to `"available"` inventory items.
*   **Scope Limitations:** Automated test suites, Docker containers, and CI/CD pipelines have been scoped out of this release.
