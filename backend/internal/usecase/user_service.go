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
	GetFilteredStudents(gender, preference, foodPreference string) ([]entity.Student, error)
	GetPendingDues(studentID uint) (float64, error)
	SearchStudents(searchType, searchTerm string) ([]entity.Student, error)
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

func (s *StudentServiceImpl) GetFilteredStudents(gender, preference, foodPreference string) ([]entity.Student, error) {
	return s.repo.GetFilteredStudents(gender, preference, foodPreference)
}


func (s *StudentServiceImpl) SearchStudents(searchType, searchTerm string) ([]entity.Student, error) {
	switch searchType {
	case "name":
		return s.repo.SearchStudentsByName(searchTerm)
	case "id":
		student, err := s.repo.SearchStudentsByID(searchTerm)
		if err != nil {
			return nil, err
		}
		return []entity.Student{*student}, nil
	case "roomNumber":

		return s.repo.SearchStudentsByRoomNumber(searchTerm)
	default:
		return nil, errors.New("Invalid search type")
	}
}

func (s *StudentServiceImpl) GetPendingDues(studentID uint) (float64, error) {
	student, err := s.repo.GetStudentByID(studentID)
	if err != nil {
		return 0, err
	}
	return student.PendingDues, nil
} 