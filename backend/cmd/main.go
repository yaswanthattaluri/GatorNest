package main

import (
	"backend/internal/delivery"
	"backend/internal/usecase"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	studentService := usecase.NewUserService()
	studentHandler := delivery.NewUserHandler(studentService)

	r.POST("/api/student/register", studentHandler.CreateUser)
	r.GET("/api/student/get-all", studentHandler.GetUsers)

	r.Run(":8080")
}
