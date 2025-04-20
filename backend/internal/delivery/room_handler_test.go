package delivery

import (
	"backend/internal/entity"
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

type MockRoomService struct {
	mock.Mock
}

func (m *MockRoomService) CreateRoom(room *entity.Room) error {
	args := m.Called(room)
	return args.Error(0)
}

func (m *MockRoomService) GetAllRooms() ([]entity.Room, error) {
	args := m.Called()
	return args.Get(0).([]entity.Room), args.Error(1)
}

func (m *MockRoomService) GetRoomByID(id uint) (*entity.Room, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Room), args.Error(1)
}

func (m *MockRoomService) GetRoomByNumber(roomNumber string) (*entity.Room, error) {
	args := m.Called(roomNumber)
	return args.Get(0).(*entity.Room), args.Error(1)
}

func (m *MockRoomService) JoinRoom(roomID uint, studentID uint) error {
	args := m.Called(roomID, studentID)
	return args.Error(0)
}

func (m *MockRoomService) GetRooms() ([]entity.Room, error) {
	args := m.Called()
	return args.Get(0).([]entity.Room), args.Error(1)
}

func (m *MockRoomService) GetRoomsByType(roomType string) ([]entity.Room, error) {
	args := m.Called(roomType)
	return args.Get(0).([]entity.Room), args.Error(1)
}

func (m *MockRoomService) DeleteRoomByRoomNumber(roomNumber string) error {
	args := m.Called(roomNumber)
	return args.Error(0)
}

func TestCreateRoom(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockRoomService)
	handler := NewRoomHandler(mockService)

	router := gin.Default()
	router.POST("/rooms", handler.CreateRoom)

	room := &entity.Room{
		RoomNumber: "101",
		Type:       "2B2B",
		Price:      1000.00,
		Capacity:   2,
	}

	reqBody, _ := json.Marshal(room)
	req, _ := http.NewRequest("POST", "/rooms", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	mockService.On("CreateRoom", room).Return(nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockService.AssertExpectations(t)
}

func TestGetRooms(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockRoomService)
	handler := NewRoomHandler(mockService)

	router := gin.Default()
	router.GET("/rooms", handler.GetRooms)

	req, _ := http.NewRequest("GET", "/rooms", nil)
	w := httptest.NewRecorder()

	mockRooms := []entity.Room{
		{
			RoomNumber:       "101",
			Type:             "2B2B",
			Price:            1000.00,
			Capacity:         2,
			StudentsEnrolled: 1,
		},
		{
			RoomNumber:       "102",
			Type:             "1B1B",
			Price:            800.00,
			Capacity:         1,
			StudentsEnrolled: 0,
		},
	}
	mockService.On("GetRooms").Return(mockRooms, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestJoinRoom(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockRoomService)
	handler := NewRoomHandler(mockService)

	router := gin.Default()
	router.POST("/rooms/:room_id/join", handler.JoinRoom)

	reqBody := `{"student_name": "John Doe"}`
	req, _ := http.NewRequest("POST", "/rooms/1/join", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	mockService.On("JoinRoom", uint(1), uint(1)).Return(nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestGetRoomsByType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockRoomService)
	handler := NewRoomHandler(mockService)

	router := gin.Default()
	router.POST("/rooms/filter", handler.GetRoomsByType)

	reqBody := `{"type": "2-bed"}`
	req, _ := http.NewRequest("POST", "/rooms/filter", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	mockRooms := []entity.Room{
		{
			RoomNumber:       "101",
			Type:             "2B2B",
			Price:            1000.00,
			Capacity:         2,
			StudentsEnrolled: 1,
		},
	}
	mockService.On("GetRoomsByType", "2-bed").Return(mockRooms, nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestDeleteRoom(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockRoomService)
	handler := NewRoomHandler(mockService)

	router := gin.Default()
	router.DELETE("/rooms/:room_id", handler.DeleteRoom)

	req, _ := http.NewRequest("DELETE", "/rooms/1", nil)
	w := httptest.NewRecorder()

	mockService.On("DeleteRoomByRoomNumber", "1").Return(nil)

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}

func TestDeleteRoom_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockRoomService)
	handler := NewRoomHandler(mockService)

	router := gin.Default()
	router.DELETE("/rooms/:room_id", handler.DeleteRoom)

	req, _ := http.NewRequest("DELETE", "/rooms/999", nil)
	w := httptest.NewRecorder()

	mockService.On("DeleteRoomByRoomNumber", "999").Return(errors.New("room not found"))

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
	mockService.AssertExpectations(t)
}

func TestDeleteRoom_ServerError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockRoomService)
	handler := NewRoomHandler(mockService)

	router := gin.Default()
	router.DELETE("/rooms/:room_id", handler.DeleteRoom)

	req, _ := http.NewRequest("DELETE", "/rooms/1", nil)
	w := httptest.NewRecorder()

	mockService.On("DeleteRoomByRoomNumber", "1").Return(errors.New("internal server error"))

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	mockService.AssertExpectations(t)
}
