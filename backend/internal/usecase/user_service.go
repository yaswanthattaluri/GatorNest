package usecase

import (
	"backend/internal/entity"
	"backend/internal/repository"
	"errors"
)

type StudentService interface {
	AddUser(user entity.Student) error
	GetUsers() ([]entity.Student, error)
	LoginUser(email, password string) (*entity.Student, error)
	UpdateProfile(id uint, profileData entity.Student) error
}

type StudentServiceImpl struct {
	repo repository.StudentRepository
}

func NewUserService(repo repository.StudentRepository) StudentService {
	return &StudentServiceImpl{repo: repo}
}

func (s *StudentServiceImpl) AddUser(user entity.Student) error {
	return s.repo.CreateStudent(&user)
}

func (s *StudentServiceImpl) GetUsers() ([]entity.Student, error) {
	return s.repo.GetAllStudents()
}

func (s *StudentServiceImpl) LoginUser(email, password string) (*entity.Student, error) {
	user, err := s.repo.FindStudentByEmailAndPassword(email, password)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}
	return user, nil
}

func (s *StudentServiceImpl) UpdateProfile(id uint, profileData entity.Student) error {
	return s.repo.UpdateStudentProfile(id, &profileData)
}
