package main

import (
	"backend/config"
	"backend/internal/delivery"
	"backend/internal/usecase"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	// Initialize Database
	config.ConnectDatabase()

	studentService := usecase.NewUserService()
	studentHandler := delivery.NewUserHandler(studentService)

	r.POST("/api/student/register", studentHandler.CreateUser)
	r.GET("/api/student/get-all", studentHandler.GetUsers)
	r.POST("/api/student/login", studentHandler.LoginUser)

	r.Run(":8080")
}
