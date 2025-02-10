package repository

import (
	"backend/internal/entity"
	"backend/config"
)

func CreateStudent(student *entity.Student) error {
	return config.DB.Create(student).Error
}

func GetAllStudents() ([]entity.Student, error) {
	var students []entity.Student
	err := config.DB.Find(&students).Error
	return students, err
}

func FindStudentByEmailAndPassword(email, password string) (*entity.Student, error) {
	var student entity.Student
	err := config.DB.Where("email = ? AND password = ?", email, password).First(&student).Error
	if err != nil {
		return nil, err
	}
	return &student, nil
}
