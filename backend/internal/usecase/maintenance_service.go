package usecase

import (
	"backend/internal/entity"
	"backend/internal/repository"
)

type MaintenanceService interface {
	SubmitRequest(req entity.MaintenanceRequest) error
	GetAllRequests() ([]entity.MaintenanceRequest, error)
	GetRequestByID(request *entity.MaintenanceRequest, id string) error
	UpdateRequest(request *entity.MaintenanceRequest) error
}

type MaintenanceServiceImpl struct {
	repo repository.MaintenanceRepository
}

func NewMaintenanceService(r repository.MaintenanceRepository) MaintenanceService {
	return &MaintenanceServiceImpl{repo: r}
}

func (s *MaintenanceServiceImpl) SubmitRequest(req entity.MaintenanceRequest) error {
	return s.repo.Create(&req)
}

func (s *MaintenanceServiceImpl) GetAllRequests() ([]entity.MaintenanceRequest, error) {
	return s.repo.GetAll()
}

func (s *MaintenanceServiceImpl) GetRequestByID(request *entity.MaintenanceRequest, id string) error {
	return s.repo.GetByID(request, id)
}

func (s *MaintenanceServiceImpl) UpdateRequest(request *entity.MaintenanceRequest) error {
	return s.repo.Update(request)
}
