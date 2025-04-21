package usecase

import (
	"backend/internal/entity"
)

type MockPaymentService struct {
	MakePaymentFn        func(payment *entity.Payment) error
	GetPaymentHistoryFn  func(studentID uint) ([]entity.Payment, error)
	UpdatePendingDuesFn  func(studentID uint, amount float64) error
}

func (m *MockPaymentService) MakePayment(payment *entity.Payment) error {
	return m.MakePaymentFn(payment)
}

func (m *MockPaymentService) GetPaymentHistory(studentID uint) ([]entity.Payment, error) {
	return m.GetPaymentHistoryFn(studentID)
}

func (m *MockPaymentService) UpdatePendingDues(studentID uint, amount float64) error {
	return m.UpdatePendingDuesFn(studentID, amount)
}
