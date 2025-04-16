package entity

import "time"

type MaintenanceRequest struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	Name              string    `json:"name"`
	RoomNumber        string    `json:"room_number"`
	Category          string    `json:"category"`
	SubCategory       string    `json:"sub_category"`
	Description       string    `json:"description"`
	Priority          string    `json:"priority"`
	PermissionToEnter string    `json:"permission_to_enter"`
	Status            string    `json:"status"`           // e.g. Pending, In Progress, Completed
	Completed         string    `json:"completed"`        // Date or "-"
	TechnicianNotes   string    `json:"technician_notes"` // Notes or "-"
}
