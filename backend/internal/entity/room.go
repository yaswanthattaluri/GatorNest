package entity

import "gorm.io/gorm"

type Room struct {
	gorm.Model
	Name             string    `json:"name" gorm:"not null"`
	RoomNumber       string    `json:"room_number"`
	Type             string    `json:"type"`
	Price            float64   `json:"price"`
	Students         []Student `json:"students" gorm:"many2many:room_students"`
	StudentsEnrolled int       `json:"students_enrolled"`
	Capacity         int       `json:"vacancy"`
}
