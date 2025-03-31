package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	// "github.com/stretchr/testify/mock"
	"net/http"
	"net/http/httptest"
	"testing"
	"errors"
)

func TestSearchStudentsByName(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockUsecase}

	router := gin.Default()
	router.GET("/students/search", handler.SearchStudents)

	req, _ := http.NewRequest("GET", "/students/search?type=name&term=John", nil)
	w := httptest.NewRecorder()

	mockStudents := []entity.Student{
		{ID: 1, Name: "John Doe", Age: 20},
	}
	mockUsecase.On("SearchStudents", "name", "John").Return(mockStudents, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockUsecase.AssertExpectations(t)
}

func TestSearchStudentsByID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockUsecase}

	router := gin.Default()
	router.GET("/students/search", handler.SearchStudents)

	req, _ := http.NewRequest("GET", "/students/search?type=id&term=1", nil)
	w := httptest.NewRecorder()

	mockStudent := entity.Student{ID: 1, Name: "John Doe", Age: 20}
	mockUsecase.On("SearchStudents", "id", "1").Return([]entity.Student{mockStudent}, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockUsecase.AssertExpectations(t)
}

func TestSearchStudentsByRoomNumber(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockUsecase}

	router := gin.Default()
	router.GET("/students/search", handler.SearchStudents)

	req, _ := http.NewRequest("GET", "/students/search?type=roomNumber&term=101", nil)
	w := httptest.NewRecorder()

	mockStudents := []entity.Student{
		{ID: 1, Name: "John Doe", Age: 20},
		{ID: 2, Name: "Jane Doe", Age: 22},
	}
	mockUsecase.On("SearchStudents", "roomNumber", "101").Return(mockStudents, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockUsecase.AssertExpectations(t)
}

func TestSearchStudents_MissingParams(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockUsecase}

	router := gin.Default()
	router.GET("/students/search", handler.SearchStudents)

	req, _ := http.NewRequest("GET", "/students/search?type=name", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	mockUsecase.AssertNotCalled(t, "SearchStudents")
}

func TestSearchStudents_InvalidType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockUsecase}

	router := gin.Default()
	router.GET("/students/search", handler.SearchStudents)

	req, _ := http.NewRequest("GET", "/students/search?type=invalid&term=John", nil)
	w := httptest.NewRecorder()

	mockUsecase.On("SearchStudents", "invalid", "John").Return(nil, errors.New("Invalid search type"))

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	mockUsecase.AssertExpectations(t)
}

func TestSearchStudents_ServerError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockUsecase}

	router := gin.Default()
	router.GET("/students/search", handler.SearchStudents)

	req, _ := http.NewRequest("GET", "/students/search?type=name&term=John", nil)
	w := httptest.NewRecorder()

	mockUsecase.On("SearchStudents", "name", "John").Return(nil, errors.New("Database error"))

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	mockUsecase.AssertExpectations(t)
}


func TestCreateUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockService}

	router := gin.Default()
	router.POST("/users", handler.CreateUser)

	// Mock the expected behavior
	expectedUser := entity.Student{ID: 1, Name: "John Doe", Age: 20}
	mockService.On("AddUser", expectedUser).Return(nil)

	// Convert expectedUser to JSON
	userJSON, _ := json.Marshal(expectedUser)

	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(userJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockService.AssertExpectations(t)
}


func TestGetUsers(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockService}

	router := gin.Default()
	router.GET("/users", handler.GetUsers)

	// Mock the expected behavior
	expectedUsers := []entity.Student{
		{ID: 1, Name: "John Doe", Age: 20},
		{ID: 2, Name: "Jane Doe", Age: 22},
	}
	mockService.On("GetUsers").Return(expectedUsers, nil)

	req, _ := http.NewRequest("GET", "/users", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Validate response
	assert.Equal(t, http.StatusOK, w.Code)

	var actualUsers []entity.Student
	_ = json.Unmarshal(w.Body.Bytes(), &actualUsers)

	assert.Equal(t, expectedUsers, actualUsers)
	mockService.AssertExpectations(t)
}

func TestCreateUser_Failure(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockService}

	router := gin.Default()
	router.POST("/users", handler.CreateUser)

	// ❌ 1. Test Bad Request (Invalid JSON)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBufferString(`{invalid json}`))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code) // Expect 400 Bad Request

	// ❌ 2. Test Internal Server Error (Service Failure)
	expectedUser := entity.Student{ID: 1, Name: "John Doe", Age: 20}
	mockService.On("AddUser", expectedUser).Return(errors.New("service failure"))

	userJSON, _ := json.Marshal(expectedUser)
	req, _ = http.NewRequest("POST", "/users", bytes.NewBuffer(userJSON))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code) // Expect 500 Internal Server Error
	mockService.AssertExpectations(t)
}


func TestGetUsers_Failure(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockService := new(usecase.MockStudentService)
	handler := &StudentHandler{service: mockService}

	router := gin.Default()
	router.GET("/users", handler.GetUsers)

	// ❌ Simulate Service Failure
	mockService.On("GetUsers").Return(nil, errors.New("database error"))

	req, _ := http.NewRequest("GET", "/users", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code) // Expect 500 Internal Server Error
	mockService.AssertExpectations(t)
}
