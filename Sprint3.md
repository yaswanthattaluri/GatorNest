# Sprint 3 - GatorNest Hostel Management System

## 1. Summary of Work Completed

### Admin Functionalities
- Implemented **Admin Login** with JWT authentication.
- Developed **Room Management** APIs:
  - Add a room.
  - Delete a room by room number.
- Created **Search Students** feature for admin:
  - Search by name, ID, or room number.

### Student Functionalities
- Developed **Find Roommate** functionality:
  - Students can find potential roommates based on gender and selected preferences.
  - Matched results displayed with relevant student details.

### UI Improvements
- Structured navigation and UI components to reflect login type (student vs admin).
- Added conditional button rendering based on login status.

### Additional Enhancements
- Initial support for **Maintenance Request** feature:
  - Student can submit complaints (WIP).
  - Admin can view and mark them as resolved (planned).

## 2. Backend API Documentation (Sprint 3 Additions)

### Admin APIs
#### Admin Login
- **URL:** `POST /api/admin/login`
- **Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- **Response:** JWT token

#### Add Room
- **URL:** `POST /api/rooms`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Request Body:**
```json
{
  "name": "Room X",
  "type": "Double",
  "vacancy": 3,
  "price": 1200,
  "room_number": 201
}
```

#### Delete Room
- **URL:** `DELETE /api/rooms/number/{room_number}`
- **Headers:** `Authorization: Bearer <admin_token>`

### Student Search API
- **URL:** `GET /api/students/search?type={name|id|roomNumber}&term={value}`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:** List of matched students

### Roommate Matching
- **URL:** `POST /api/students/match-roommates`
- **Request Body:**
```json
{
  "gender": "Female",
  "preference": "Early Bird",
  "cleanliness": "Very Tidy"
}
```
- **Response:** List of matching students

## 3. Backend Unit Tests
- `admin_handler_test.go`: Tests for admin login and token generation
- `room_handler_test.go`: Add room, delete room, get room by type
- `user_handler_test.go`: Create user, Get users, Search students
- Mock services:
  - `mock_admin_service.go`
  - `mock_room_service.go`
  - `mock_student_service.go`

## 4. Frontend Enhancements
### Admin Pages
- `ManageRooms.jsx`: UI for adding and deleting rooms
- `SearchStudent.jsx`: Search interface with filters for name, ID, and room
- `StaffLogin.jsx`: Admin login integrated with JWT authentication

### Student Pages
- `FindRoommate.jsx`: Shows matched roommates based on preferences
- `ProfilePage.jsx`: Allows preference input to be used for matching

### Frontend Improvements
- Navigation buttons conditionally rendered based on login type
- State management for tokens and roles in `localStorage`

## 5. Frontend Cypress Tests
- `auth.cy.js`: Validates admin login
- `pages.cy.js`: Validates room management and roommate finder UI

## 6. Commit Summary
- Admin login backend and frontend UI
- Admin APIs for room add/delete
- Enhanced room handler tests and coverage
- Added student search filters and backend logic
- Created and committed `mock_admin_service.go`
- UI integration for admin dashboard and routing fixes
- Refactored `ManageRooms.jsx` and added interactive feedback
- Roommate matching algorithm implemented on backend

## 7. Database
- No schema changes; used existing `Student` and `Room` models.
- Auto migration handled in `config/database.go`.

---
**Contributors:**
- Backend: Meghana
- Frontend: Pranaya, Sai

**Sprint Completed:** March 31, 2025

**Next Steps:**
- Finalize maintenance complaint feature
- Improve dashboard analytics for admins
- Expand Cypress test coverage
- Deploy to test server for QA and feedback

