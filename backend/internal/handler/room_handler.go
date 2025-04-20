package handler

import (
	"backend/internal/entity"
	"backend/internal/usecase"
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

func (h *RoomHandler) RegisterRoutes(router *gin.Engine) {
	rooms := router.Group("/api/rooms")
	{
		rooms.POST("", h.CreateRoom)
		rooms.GET("", h.GetAllRooms)
		rooms.GET("/:id", h.GetRoomByID)
		rooms.GET("/number/:number", h.GetRoomByNumber)
		rooms.POST("/:id/join", h.JoinRoom)
		rooms.GET("/type/:type", h.GetRoomsByType)
		rooms.DELETE("/number/:number", h.DeleteRoomByNumber)
	}
}

func (h *RoomHandler) CreateRoom(c *gin.Context) {
	var room entity.Room
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.CreateRoom(&room); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, room)
}

func (h *RoomHandler) GetAllRooms(c *gin.Context) {
	rooms, err := h.roomService.GetAllRooms()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

func (h *RoomHandler) GetRoomByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid room ID"})
		return
	}

	room, err := h.roomService.GetRoomByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	c.JSON(http.StatusOK, room)
}

func (h *RoomHandler) GetRoomByNumber(c *gin.Context) {
	roomNumber := c.Param("number")
	if roomNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room number is required"})
		return
	}

	room, err := h.roomService.GetRoomByNumber(roomNumber)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	c.JSON(http.StatusOK, room)
}

func (h *RoomHandler) JoinRoom(c *gin.Context) {
	roomID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid room ID"})
		return
	}

	var request struct {
		StudentID uint `json:"student_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.JoinRoom(uint(roomID), request.StudentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully joined the room"})
}

func (h *RoomHandler) GetRoomsByType(c *gin.Context) {
	roomType := c.Param("type")
	if roomType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room type is required"})
		return
	}

	rooms, err := h.roomService.GetRoomsByType(roomType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

func (h *RoomHandler) DeleteRoomByNumber(c *gin.Context) {
	roomNumber := c.Param("number")
	if roomNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room number is required"})
		return
	}

	if err := h.roomService.DeleteRoomByRoomNumber(roomNumber); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room deleted successfully"})
}
