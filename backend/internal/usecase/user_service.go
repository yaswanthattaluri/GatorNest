package usecase

import "backend/internal/entity"


type StudentService struct{
	students []entity.Student
}

func NewUserService() *StudentService {
	return &StudentService{}
}

func (s *StudentService) AddUser(user entity.Student)  {
	s.students = append(s.students, user)
}

func (s *StudentService) GetUsers() []entity.Student {
	return s.students
}

