# Sprint 4 Summary – GatorNest

## Backend Work Completed

- Integrated cloud-hosted PostgreSQL database on Render for persistent data storage
- Updated backend connection logic in `database.go` to support environment variables for secure deployment
- Added API endpoints:
  - `POST /api/payments`: Record payment data
  - `GET /api/payments/student/{student_id}`: Fetch all payments for a student
  - `GET /api/rooms/number/{room_number}`: Retrieve room details by number
  - Enhanced existing endpoints for admin, maintenance, student, and room modules
- Implemented proper error handling and response formatting across endpoints

## Backend Unit Tests

Unit tests were written using Go's testing framework. The following tests were added:

- `maintenance_handler_test.go`:
  - Tests for creating maintenance requests
  - Retrieving all maintenance requests
  - Updating maintenance requests (status, notes, date)

- `payment_handler_test.go`:
  - Tests for submitting payment details
  - Retrieving payment history by student ID

Mock services were created under `internal/usecase/mock/` to support isolated unit testing.

## Frontend Unit and Integration Tests

Unit tests were created for major frontend components using Jest and React Testing Library.

### Unit Tests:
- `RoomFinder.test.jsx`
- `SearchStudent.test.jsx`
- `StaffLogin.test.jsx`
- `FindRoommate.test.jsx`
- `ManageRooms.test.jsx`

Each test verifies component rendering, form handling, conditional UI behavior, and API interaction logic.

### Cypress Testing:
- Frontend supports integration testing with Cypress
- Routing and protected component behavior validated via simulated UI flows

## Deployment and Integration

### Backend:
- Hosted on Render with automatic deployments from GitHub `main` branch
- Render PostgreSQL database integrated and tested with live data

### Frontend:
- Deployed on Netlify with SPA routing support
- `_redirects` and `netlify.toml` configured to support client-side routing
- Build and deploy integrated with GitHub repository

## Final Notes

- The backend and frontend are fully integrated and deployed
- All API endpoints were tested using Postman and verified for correct data storage in the cloud database


