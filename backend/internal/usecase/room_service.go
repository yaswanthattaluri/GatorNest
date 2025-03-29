package usecase

import (
    "backend/internal/entity"
    "backend/internal/repository"
    "errors"
)

type RoomUsecase interface {
    CreateRoom(name, roomType string, vacancy int, price int, roomNumber int) (*entity.Room, error)
    GetRooms() ([]entity.Room, error)
    JoinRoom(roomID uint, studentID uint) error
    GetRoomsByType(roomType string) ([]entity.Room, error)
    DeleteRoomByNumber(roomNumber int) error  
}



type roomUsecase struct {
    roomRepo   repository.RoomRepository
    studentRepo repository.StudentRepository
}

func NewRoomUsecase(roomRepo repository.RoomRepository, studentRepo repository.StudentRepository) RoomUsecase {
    return &roomUsecase{roomRepo: roomRepo, studentRepo: studentRepo}
}



func (u *roomUsecase) CreateRoom(name, roomType string, vacancy int, price int, roomNumber int) (*entity.Room, error) {
    room := &entity.Room{
        Name:       name,
        Type:       roomType,
        Vacancy:    vacancy,
        Price:      price,     
        RoomNumber: roomNumber,  
    }
    err := u.roomRepo.CreateRoom(room)
    return room, err
}

func (u *roomUsecase) DeleteRoomByNumber(roomNumber int) error {
    room, err := u.roomRepo.GetRoomByNumber(roomNumber)
    if room == nil || err != nil {
        return errors.New("room not found")
    }

    return u.roomRepo.DeleteRoomByNumber(roomNumber)
}


func (u *roomUsecase) GetRooms() ([]entity.Room, error) {
    return u.roomRepo.GetRooms()
}

func (u *roomUsecase) JoinRoom(roomID uint, studentID uint) error {
    room, err := u.roomRepo.GetRoomByID(roomID)
    if err != nil {
        return err
    }

    if room.Vacancy <= 0 {
        return errors.New("room is full")
    }

    student, err := u.studentRepo.GetStudentByID(studentID)
    if err != nil {
        return errors.New("student does not exist")
    }

    if student.RoomID != nil {
        return errors.New("student is already in a room")
    }

    student.RoomID = &roomID
    room.Vacancy--

    if err := u.studentRepo.UpdateStudent(student); err != nil {
        return err
    }

    return u.roomRepo.UpdateRoom(room)
}

func (u *roomUsecase) GetRoomsByType(roomType string) ([]entity.Room, error) {
    return u.roomRepo.FindRoomsByType(roomType)
}
