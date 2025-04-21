package main

import (
	"backend/config"
	"backend/internal/delivery"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/usecase"

	"os"
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
	paymentRepo := repository.NewPaymentRepository(config.DB)
	studentHandler := delivery.NewUserHandler(studentService)

	roomRepo := repository.NewRoomRepository(config.DB)
	roomService := usecase.NewRoomService(roomRepo, studentRepo, paymentRepo)
	roomHandler := delivery.NewRoomHandler(roomService)

	// Initialize payment components
	paymentService := usecase.NewPaymentService(paymentRepo, studentRepo)
	paymentHandler := delivery.NewPaymentHandler(paymentService)

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
	auth.GET("/pending-dues", studentHandler.GetPendingDues)

	// auth.POST("/rooms/:room_id/join", roomHandler.JoinRoom)

	// Room Routes
	roomRoutes := r.Group("/api/rooms")
	{
		roomRoutes.POST("", roomHandler.CreateRoom)
		roomRoutes.DELETE("/number/:number", roomHandler.DeleteRoom)
	}

	// Protected Room Routes
	roomRoutes1 := r.Group("/api/rooms")
	roomRoutes1.Use(middleware.JWTAuthMiddleware())
	{
		roomRoutes1.GET("/number/:number", roomHandler.GetRoomByNumber)
		roomRoutes1.POST("/:id/join", roomHandler.JoinRoom)
		roomRoutes1.GET("/type/:type", roomHandler.GetRoomsByType)
	}

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

	// Maintenance routes
	maintenanceRepo := repository.NewMaintenanceRepository(config.DB)
	maintenanceService := usecase.NewMaintenanceService(maintenanceRepo)
	maintenanceHandler := delivery.NewMaintenanceHandler(maintenanceService)

	r.POST("/api/maintenance-requests", maintenanceHandler.SubmitRequest)

	maintenance := r.Group("/api/maintenance-requests")
	{
		maintenance.GET("", maintenanceHandler.GetAllRequests)
		maintenance.PUT("/:id", maintenanceHandler.UpdateMaintenanceRequest)
	}

	// Payment routes
	paymentRoutes := r.Group("/api/payments")
	paymentRoutes.Use(middleware.JWTAuthMiddleware())
	{
		paymentRoutes.POST("", paymentHandler.MakePayment)
		paymentRoutes.GET("/student/:studentId", paymentHandler.GetPaymentHistory)
		paymentRoutes.PUT("/pending-dues", paymentHandler.UpdatePendingDues)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
