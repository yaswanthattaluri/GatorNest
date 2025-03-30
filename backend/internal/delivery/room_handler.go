package delivery

import (
    "net/http"
    "strconv"
    "fmt"
    "backend/internal/usecase"
    "github.com/gin-gonic/gin"
)

type RoomHandler struct {
    roomUsecase usecase.RoomUsecase
}

func NewRoomHandler(roomUsecase usecase.RoomUsecase) *RoomHandler {
    return &RoomHandler{roomUsecase: roomUsecase}
}

func (h *RoomHandler) CreateRoom(c *gin.Context) {
    var input struct {
        Name    string `json:"name"`
        Type    string `json:"type"`
        Vacancy int    `json:"vacancy"`
        Price   int    `json:"price"`
        RoomNumber int `json:"room_number"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    room, err := h.roomUsecase.CreateRoom(input.Name, input.Type, input.Vacancy, input.Price, input.RoomNumber)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room"})
        return
    }

    c.JSON(http.StatusCreated, room)
}

func (h *RoomHandler) GetRooms(c *gin.Context) {
    fmt.Println("GetRooms called")  // Debugging
    rooms, err := h.roomUsecase.GetRooms()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, rooms)
}


func (h *RoomHandler) JoinRoom(c *gin.Context) {
    roomID, err := strconv.Atoi(c.Param("room_id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid room ID"})
        return
    }

    studentID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    err = h.roomUsecase.JoinRoom(uint(roomID), studentID.(uint))
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

	rooms, err := h.roomUsecase.GetRoomsByType(request.Type)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rooms"})
		return
	}

	c.JSON(http.StatusOK, rooms)
}


func (h *RoomHandler) DeleteRoom(c *gin.Context) {
    roomNumber := c.Param("room_number")

    err := h.roomUsecase.DeleteRoomByRoomNumber(roomNumber)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete room"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Room deleted successfully"})
}

