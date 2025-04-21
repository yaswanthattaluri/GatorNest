package mock

import (
	"backend/internal/entity"

	"github.com/stretchr/testify/mock"
)

type PaymentService struct {
	mock.Mock
}

func (m *PaymentService) MakePayment(payment *entity.Payment) error {
	args := m.Called(payment)
	return args.Error(0)
}

func (m *PaymentService) GetPaymentHistory(studentID uint) ([]entity.Payment, error) {
	args := m.Called(studentID)
	return args.Get(0).([]entity.Payment), args.Error(1)
}

func (m *PaymentService) UpdatePendingDues(studentID uint, amount float64) error {
	args := m.Called(studentID, amount)
	return args.Error(0)
}
