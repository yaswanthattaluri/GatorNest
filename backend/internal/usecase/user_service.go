package usecase

<<<<<<< HEAD
import "backend/internal/entity"


type StudentService struct{
	students []entity.Student
}
=======
import (
	"backend/internal/entity"
	"backend/internal/repository"
	"errors"
)

type StudentService struct{}
>>>>>>> 49d2a8b (Database integration, API fetch in frontend, APIs configuration in backend)

func NewUserService() *StudentService {
	return &StudentService{}
}

<<<<<<< HEAD
func (s *StudentService) AddUser(user entity.Student)  {
	s.students = append(s.students, user)
}

func (s *StudentService) GetUsers() []entity.Student {
	return s.students
}

=======
func (s *StudentService) AddUser(user entity.Student) error {
	return repository.CreateStudent(&user)
}

func (s *StudentService) GetUsers() ([]entity.Student, error) {
	return repository.GetAllStudents()
}

func (s *StudentService) LoginUser(email, password string) (*entity.Student, error) {
	user, err := repository.FindStudentByEmailAndPassword(email, password)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}
	return user, nil
}
>>>>>>> 49d2a8b (Database integration, API fetch in frontend, APIs configuration in backend)
