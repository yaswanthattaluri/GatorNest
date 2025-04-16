package repository

import (
	"backend/internal/entity"

	"gorm.io/gorm"
)

type MaintenanceRepository interface {
	Create(request *entity.MaintenanceRequest) error
	GetAll() ([]entity.MaintenanceRequest, error)
	GetByID(request *entity.MaintenanceRequest, id string) error
	Update(request *entity.MaintenanceRequest) error
}

type maintenanceRepo struct {
	db *gorm.DB
}

func NewMaintenanceRepository(db *gorm.DB) MaintenanceRepository {
	return &maintenanceRepo{db: db}
}

func (r *maintenanceRepo) Create(request *entity.MaintenanceRequest) error {
	return r.db.Create(request).Error
}

func (r *maintenanceRepo) GetAll() ([]entity.MaintenanceRequest, error) {
	var requests []entity.MaintenanceRequest
	err := r.db.Find(&requests).Error
	return requests, err
}

func (r *maintenanceRepo) GetByID(request *entity.MaintenanceRequest, id string) error {
	return r.db.First(request, id).Error
}

func (r *maintenanceRepo) Update(request *entity.MaintenanceRequest) error {
	return r.db.Save(request).Error
}
