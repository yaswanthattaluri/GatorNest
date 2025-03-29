package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("secretKey123")

type StudentHandler struct {
	service usecase.StudentService
}

func NewUserHandler(service usecase.StudentService) *StudentHandler {
	return &StudentHandler{service: service}
}

func (h *StudentHandler) CreateUser(c *gin.Context) {
	var student entity.Student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.AddUser(student)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func (h *StudentHandler) GetUsers(c *gin.Context) {
	users, err := h.service.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	var studentResponses []gin.H
	for _, student := range users {
		studentResponses = append(studentResponses, gin.H{
			"id":                student.ID,
			"name":              student.Name,
			"gender":            student.Gender,
			"room_id":           student.RoomID,
			"sleep_schedule":    formatValue(string(student.Preference)),
			"cleanliness":       formatValue(string(student.Cleanliness)),
			"food_preference":   formatValue(string(student.FoodPref)),
			"social_preference": formatValue(string(student.PeopleOver)),
			"language_pref":     formatValue(string(student.LangPref)),
		})
	}

	c.JSON(http.StatusOK, studentResponses)
}

func formatValue(value string) string {
	if value == "" {
		return "Not Specified"
	}
	return value
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

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Return token
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   tokenString,
		"user":    user,
	})
}

func (h *StudentHandler) UpdateProfile(c *gin.Context) {
	var profile entity.Student
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	id, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID missing"})
		return
	}

	if err := h.service.UpdateProfile(id.(uint), profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully!"})
}

func (h *StudentHandler) GetFilteredStudents(c *gin.Context) {
	gender := c.Query("gender")
	preference := c.Query("preference")
	foodPreference := c.Query("food_preference")

	students, err := h.service.GetFilteredStudents(gender, preference, foodPreference)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve students"})
		return
	}

	var studentResponses []gin.H
	for _, student := range students {
		studentResponses = append(studentResponses, gin.H{
			"id":                student.ID,
			"name":              student.Name,
			"gender":            student.Gender,
			"room_id":           student.RoomID,
			"sleep_schedule":    formatValue(string(student.Preference)),
			"cleanliness":       formatValue(string(student.Cleanliness)),
			"food_preference":   formatValue(string(student.FoodPref)),
			"social_preference": formatValue(string(student.PeopleOver)),
			"language_pref":     formatValue(string(student.LangPref)),
		})
	}

	c.JSON(http.StatusOK, studentResponses)
}


func (h *StudentHandler) SearchStudents(c *gin.Context) {
    searchType := c.Query("type")  // name, studentId, or roomNumber
    searchTerm := c.Query("term")

    if searchType == "" || searchTerm == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Both 'type' and 'term' query parameters are required"})
        return
    }

    students, err := h.service.SearchStudents(searchType, searchTerm)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching student records"})
        return
    }

    c.JSON(http.StatusOK, students)
}
