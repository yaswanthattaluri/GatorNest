package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	// "github.com/stretchr/testify/mock"
)

func TestCreateRoom(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockRoomUsecase)
	handler := NewRoomHandler(mockUsecase)

	router := gin.Default()
	router.POST("/rooms", handler.CreateRoom)

	input := map[string]interface{}{
		"name":    "Room A",
		"type":    "2-bed",
		"vacancy": 2,
	}

	reqBody, _ := json.Marshal(input)
	req, _ := http.NewRequest("POST", "/rooms", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	mockRoom := &entity.Room{Name: "Room A", Type: "2-bed", Vacancy: 2}
	mockUsecase.On("CreateRoom", "Room A", "2-bed", 2).Return(mockRoom, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockUsecase.AssertExpectations(t)
}

func TestGetRooms(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockRoomUsecase)
	handler := NewRoomHandler(mockUsecase)

	router := gin.Default()
	router.GET("/rooms", handler.GetRooms)

	req, _ := http.NewRequest("GET", "/rooms", nil)
	w := httptest.NewRecorder()

	mockRooms := []entity.Room{
		{Name: "Room A", Type: "2-bed", Vacancy: 2},
		{Name: "Room B", Type: "1-bed", Vacancy: 1},
	}
	mockUsecase.On("GetRooms").Return(mockRooms, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockUsecase.AssertExpectations(t)
}

func TestJoinRoom(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockRoomUsecase)
	handler := NewRoomHandler(mockUsecase)

	router := gin.Default()
	router.POST("/rooms/:room_id/join", handler.JoinRoom)

	reqBody := `{"student_name": "John Doe"}`
	req, _ := http.NewRequest("POST", "/rooms/1/join", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	mockUsecase.On("JoinRoom", uint(1), "John Doe").Return(nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockUsecase.AssertExpectations(t)
}

func TestGetRoomsByType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUsecase := new(usecase.MockRoomUsecase)
	handler := NewRoomHandler(mockUsecase)

	router := gin.Default()
	router.POST("/rooms/filter", handler.GetRoomsByType)

	reqBody := `{"type": "2-bed"}`
	req, _ := http.NewRequest("POST", "/rooms/filter", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	mockRooms := []entity.Room{
		{Name: "Room A", Type: "2-bed", Vacancy: 2},
	}
	mockUsecase.On("GetRoomsByType", "2-bed").Return(mockRooms, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockUsecase.AssertExpectations(t)
}
