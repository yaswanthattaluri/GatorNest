package main

import (
	"backend/config"
	"backend/internal/delivery"
	"backend/internal/middleware"
	"backend/internal/usecase"
	"backend/internal/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	config.ConnectDatabase()

	db := config.DB 
	studentRepo := repository.NewStudentRepository(db)
	studentService := usecase.NewUserService(studentRepo)


	studentHandler := delivery.NewUserHandler(studentService)
	roomRepo := repository.NewRoomRepository(config.DB)
	roomUsecase := usecase.NewRoomUsecase(roomRepo) 

	roomHandler := delivery.NewRoomHandler(roomUsecase)


	// Public Routes (No authentication required)
	r.POST("/api/student/register", studentHandler.CreateUser)
	r.POST("/api/student/login", studentHandler.LoginUser)

	// Protected Routes (Require authentication via JWT)
	auth := r.Group("/api/student")
	auth.Use(middleware.JWTAuthMiddleware())
	auth.GET("/get-all", studentHandler.GetUsers)
	auth.PUT("/profile", studentHandler.UpdateProfile)

	// Public Routes
	roomRoutes := r.Group("/api/rooms")
    {
        roomRoutes.POST("/", roomHandler.CreateRoom)
        roomRoutes.GET("/", roomHandler.GetRooms)
        roomRoutes.POST("/:room_id/join", roomHandler.JoinRoom)
		roomRoutes.POST("/filter", roomHandler.GetRoomsByType)
    }
	
	r.Run(":8080")
}
