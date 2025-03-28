package main

import (
	"backend/config"
	"backend/internal/delivery"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/usecase"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func main() {
	r := gin.Default()

	// Custom CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	config.ConnectDatabase()

	db := config.DB
	studentRepo := repository.NewStudentRepository(db)
	studentService := usecase.NewUserService(studentRepo)

	studentHandler := delivery.NewUserHandler(studentService)
	roomRepo := repository.NewRoomRepository(config.DB)
	roomUsecase := usecase.NewRoomUsecase(roomRepo)

	roomHandler := delivery.NewRoomHandler(roomUsecase)

	// Public Routes
	r.POST("/api/student/register", studentHandler.CreateUser)
	r.POST("/api/student/login", studentHandler.LoginUser)

	// Protected Routes (Require authentication via JWT)
	auth := r.Group("/api/student")
	auth.Use(middleware.JWTAuthMiddleware())
	auth.GET("/get-all", studentHandler.GetUsers)
	auth.PUT("/profile", studentHandler.UpdateProfile)

	// Room Routes
	roomRoutes := r.Group("/api/rooms")
	{
		roomRoutes.POST("/", roomHandler.CreateRoom)
		roomRoutes.GET("/", roomHandler.GetRooms)
		roomRoutes.POST("/:room_id/join", roomHandler.JoinRoom)
		roomRoutes.POST("/filter", roomHandler.GetRoomsByType)
	}

	r.Run(":8080")
}
