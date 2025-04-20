package repository

import (
	"backend/internal/entity"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type RoomRepository interface {
	CreateRoom(room *entity.Room) error
	GetRooms() ([]entity.Room, error)
	GetRoomByID(roomID uint) (*entity.Room, error)
	GetRoomByNumber(roomNumber string) (*entity.Room, error)
	UpdateRoom(room *entity.Room) error
	FindRoomsByType(roomType string) ([]entity.Room, error)
	DeleteRoomByRoomNumber(roomNumber string) error
	JoinRoom(roomID uint, studentID uint) error
}

type roomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) RoomRepository {
	return &roomRepository{db: db}
}

func (r *roomRepository) CreateRoom(room *entity.Room) error {
	return r.db.Create(room).Error
}

func (r *roomRepository) GetRoomByNumber(roomNumber string) (*entity.Room, error) {
	var room entity.Room
	fmt.Printf("Querying database for room number: %s\n", roomNumber)
	result := r.db.Where("room_number = ?", roomNumber).First(&room)
	if result.Error != nil {
		fmt.Printf("Database error: %v\n", result.Error)
		return nil, errors.New("room not found")
	}
	fmt.Printf("Found room in database: %+v\n", room)
	return &room, nil
}

func (r *roomRepository) DeleteRoomByRoomNumber(roomNumber string) error {
	return r.db.Where("room_number = ?", roomNumber).Delete(&entity.Room{}).Error
}

func (r *roomRepository) GetRooms() ([]entity.Room, error) {
	var rooms []entity.Room
	err := r.db.Preload("Students").Find(&rooms).Error // Preload students
	return rooms, err
}

func (r *roomRepository) GetRoomByID(id uint) (*entity.Room, error) {
	var room entity.Room
	err := r.db.Preload("Students").First(&room, id).Error // Preload students
	return &room, err
}

func (r *roomRepository) UpdateRoom(room *entity.Room) error {
	return r.db.Save(room).Error
}

func (r *roomRepository) FindRoomsByType(roomType string) ([]entity.Room, error) {
	var rooms []entity.Room
	err := r.db.Where("type = ?", roomType).Preload("Students").Find(&rooms).Error
	return rooms, err
}

func (r *roomRepository) JoinRoom(roomID uint, studentID uint) error {
	// Start a transaction
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Get the room with preloaded students
	var room entity.Room
	if err := tx.Preload("Students").First(&room, roomID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Check if room is full
	if room.StudentsEnrolled >= room.Capacity {
		tx.Rollback()
		return errors.New("room is full")
	}

	// Get the student
	var student entity.Student
	if err := tx.First(&student, studentID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Add student to room's students list
	if err := tx.Model(&room).Association("Students").Append(&student); err != nil {
		tx.Rollback()
		return err
	}

	// Update student's room_id
	if err := tx.Model(&student).Update("room_id", roomID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Increment students enrolled and decrease vacancy
	if err := tx.Model(&room).Updates(map[string]interface{}{
		"students_enrolled": room.StudentsEnrolled + 1,
		"vacancy":           room.Capacity - (room.StudentsEnrolled + 1),
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}
