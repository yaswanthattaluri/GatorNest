package delivery_test

import (
	"backend/internal/delivery"
	"backend/internal/entity"
	localmock "backend/internal/usecase/mock"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func setupMaintenanceRouter(handler *delivery.MaintenanceHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/maintenance-requests", handler.SubmitRequest)
	r.GET("/api/maintenance-requests", handler.GetAllRequests)
	r.PUT("/api/maintenance-requests/:id", handler.UpdateMaintenanceRequest)
	return r
}

func TestSubmitRequest(t *testing.T) {
	mockService := new(localmock.MaintenanceService)
	handler := delivery.NewMaintenanceHandler(mockService)

	request := entity.MaintenanceRequest{
		Name:              "Test request",
		RoomNumber:        "101",
		Category:          "Plumbing",
		SubCategory:       "Leak",
		Description:       "Test description",
		Priority:          "High",
		PermissionToEnter: "Yes",
		Status:            "New",
		Completed:         "-",
		TechnicianNotes:   "-",
	}

	mockService.On("SubmitRequest", request).Return(nil)

	body, _ := json.Marshal(request)
	req, _ := http.NewRequest("POST", "/api/maintenance-requests", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r := setupMaintenanceRouter(handler)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestGetAllRequests(t *testing.T) {
	mockService := new(localmock.MaintenanceService)
	handler := delivery.NewMaintenanceHandler(mockService)

	requests := []entity.MaintenanceRequest{
		{ID: 1, Description: "Request 1", Status: "New"},
		{ID: 2, Description: "Request 2", Status: "In Progress"},
	}

	mockService.On("GetAllRequests").Return(requests, nil)

	req, _ := http.NewRequest("GET", "/api/maintenance-requests", nil)
	w := httptest.NewRecorder()
	r := setupMaintenanceRouter(handler)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestUpdateMaintenanceRequest(t *testing.T) {
	mockService := new(localmock.MaintenanceService)
	handler := delivery.NewMaintenanceHandler(mockService)

	request := entity.MaintenanceRequest{
		Status:          "Completed",
		TechnicianNotes: "Fixed the issue",
		Completed:       "2024-04-20",
	}

	mockService.On("GetRequestByID", mock.Anything, "1").Return(nil)
	mockService.On("UpdateRequest", mock.Anything).Return(nil)

	body, _ := json.Marshal(request)
	req, _ := http.NewRequest("PUT", "/api/maintenance-requests/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r := setupMaintenanceRouter(handler)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}
