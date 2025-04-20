package config

import (
	"backend/internal/entity"
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=gatornest port=5432 sslmode=disable"
	}

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	// Auto-migrate with new fields
	err = DB.AutoMigrate(&entity.Student{}, &entity.Room{}, &entity.Admin{}, &entity.MaintenanceRequest{}, &entity.Payment{})

	if err != nil {
		panic("Failed to migrate database!")
	}

	fmt.Println("Database connected successfully!")
}
