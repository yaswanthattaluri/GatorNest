package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	service usecase.PaymentService
}

func NewPaymentHandler(s usecase.PaymentService) *PaymentHandler {
	return &PaymentHandler{s}
}

func (h *PaymentHandler) MakePayment(c *gin.Context) {
	var payment entity.Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get student_id from JWT token
	studentID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	payment.StudentID = studentID.(uint)
	payment.Date = time.Now()

	if err := h.service.MakePayment(&payment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Payment failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment successful"})
}

func (h *PaymentHandler) GetPaymentHistory(c *gin.Context) {
	// Get student_id from JWT token
	studentID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	payments, err := h.service.GetPaymentHistory(studentID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch payment history"})
		return
	}

	c.JSON(http.StatusOK, payments)
}

func (h *PaymentHandler) UpdatePendingDues(c *gin.Context) {
	var input struct {
		StudentID uint    `json:"student_id"`
		Amount    float64 `json:"amount"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdatePendingDues(input.StudentID, input.Amount); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pending dues updated successfully"})
}
