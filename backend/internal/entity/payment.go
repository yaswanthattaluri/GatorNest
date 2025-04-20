package entity

import "time"

type Payment struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	StudentID uint      `json:"student_id"`
	Amount    float64   `json:"amount"`
	Status    string    `json:"status"`
	Date      time.Time `json:"date"`
}
