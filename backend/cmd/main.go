package main

import (
	"backend/config"
	"backend/internal/delivery"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/usecase"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	// "net/http"
)

func main() {
	r := gin.Default()

	// Custom CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Frontend URL
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
	roomUsecase := usecase.NewRoomUsecase(roomRepo, studentRepo)
	roomHandler := delivery.NewRoomHandler(roomUsecase)

	// Public Routes
	r.POST("/api/student/register", studentHandler.CreateUser)
	r.POST("/api/student/login", studentHandler.LoginUser)

	r.GET("/api/students/search", studentHandler.SearchStudents)
	r.GET("/api/rooms", roomHandler.GetRooms)

	// Protected Routes (Require authentication via JWT)
	auth := r.Group("/api/student")
	auth.Use(middleware.JWTAuthMiddleware())
	auth.GET("/get-all", studentHandler.GetUsers)
	auth.PUT("/profile", studentHandler.UpdateProfile)
	auth.GET("/students/filter", studentHandler.GetFilteredStudents)

	// auth.POST("/rooms/:room_id/join", roomHandler.JoinRoom)

	// Room Routes
	roomRoutes := r.Group("/api/rooms")

	// roomRoutes.GET("/", roomHandler.GetRooms)  // Correctly maps GET /api/rooms
	roomRoutes.POST("/", roomHandler.CreateRoom)
	roomRoutes.POST("/:room_id/join", roomHandler.JoinRoom)
	roomRoutes.DELETE("/number/:room_number", roomHandler.DeleteRoom) // Corrected delete route

	// Protected room routes (Admin Only)
	// protectedRoomRoutes := roomRoutes.Group("/")
	// protectedRoomRoutes.Use(middleware.AdminAuthMiddleware())

	// Initialize repositories & usecases
	adminRepo := repository.NewAdminRepository(db)
	adminUsecase := usecase.NewAdminService(adminRepo)
	adminHandler := delivery.NewAdminHandler(adminUsecase)

	adminRoutes := r.Group("/api/admin")
	{
		adminRoutes.POST("/register", adminHandler.RegisterAdmin)
		adminRoutes.POST("/login", adminHandler.LoginAdmin)
		adminRoutes.GET("/all", adminHandler.GetAllAdmins)
	}

	//maintenance routes
	maintenanceRepo := repository.NewMaintenanceRepository(config.DB)
	maintenanceService := usecase.NewMaintenanceService(maintenanceRepo)
	maintenanceHandler := delivery.NewMaintenanceHandler(maintenanceService)

	r.POST("/api/maintenance-requests", maintenanceHandler.SubmitRequest)

	maintenance := r.Group("/api/maintenance-requests")
	{
		maintenance.GET("", maintenanceHandler.GetAllRequests)
		maintenance.PUT("/:id", maintenanceHandler.UpdateMaintenanceRequest)
	}

	r.Run(":8080")
}
