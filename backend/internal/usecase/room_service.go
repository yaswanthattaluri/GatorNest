package usecase

import (
	"backend/internal/entity"
	"backend/internal/repository"
	"time"
)

type RoomService interface {
	CreateRoom(room *entity.Room) error
	GetAllRooms() ([]entity.Room, error)
	GetRoomByID(id uint) (*entity.Room, error)
	GetRoomByNumber(roomNumber string) (*entity.Room, error)
	JoinRoom(roomID uint, studentID uint) error
	GetRooms() ([]entity.Room, error)
	GetRoomsByType(roomType string) ([]entity.Room, error)
	// DeleteRoomByNumber(roomNumber int) error
	DeleteRoomByRoomNumber(roomNumber string) error
}

type roomService struct {
	repo        repository.RoomRepository
	studentRepo repository.StudentRepository
	paymentRepo repository.PaymentRepository
}

func NewRoomService(repo repository.RoomRepository, studentRepo repository.StudentRepository, paymentRepo repository.PaymentRepository) RoomService {
	return &roomService{
		repo:        repo,
		studentRepo: studentRepo,
		paymentRepo: paymentRepo,
	}
}

func (s *roomService) CreateRoom(room *entity.Room) error {
	return s.repo.CreateRoom(room)
}

func (s *roomService) GetAllRooms() ([]entity.Room, error) {
	return s.repo.GetRooms()
}

func (s *roomService) GetRoomByID(id uint) (*entity.Room, error) {
	return s.repo.GetRoomByID(id)
}

func (s *roomService) GetRoomByNumber(roomNumber string) (*entity.Room, error) {
	return s.repo.GetRoomByNumber(roomNumber)
}

func (s *roomService) JoinRoom(roomID uint, studentID uint) error {
	// Get the room first to get its price
	room, err := s.repo.GetRoomByID(roomID)
	if err != nil {
		return err
	}

	// Get the student to update their pending dues
	student, err := s.studentRepo.GetByID(studentID)
	if err != nil {
		return err
	}

	// Add room price to student's pending dues
	newPendingDues := student.PendingDues + room.Price
	if err := s.studentRepo.UpdatePendingDues(studentID, newPendingDues); err != nil {
		return err
	}

	// Create a new payment record
	payment := &entity.Payment{
		StudentID: studentID,
		Amount:    room.Price,
		Status:    "Pending",
		Date:      time.Now(),
	}

	// Save the payment record
	if err := s.paymentRepo.Create(payment); err != nil {
		return err
	}

	// Join the room
	return s.repo.JoinRoom(roomID, studentID)
}

func (u *roomService) GetRooms() ([]entity.Room, error) {
	return u.repo.GetRooms()
}

func (u *roomService) GetRoomsByType(roomType string) ([]entity.Room, error) {
	return u.repo.FindRoomsByType(roomType)
}

func (s *roomService) DeleteRoomByRoomNumber(roomNumber string) error {
	return s.repo.DeleteRoomByRoomNumber(roomNumber)
}
