package repository

import (
	"backend/internal/entity"

	"gorm.io/gorm"
)

type PaymentRepository interface {
	Create(payment *entity.Payment) error
	GetByStudentID(studentID uint) ([]entity.Payment, error)
}

type paymentRepo struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) PaymentRepository {
	return &paymentRepo{db}
}

func (r *paymentRepo) Create(payment *entity.Payment) error {
	return r.db.Create(payment).Error
}

func (r *paymentRepo) GetByStudentID(studentID uint) ([]entity.Payment, error) {
	var payments []entity.Payment
	err := r.db.Where("student_id = ?", studentID).Order("date DESC").Find(&payments).Error
	return payments, err
}
