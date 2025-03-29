package repository

import (
	"backend/internal/entity"
	"gorm.io/gorm"
)

type AdminRepository interface {
	CreateAdmin(admin *entity.Admin) error
	GetAdminByEmail(email string) (*entity.Admin, error)
	GetAllAdmins() ([]entity.Admin, error) // Add this method
}

type adminRepository struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) AdminRepository {
	return &adminRepository{db: db}
}

func (r *adminRepository) CreateAdmin(admin *entity.Admin) error {
	return r.db.Create(admin).Error
}

func (r *adminRepository) GetAdminByEmail(email string) (*entity.Admin, error) {
	var admin entity.Admin
	if err := r.db.Where("email = ?", email).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

// Implement the missing GetAllAdmins function
func (r *adminRepository) GetAllAdmins() ([]entity.Admin, error) {
	var admins []entity.Admin
	if err := r.db.Find(&admins).Error; err != nil {
		return nil, err
	}
	return admins, nil
}
