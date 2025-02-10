package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
<<<<<<< HEAD
	"github.com/gin-gonic/gin"
	"net/http"
=======
	"net/http"

	"github.com/gin-gonic/gin"
>>>>>>> 49d2a8b (Database integration, API fetch in frontend, APIs configuration in backend)
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

<<<<<<< HEAD
	h.service.AddUser(user)
	c.JSON(http.StatusCreated, gin.H{"message": "User received", "user": user})
}

func (h *StudentHandler) GetUsers(c *gin.Context) {
	c.JSON(http.StatusOK, h.service.GetUsers())
=======
	if err := h.service.AddUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully!"})
}

func (h *StudentHandler) GetUsers(c *gin.Context) {
	users, err := h.service.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *StudentHandler) LoginUser(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user, err := h.service.LoginUser(loginData.Email, loginData.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": user})
>>>>>>> 49d2a8b (Database integration, API fetch in frontend, APIs configuration in backend)
}
