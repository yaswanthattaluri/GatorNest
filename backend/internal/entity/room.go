package entity

import (
    "github.com/lib/pq"
    "gorm.io/gorm"
)

type Room struct {
    gorm.Model
    Name      string        `json:"name" gorm:"unique;not null"`
    Type      string        `json:"type"`
    Students  pq.StringArray `json:"students" gorm:"type:text[]"`
    Vacancy   int           `json:"vacancy"`
}
