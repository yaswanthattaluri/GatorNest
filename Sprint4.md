# Sprint 4 - GatorNest Hostel Management System

## 1. Summary of Work Completed

### Backend Features
- Integrated cloud-hosted PostgreSQL on Render for persistent storage
- Updated backend configuration to load environment variables securely for deployment
- Added new APIs:
  - `POST /api/payments`: Record payments
  - `GET /api/payments/student/{id}`: Retrieve payment history
  - `GET /api/rooms/number/{room-number}`: Fetch room details
  - `POST /api/maintenance-requests`: Submit maintenance complaints
  - `PUT /api/maintenance-requests/{id}`: Update request with technician notes
- Added email notification for interested room requests

### Frontend Features
- Implemented **Payments Page**:
  - Students can submit payments
  - Success notification and live status update in a table (Pending → Completed)
- Implemented **Room Interest Button**:
  - Clicking “Interested” sends an email to the admin about room interest
- Completed **Maintenance System**:
  - `Maintenance.jsx`: Students can submit detailed requests with all necessary fields
  - `MaintenanceHistory.jsx`: Displays real-time updates on request status, notes, and completion
  - `ViewMaintenanceRequests.jsx`: Admin dashboard to filter, edit, and resolve requests inline
- `FindRoommate.jsx`: Now includes an “Interested” button that notifies the admin

## 2. Backend Unit Tests
- `maintenance_handler_test.go`: Create, fetch, and update maintenance requests
- `payment_handler_test.go`: Submit payment, fetch payment history
- `room_handler_test.go`: Room lookup by number
- All tests run using:
  ```bash
  go test ./internal/delivery -v
  ```
- Mocks used for isolation:
  - `mock_maintenance_service.go`
  - `mock_payment_service.go`

## 3. Frontend Unit and Cypress Tests

### Unit Tests:

#### `Maintenance.test.jsx`
- Verifies form renders on load
- Toggles between form and request history
- Tests form field population and submission
- Checks dependent dropdown behavior (e.g., subcategory activation)
- Confirms form resets after successful submit
- Validates alerts for submission failure
- Validates category options are correct

#### `AdminMaintenancePanel.test.jsx`
- Shows loading indicator on mount
- Displays fetched maintenance request data
- Filters by status (New, In Progress, Resolved)
- Allows inline editing of technician notes
- Saves updates with confirmation messages
- Handles failed save with error alert

### Cypress End-to-End Tests

#### `maintenance.cy.js` (Student Flow)
- Mocks student login and token storage
- Verifies maintenance form loading and submission
- Intercepts and validates request payload
- Confirms success alert on completion

#### `admin-maintenance.cy.js` (Admin Flow)
- Mocks staff login and redirects to dashboard
- Validates access to maintenance view panel
- Intercepts GET requests for maintenance data
- Checks display of request info and admin interaction

## 4. Deployment Summary
- Backend hosted on Render
  - Auto deploys on each commit to `main`
  - Connected to managed PostgreSQL DB
- Frontend hosted on Netlify
  - Auto deploys on each commit to `main`
  - SPA routing handled using `_redirects` file

Live Deployment Links:
- Frontend: https://gatornest.netlify.app
- Backend: https://gatornest-backend.onrender.com

## 5. Integration & Final Notes
- Fully integrated and deployed full-stack application
- Verified API interactions via Postman and frontend
- Real-time maintenance tracking system from student submission to admin resolution
- Payment workflows and room interest notifications are functional and validated
- Unit and E2E test coverage ensures production stability and maintainability
- Final Sprint demonstrates fully operational modules with backend security, responsive frontend, and persistent data in the cloud

