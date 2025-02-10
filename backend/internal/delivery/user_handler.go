package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
	"github.com/gin-gonic/gin"
	"net/http"
)

type StudentHandler struct {
	service *usecase.StudentService
}

func NewUserHandler(service *usecase.StudentService) *StudentHandler {
	return &StudentHandler{service: service}
}

func (h *StudentHandler) CreateUser(c *gin.Context) {
	var user entity.Student
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	h.service.AddUser(user)
	c.JSON(http.StatusCreated, gin.H{"message": "User received", "user": user})
}

func (h *StudentHandler) GetUsers(c *gin.Context) {
	c.JSON(http.StatusOK, h.service.GetUsers())
}
