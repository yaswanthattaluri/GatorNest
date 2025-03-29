package entity

import "gorm.io/gorm"

type Room struct {
    gorm.Model
    Name      string     `json:"name" gorm:"unique;not null"`
    Type      string     `json:"type"`
    Students  []Student  `json:"students" gorm:"foreignKey:RoomID"` // One-to-Many
    Vacancy   int        `json:"vacancy"`
    Price     int        `json:"price"`
    RoomNumber int       `json:"room_number"`
}
