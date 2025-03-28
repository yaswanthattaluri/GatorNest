package repository

import (
    "backend/internal/entity"
    "gorm.io/gorm"
)

type RoomRepository interface {
	CreateRoom(room *entity.Room) error
	GetRooms() ([]entity.Room, error)
	GetRoomByID(id uint) (*entity.Room, error)
	UpdateRoom(room *entity.Room) error
	FindRoomsByType(roomType string) ([]entity.Room, error)
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

func (r *roomRepository) GetRooms() ([]entity.Room, error) {
	var rooms []entity.Room
	err := r.db.Find(&rooms).Error
	return rooms, err
}

func (r *roomRepository) GetRoomByID(id uint) (*entity.Room, error) {
	var room entity.Room
	err := r.db.First(&room, id).Error
	return &room, err
}

func (r *roomRepository) UpdateRoom(room *entity.Room) error {
	return r.db.Save(room).Error
}

func (r *roomRepository) FindRoomsByType(roomType string) ([]entity.Room, error) {
	var rooms []entity.Room
	err := r.db.Where("type = ?", roomType).Find(&rooms).Error
	return rooms, err
}
