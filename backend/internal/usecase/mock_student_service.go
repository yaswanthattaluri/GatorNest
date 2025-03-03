package usecase

import (
	"backend/internal/entity"
	"github.com/stretchr/testify/mock"
)

type MockStudentService struct {
	mock.Mock
}

func (m *MockStudentService) AddUser(user entity.Student) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockStudentService) GetUsers() ([]entity.Student, error) {
	args := m.Called()
	return args.Get(0).([]entity.Student), args.Error(1)
}

func (m *MockStudentService) LoginUser(email, password string) (*entity.Student, error) {
	args := m.Called(email, password)
	return args.Get(0).(*entity.Student), args.Error(1)
}

func (m *MockStudentService) UpdateProfile(id uint, profileData entity.Student) error {
	args := m.Called(id, profileData)
	return args.Error(0)
}
