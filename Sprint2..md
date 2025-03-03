# Sprint 2: Backend Documentation

## 1. Summary of Work Completed in Sprint 2
### Backend Progress
- Completed API development for student and room management.
- Implemented authentication with JWT tokens.
- Added unit tests for backend API handlers.
- Created test database setup for integration testing.

### Unit Testing Progress
- Developed unit tests for user and room handlers.
- Used `testify` for mocking services.
- Ensured a 1:1 test-to-function ratio.

### Database Setup Progress
- Configured PostgreSQL database (`hosteldb`).
- Created a test database for running automated tests.

---

## 2. Backend API Documentation

### Student API

### **1. Register a Student**
- **URL:** `POST /api/student/register`
- **Request Body:**
  ```json
  {
    "name": "pree12",
    "email": "johnpre1e@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {"message":"User registered successfully!"}
  ```

### **2. Student Login**

- **URL:** `POST /api/student/login`
- **Request Body:**
  ```json
  {
    "email": "johnpree@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {"message":"Login successful","token":"<JWT_TOKEN>","user":{...}}
  ```

### **3. Get All Students**
- **URL:** `GET /api/student/get-all`
- **Headers:**
  ```makefile
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** Returns a list of all students.

### **4. Update Student Profile**
- **URL:** `PUT /api/student/profile`
- **Headers:**
  ```makefile
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body:**
  ```json
  {
    "gender": "Male",
    "age": 22,
    "major": "Computer Science",
    "language_spoken": "English",
    "preference": "Early bird",
    "food_preference": "Veg"
  }
  ```

---

## Room API

### **5. Create a Room**
- **URL:** `POST /api/rooms`
- **Request Body:**
  ```json
  {
    "name": "Room Ct",
    "type": "Double",
    "vacancy": 3
  }
  ```

### **6. Get All Rooms**
- **URL:** `GET /api/rooms`

### **7. Join a Room**
- **URL:** `POST /api/rooms/{room_id}/join`
- **Request Body:**
  ```json
  {
    "student_name": "ben"
  }
  ```

### **8. Get Rooms by Type**
- **URL:** `POST /api/rooms/filter`
- **Request Body:**
  ```json
  {
    "type": "Double"
  }
  ```

---

## 3. Backend Unit Tests

- **Test file:** `internal/delivery/user_handler_test.go`
- **Test file:** `internal/delivery/room_handler_test.go`
- **Mock services:** `internal/usecase/mock_student_service.go`, `internal/usecase/mock_room_service.go`

### Example Unit Test for Creating a Room
```go
func TestCreateRoom(t *testing.T) {
    gin.SetMode(gin.TestMode)
    mockUsecase := new(usecase.MockRoomUsecase)
    handler := NewRoomHandler(mockUsecase)

    router := gin.Default()
    router.POST("/rooms", handler.CreateRoom)

    input := map[string]interface{}{
        "name": "Room A",
        "type": "2-bed",
        "vacancy": 2,
    }

    reqBody, _ := json.Marshal(input)
    req, _ := http.NewRequest("POST", "/rooms", bytes.NewBuffer(reqBody))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusCreated, w.Code)
    mockUsecase.AssertExpectations(t)
}
```

---

## 4. Database Setup Instructions

### **1. Ensure PostgreSQL Database is Running**
- **Database Name:** `hosteldb`
- **Update `backend/config/database.go` Line 14:**
  ```go
  dsn := "host=localhost user=postgres password=YOUR_PASSWORD dbname=hosteldb port=5433 sslmode=disable"
  ```

### **2. Verify Database Connection**
Run:
```sh
psql -U postgres -d hosteldb -h localhost -p 5433
```

### **3. Run Database Migrations**
- **Navigate to the project root directory:**
  ```sh
  cd backend
  ```
- **Run migrations (AutoMigrate in GORM):**
  ```sh
  go run cmd/main.go
  ```

---

## 5. Frontend Cypress Test Documentation

### **1. Authentication Tests (`auth.cy.js`)**

- **Registration Form Display**  
  - Verifies that the registration form is displayed with all required fields (Name, Email, Phone, Dorm Preference, Password).
  
- **Student Registration**  
  - Ensures successful registration with valid input.
  
- **Student Login Form Display**  
  - Ensures login form visibility.

- **Login with Valid Credentials**  
  - Verifies successful login.

- **Login Failure**  
  - Ensures error handling for incorrect login attempts.

---

### **2. Profile Page Tests (`profile.cy.js`)**

- **Profile Page Navigation**  
  - Ensures users can navigate to the profile page.

- **Name Input Field & Gender Dropdown**  
  - Ensures visibility and functionality.

- **Additional Profile Tests**  
  - Includes optional tests for roommate preferences and profile updates.

---

### **3. Page Loading Tests (`pages.cy.js`)**

- **Home Page**  
  - Verifies correct loading and display of key elements.

- **Registration Page**  
  - Ensures all required input fields are present.

- **Student Login Page**  
  - Verifies page loading and form visibility.

- **Profile Page**  
  - Checks sections like personal information and roommate preferences.

- **Room Finder Page**  
  - Ensures proper display of available room types.

- **FAQ Page**  
  - Validates correct FAQ section rendering.

- **Floating Widget**  
  - Ensures visibility on key pages.

---

## 6. Commit Summary for Sprint 2

- **Added Cypress tests for login and page loading**
- **Updated test database, room/user handlers, and mock usecase services**
- **Added mock room and student service for unit testing**
- **Added unit tests for room and user handlers, and test database setup**
- **API integration and new endpoints created**
- **Fixed minor backend bugs and optimized response handling**
- **Integrated frontend with backend APIs**
- **Finalized database schema and auto migrations**

---





