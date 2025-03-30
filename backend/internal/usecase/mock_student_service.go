package usecase

import (
	"backend/internal/entity"
	"github.com/stretchr/testify/mock"
)

type MockStudentService struct {
	mock.Mock
}

func (m *MockStudentService) AddUser(user entity.Student) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockStudentService) GetUsers() ([]entity.Student, error) {
	args := m.Called()
	return args.Get(0).([]entity.Student), args.Error(1)
}

func (m *MockStudentService) LoginUser(email, password string) (*entity.Student, error) {
	args := m.Called(email, password)
	return args.Get(0).(*entity.Student), args.Error(1)
}

func (m *MockStudentService) UpdateProfile(id uint, profileData entity.Student) error {
	args := m.Called(id, profileData)
	return args.Error(0)
}



func(m *MockStudentService) SearchStudents(searchType, searchTerm string) ([]entity.Student, error){
	args := m.Called(searchType, searchTerm)

	return args.Get(0).([]entity.Student), args.Error(1)
}

// func (s *StudentServiceImpl) SearchStudents(searchType, searchTerm string) ([]entity.Student, error) {
// 	switch searchType {
// 	case "name":
// 		return s.repo.SearchStudentsByName(searchTerm)
// 	case "id":
// 		student, err := s.repo.SearchStudentsByID(searchTerm)
// 		if err != nil {
// 			return nil, err
// 		}
// 		return []entity.Student{*student}, nil
// 	case "roomNumber":

// 		return s.repo.SearchStudentsByRoomNumber(searchTerm)
// 	default:
// 		return nil, errors.New("Invalid search type")
// 	}
// }