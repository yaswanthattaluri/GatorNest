package config

import (
	"backend/internal/entity"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := "host=localhost user=postgres password=123 dbname=hosteldb port=5433 sslmode=disable"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	// Assign database instance to global variable
	DB = database

	// Run AutoMigrate to create/update tables
	err = DB.AutoMigrate(&entity.Student{})
	if err != nil {
		panic("Failed to migrate database!")
	}

	fmt.Println("Database connection successful!")
}
