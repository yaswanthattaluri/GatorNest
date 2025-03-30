package usecase

import (
	"backend/internal/entity"
	"github.com/stretchr/testify/mock"
)

type MockAdminService struct {
	mock.Mock
}


func (m *MockAdminService) RegisterAdmin(admin entity.Admin) error {
	args := m.Called(admin)
	return args.Error(0)
}

func (m *MockAdminService) LoginAdmin(email, password string) (*entity.Admin, string, error) {
	args := m.Called(email, password)
	return args.Get(0).(*entity.Admin), "", args.Error(2) // change the empty string to the actual value
}

func (m *MockAdminService) GetAllAdmins() ([]entity.Admin, error) {
	args := m.Called()
	return args.Get(0).([]entity.Admin), args.Error(1)

}

