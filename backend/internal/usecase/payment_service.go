package usecase

import (
	"backend/internal/entity"
	"backend/internal/repository"
)

type PaymentService interface {
	MakePayment(payment *entity.Payment) error
	GetPaymentHistory(studentID uint) ([]entity.Payment, error)
	UpdatePendingDues(studentID uint, amount float64) error
}

type paymentService struct {
	repo        repository.PaymentRepository
	studentRepo repository.StudentRepository
}

func NewPaymentService(r repository.PaymentRepository, studentRepo repository.StudentRepository) PaymentService {
	return &paymentService{r, studentRepo}
}

func (s *paymentService) MakePayment(payment *entity.Payment) error {
	payment.Status = "Completed"
	if err := s.repo.Create(payment); err != nil {
		return err
	}
	// Update pending dues to 0 after successful payment
	return s.UpdatePendingDues(payment.StudentID, 0)
}

func (s *paymentService) GetPaymentHistory(studentID uint) ([]entity.Payment, error) {
	return s.repo.GetByStudentID(studentID)
}

func (s *paymentService) UpdatePendingDues(studentID uint, amount float64) error {
	return s.studentRepo.UpdatePendingDues(studentID, amount)
}
