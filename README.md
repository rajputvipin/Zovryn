# Finance Data Processing and Access Control Backend

This is a complete backend implementation for a finance dashboard system demonstrating API design, data modeling, role-based access control (RBAC), and summary analytics.

## Technologies Used
- Node.js & Express
- TypeScript
- Prisma ORM & SQLite (for simplicity and portability without requiring a separate DB server)
- Zod (for input validation)
- JWT & bcryptjs (for mock authentication & secure access control)

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Initialize Database**
   \`\`\`bash
   npm run db:push
   \`\`\`

3. **Run the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

The server will be running at \`http://localhost:3000\`.

## RBAC Structure
- **VIEWER**: Can read non-dashboard financial records and view self.
- **ANALYST**: Can read all financial records and view dashboard summaries.
- **ADMIN**: Can manage users (CRUD) and manage financial records (CRUD).

## Application API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register a new user (accepts email, password, and optional role).
- \`POST /api/auth/login\` - Login an existing user and returns a JWT token.

*(Note: pass the token as \`Authorization: Bearer <token>\` in subsequent requests)*

### User Management (Requires \`ADMIN\` role)
- \`GET /api/users\` - Get all users
- \`GET /api/users/:id\` - Get a specific user
- \`POST /api/users\` - Create a user manually
- \`PATCH /api/users/:id\` - Update user details/roles
- \`DELETE /api/users/:id\` - Delete a user

### Financial Records
- \`GET /api/records\` - List all records. Supports query filters: \`type\`, \`category\`, \`startDate\`, \`endDate\`. (All Roles)
- \`GET /api/records/:id\` - View a specific record. (All Roles)
- \`POST /api/records\` - Create a new record. (Admin only)
- \`PATCH /api/records/:id\` - Update a record. (Admin only)
- \`DELETE /api/records/:id\` - Delete a record. (Admin only)

### Dashboard Summary
- \`GET /api/dashboard/summary\` - Get aggregated summaries (total income, total expenses, net balance, category totals, recent activity). (Analyst and Admin only)
