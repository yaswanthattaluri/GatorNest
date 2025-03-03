package config

import (
	"backend/internal/entity"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := "host=localhost user=postgres password=1234 dbname=hosteldb port=5432 sslmode=disable"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	DB = database

	// Auto-migrate with new fields
	err = DB.AutoMigrate(&entity.Student{}, &entity.Room{})

	if err != nil {
		panic("Failed to migrate database!")
	}

	fmt.Println("Database connection successful!")
}
