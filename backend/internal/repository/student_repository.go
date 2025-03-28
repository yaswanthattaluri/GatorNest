package repository

import (
	"backend/internal/entity"
	"gorm.io/gorm"
)

type StudentRepository interface {
	CreateStudent(user *entity.Student) error
	GetAllStudents() ([]entity.Student, error)
	FindStudentByEmailAndPassword(email, password string) (*entity.Student, error)
	UpdateStudentProfile(id uint, profileData *entity.Student) error
	FindStudentByID(id uint) (*entity.Student, error)
}

type StudentRepositoryImpl struct {
	db *gorm.DB
}

func NewStudentRepository(db *gorm.DB) StudentRepository {
	return &StudentRepositoryImpl{db: db}
}

func (r *StudentRepositoryImpl) CreateStudent(student *entity.Student) error {
	return r.db.Create(student).Error
}

func (r *StudentRepositoryImpl) GetAllStudents() ([]entity.Student, error) {
	var students []entity.Student
	err := r.db.Find(&students).Error
	return students, err
}

func (r *StudentRepositoryImpl) FindStudentByEmailAndPassword(email, password string) (*entity.Student, error) {
	var student entity.Student
	err := r.db.Where("email = ? AND password = ?", email, password).First(&student).Error
	if err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *StudentRepositoryImpl) UpdateStudentProfile(id uint, profileData *entity.Student) error {
	return r.db.Model(&entity.Student{}).Where("id = ?", id).Updates(profileData).Error
}

func (r *StudentRepositoryImpl) FindStudentByID(id uint) (*entity.Student, error) {
	var student entity.Student
	err := r.db.Where("id = ?", id).First(&student).Error
	if err != nil {
		return nil, err
	}
	return &student, nil
}
