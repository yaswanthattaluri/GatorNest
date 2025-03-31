package delivery

import (
	"backend/internal/entity"
	// "backend/internal/usecase"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock AdminService
type MockAdminService struct {
	mock.Mock
}

func (m *MockAdminService) RegisterAdmin(admin entity.Admin) error {
	args := m.Called(admin)
	return args.Error(0)
}

func (m *MockAdminService) LoginAdmin(email, password string) (*entity.Admin, string, error) {
	args := m.Called(email, password)
	return args.Get(0).(*entity.Admin), args.String(1), args.Error(2)
}

func (m *MockAdminService) GetAllAdmins() ([]entity.Admin, error) {
	args := m.Called()
	return args.Get(0).([]entity.Admin), args.Error(1)
}

// Test RegisterAdmin (Successful)
func TestRegisterAdmin_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockAdminService)
	handler := NewAdminHandler(mockService)

	router := gin.Default()
	router.POST("/admin/register", handler.RegisterAdmin)

	admin := entity.Admin{Name: "Admin User", Email: "admin@example.com", Password: "securepass"}
	mockService.On("RegisterAdmin", admin).Return(nil)

	body, _ := json.Marshal(admin)
	req, _ := http.NewRequest("POST", "/admin/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockService.AssertExpectations(t)
}

// Test RegisterAdmin (Failure)
func TestRegisterAdmin_Failure(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockAdminService)
	handler := NewAdminHandler(mockService)

	router := gin.Default()
	router.POST("/admin/register", handler.RegisterAdmin)

	admin := entity.Admin{Name: "Admin User", Email: "admin@example.com", Password: "securepass"}
	mockService.On("RegisterAdmin", admin).Return(errors.New("database error"))

	body, _ := json.Marshal(admin)
	req, _ := http.NewRequest("POST", "/admin/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	mockService.AssertExpectations(t)
}

// Test RegisterAdmin (Invalid JSON)
func TestRegisterAdmin_InvalidJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockAdminService)
	handler := NewAdminHandler(mockService)

	router := gin.Default()
	router.POST("/admin/register", handler.RegisterAdmin)

	req, _ := http.NewRequest("POST", "/admin/register", bytes.NewBuffer([]byte("{invalid json}")))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	mockService.AssertNotCalled(t, "RegisterAdmin")
}

// Test LoginAdmin (Successful)
func TestLoginAdmin_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockAdminService)
	handler := NewAdminHandler(mockService)

	router := gin.Default()
	router.POST("/admin/login", handler.LoginAdmin)

	loginData := map[string]string{"email": "admin@example.com", "password": "securepass"}
	mockAdmin := &entity.Admin{ID: 1, Email: "admin@example.com", Name: "Admin User"}
	mockToken := "mocked.jwt.token"

	mockService.On("LoginAdmin", "admin@example.com", "securepass").Return(mockAdmin, mockToken, nil)

	body, _ := json.Marshal(loginData)
	req, _ := http.NewRequest("POST", "/admin/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

// Test LoginAdmin (Invalid Credentials)
// func TestLoginAdmin_InvalidCredentials(t *testing.T) {
// 	gin.SetMode(gin.TestMode)
// 	mockService := new(MockAdminService)
// 	handler := NewAdminHandler(mockService)

// 	router := gin.Default()
// 	router.POST("/admin/login", handler.LoginAdmin)

// 	loginData := map[string]string{"email": "wrong@example.com", "password": "wrongpass"}
// 	mockService.On("LoginAdmin", "wrong@example.com", "wrongpass").Return(nil, "", errors.New("invalid email or password"))

// 	body, _ := json.Marshal(loginData)
// 	req, _ := http.NewRequest("POST", "/admin/login", bytes.NewBuffer(body))
// 	req.Header.Set("Content-Type", "application/json")

// 	w := httptest.NewRecorder()
// 	router.ServeHTTP(w, req)

// 	assert.Equal(t, http.StatusUnauthorized, w.Code)
// 	mockService.AssertExpectations(t)
// }

// Test LoginAdmin (Missing Fields)
// func TestLoginAdmin_MissingFields(t *testing.T) {
// 	gin.SetMode(gin.TestMode)
// 	mockService := new(MockAdminService)
// 	handler := NewAdminHandler(mockService)

// 	router := gin.Default()
// 	router.POST("/admin/login", handler.LoginAdmin)

// 	req, _ := http.NewRequest("POST", "/admin/login", bytes.NewBuffer([]byte("{}")))
// 	req.Header.Set("Content-Type", "application/json")

// 	w := httptest.NewRecorder()
// 	router.ServeHTTP(w, req)

// 	assert.Equal(t, http.StatusBadRequest, w.Code)
// 	mockService.AssertNotCalled(t, "LoginAdmin")
// }

// Test GetAllAdmins (Successful)
func TestGetAllAdmins_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockAdminService)
	handler := NewAdminHandler(mockService)

	router := gin.Default()
	router.GET("/admin/all", handler.GetAllAdmins)

	mockAdmins := []entity.Admin{
		{ID: 1, Name: "Admin1", Email: "admin1@example.com"},
		{ID: 2, Name: "Admin2", Email: "admin2@example.com"},
	}
	mockService.On("GetAllAdmins").Return(mockAdmins, nil)

	req, _ := http.NewRequest("GET", "/admin/all", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

// Test GetAllAdmins (Failure)
func TestGetAllAdmins_Failure(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockAdminService)
	handler := NewAdminHandler(mockService)

	router := gin.Default()
	router.GET("/admin/all", handler.GetAllAdmins)

	mockService.On("GetAllAdmins").Return(nil, errors.New("database error"))

	req, _ := http.NewRequest("GET", "/admin/all", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	mockService.AssertExpectations(t)
}
