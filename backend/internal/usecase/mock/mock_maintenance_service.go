package mock

import (
	"backend/internal/entity"

	"github.com/stretchr/testify/mock"
)

type MaintenanceService struct {
	mock.Mock
}

func (m *MaintenanceService) SubmitRequest(request entity.MaintenanceRequest) error {
	args := m.Called(request)
	return args.Error(0)
}

func (m *MaintenanceService) GetAllRequests() ([]entity.MaintenanceRequest, error) {
	args := m.Called()
	return args.Get(0).([]entity.MaintenanceRequest), args.Error(1)
}

func (m *MaintenanceService) UpdateRequest(request *entity.MaintenanceRequest) error {
	args := m.Called(request)
	return args.Error(0)
}

func (m *MaintenanceService) GetRequestByID(request *entity.MaintenanceRequest, id string) error {
	args := m.Called(request, id)
	return args.Error(0)
}
