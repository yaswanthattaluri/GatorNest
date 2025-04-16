package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MaintenanceHandler struct {
	service usecase.MaintenanceService
}

func NewMaintenanceHandler(service usecase.MaintenanceService) *MaintenanceHandler {
	return &MaintenanceHandler{service: service}
}

func (h *MaintenanceHandler) SubmitRequest(c *gin.Context) {
	var request entity.MaintenanceRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	request.Status = "Pending"
	request.Completed = "-"
	request.TechnicianNotes = "-"

	if err := h.service.SubmitRequest(request); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit request"})
		return
	}
	c.JSON(http.StatusOK, request)
}

func (h *MaintenanceHandler) GetAllRequests(c *gin.Context) {
	requests, err := h.service.GetAllRequests()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch requests"})
		return
	}
	c.JSON(http.StatusOK, requests)
}

func (h *MaintenanceHandler) UpdateMaintenanceRequest(c *gin.Context) {
	id := c.Param("id")
	var request entity.MaintenanceRequest

	if err := h.service.GetRequestByID(&request, id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
		return
	}

	var input struct {
		Status          string `json:"status"`
		TechnicianNotes string `json:"technicianNotes"`
		Completed       string `json:"completed"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	request.Status = input.Status
	request.TechnicianNotes = input.TechnicianNotes
	request.Completed = input.Completed

	if err := h.service.UpdateRequest(&request); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update request"})
		return
	}

	c.JSON(http.StatusOK, request)
}
