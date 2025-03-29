package usecase

import (
	"backend/internal/entity"
	"github.com/stretchr/testify/mock"
)

type MockRoomUsecase struct {
	mock.Mock
}

func (m *MockRoomUsecase) CreateRoom(name, roomType string, vacancy int, price int, roomNumber int) (*entity.Room, error) {
	args := m.Called(name, roomType, vacancy, price, roomNumber)
	return args.Get(0).(*entity.Room), args.Error(1)
}

func (m *MockRoomUsecase) GetRooms() ([]entity.Room, error) {
	args := m.Called()
	return args.Get(0).([]entity.Room), args.Error(1)
}

func (m *MockRoomUsecase) JoinRoom(roomID uint, studentID uint) error { // ✅ Change string -> uint
	args := m.Called(roomID, studentID)
	return args.Error(0)
}

func (m *MockRoomUsecase) GetRoomsByType(roomType string) ([]entity.Room, error) {
	args := m.Called(roomType)
	return args.Get(0).([]entity.Room), args.Error(1)
}
