package delivery

import (
	"backend/internal/entity"
	"backend/internal/usecase"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RoomHandler struct {
	roomService usecase.RoomService
}

func NewRoomHandler(roomService usecase.RoomService) *RoomHandler {
	return &RoomHandler{roomService: roomService}
}

func (h *RoomHandler) CreateRoom(c *gin.Context) {
	var room entity.Room
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set a default name if not provided
	if room.Name == "" {
		room.Name = fmt.Sprintf("%s - %s", room.Type, room.RoomNumber)
	}

	if err := h.roomService.CreateRoom(&room); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room"})
		return
	}

	c.JSON(http.StatusCreated, room)
}

func (h *RoomHandler) GetRooms(c *gin.Context) {
	fmt.Println("GetRooms called") // Debugging
	rooms, err := h.roomService.GetRooms()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rooms)
}

func (h *RoomHandler) JoinRoom(c *gin.Context) {
	roomID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid room ID"})
		return
	}

	studentID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	err = h.roomService.JoinRoom(uint(roomID), studentID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student joined successfully"})
}

func (h *RoomHandler) GetRoomsByType(c *gin.Context) {
	var request struct {
		Type string `json:"type"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	rooms, err := h.roomService.GetRoomsByType(request.Type)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rooms"})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

func (h *RoomHandler) DeleteRoom(c *gin.Context) {
	roomNumber := c.Param("room_number")

	err := h.roomService.DeleteRoomByRoomNumber(roomNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete room"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room deleted successfully"})
}

func (h *RoomHandler) GetRoomByNumber(c *gin.Context) {
	roomNumber := c.Param("number")
	if roomNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room number is required"})
		return
	}

	fmt.Printf("Looking for room with number: %s\n", roomNumber)
	room, err := h.roomService.GetRoomByNumber(roomNumber)
	if err != nil {
		fmt.Printf("Error finding room: %v\n", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	fmt.Printf("Found room: %+v\n", room)
	c.JSON(http.StatusOK, room)
}
