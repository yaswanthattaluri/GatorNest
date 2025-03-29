package repository

import (
    "backend/internal/entity"
    "gorm.io/gorm"
    "errors"
)

type RoomRepository interface {
    CreateRoom(room *entity.Room) error
    GetRooms() ([]entity.Room, error)
    GetRoomByID(roomID uint) (*entity.Room, error)
    GetRoomByNumber(roomNumber int) (*entity.Room, error)
    DeleteRoomByNumber(roomNumber int) error
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

func (r *roomRepository) GetRoomByNumber(roomNumber int) (*entity.Room, error) {
    var room entity.Room
    result := r.db.Where("room_number = ?", roomNumber).First(&room)
    if result.Error != nil {
        return nil, errors.New("room not found")
    }
    return &room, nil
}

func (r *roomRepository) DeleteRoomByNumber(roomNumber int) error {
    result := r.db.Where("room_number = ?", roomNumber).Delete(&entity.Room{})
    if result.RowsAffected == 0 {
        return errors.New("room not found")
    }
    return result.Error
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

