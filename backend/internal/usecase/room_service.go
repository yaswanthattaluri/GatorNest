package usecase

import (
	"errors"
	"backend/internal/entity"
	"backend/internal/repository"
)

type RoomUsecase interface {
	CreateRoom(name, roomType string, vacancy int) (*entity.Room, error)
	GetRooms() ([]entity.Room, error)
	JoinRoom(roomID uint, studentName string) error
	GetRoomsByType(roomType string) ([]entity.Room, error)
}

type roomUsecase struct {
	roomRepo repository.RoomRepository
}

func NewRoomUsecase(roomRepo repository.RoomRepository) RoomUsecase {
	return &roomUsecase{roomRepo: roomRepo}
}

func (u *roomUsecase) CreateRoom(name, roomType string, vacancy int) (*entity.Room, error) {
	room := &entity.Room{Name: name, Type: roomType, Vacancy: vacancy}
	err := u.roomRepo.CreateRoom(room)
	return room, err
}

func (u *roomUsecase) GetRooms() ([]entity.Room, error) {
	return u.roomRepo.GetRooms()
}

func (u *roomUsecase) JoinRoom(roomID uint, studentName string) error {
	room, err := u.roomRepo.GetRoomByID(roomID)
	if err != nil {
		return err
	}

	if room.Vacancy <= 0 {
		return errors.New("room is full")
	}

	room.Students = append(room.Students, studentName)
	room.Vacancy--
	return u.roomRepo.UpdateRoom(room)
}

func (u *roomUsecase) GetRoomsByType(roomType string) ([]entity.Room, error) {
	return u.roomRepo.FindRoomsByType(roomType) 
}
