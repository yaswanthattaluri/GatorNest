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
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func setupRouter(handler *delivery.PaymentHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	auth := r.Group("/api/payments")
	auth.Use(func(c *gin.Context) {
		c.Set("user_id", uint(1)) // Mock authenticated user with ID = 1
		c.Next()
	})
	{
		auth.POST("", handler.MakePayment)
		auth.GET("/student/:studentId", handler.GetPaymentHistory)
		auth.PUT("/pending-dues", handler.UpdatePendingDues)
	}
	return r
}

func TestMakePayment(t *testing.T) {
	mockService := new(localmock.PaymentService)
	handler := delivery.NewPaymentHandler(mockService)

	payment := entity.Payment{
		Amount: 100.0,
	}

	mockService.On("MakePayment", mock.AnythingOfType("*entity.Payment")).Return(nil)

	body, _ := json.Marshal(payment)
	req, _ := http.NewRequest("POST", "/api/payments", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r := setupRouter(handler)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Payment successful")
}

func TestGetPaymentHistory(t *testing.T) {
	mockService := new(localmock.PaymentService)
	handler := delivery.NewPaymentHandler(mockService)

	payments := []entity.Payment{
		{ID: 1, StudentID: 1, Amount: 100.0, Status: "Completed", Date: time.Now()},
	}
	mockService.On("GetPaymentHistory", uint(1)).Return(payments, nil)

	req, _ := http.NewRequest("GET", "/api/payments/student/1", nil)
	w := httptest.NewRecorder()
	r := setupRouter(handler)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdatePendingDues(t *testing.T) {
	mockService := new(localmock.PaymentService)
	handler := delivery.NewPaymentHandler(mockService)

	mockService.On("UpdatePendingDues", uint(1), 50.0).Return(nil)

	body := map[string]interface{}{
		"student_id": 1,
		"amount":     50.0,
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("PUT", "/api/payments/pending-dues", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r := setupRouter(handler)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Pending dues updated successfully")
}
