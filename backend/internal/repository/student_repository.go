package repository

import (
	"backend/internal/entity"
	"log"

	"gorm.io/gorm"
)

type StudentRepository interface {
	CreateStudent(student *entity.Student) error
	FindStudentByEmailAndPassword(email string, password string) (*entity.Student, error)
	FindStudentByID(id uint) (*entity.Student, error)
	GetAllStudents() ([]entity.Student, error)
	GetFilteredStudents(gender string, preference string, foodPreference string) ([]entity.Student, error)
	UpdateStudent(student *entity.Student) error
	UpdateStudentProfile(id uint, profileData *entity.Student) error
	UpdateStudentRoom(id uint, roomID *uint) error
	GetStudentByID(id uint) (*entity.Student, error)
	UpdatePendingDues(id uint, amount float64) error

	// Search methods
	SearchStudentsByName(name string) ([]entity.Student, error)
	SearchStudentsByID(studentID string) (*entity.Student, error)
	SearchStudentsByRoomNumber(roomNumber string) ([]entity.Student, error)

	GetByID(id uint) (*entity.Student, error)
}

type StudentRepositoryImpl struct {
	db *gorm.DB
}

func (r *StudentRepositoryImpl) GetStudentByID(id uint) (*entity.Student, error) {
	var student entity.Student
	err := r.db.Where("id = ?", id).First(&student).Error
	if err != nil {
		return nil, err
	}
	return &student, nil
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

func (r *StudentRepositoryImpl) UpdateStudentRoom(id uint, roomID *uint) error {
	return r.db.Model(&entity.Student{}).Where("id = ?", id).Update("room_id", roomID).Error
}

func (r *StudentRepositoryImpl) UpdateStudent(student *entity.Student) error {
	return r.db.Save(student).Error
}

func (r *StudentRepositoryImpl) GetFilteredStudents(gender, preference, foodPreference string) ([]entity.Student, error) {
	var students []entity.Student

	// Adjust field names to match your struct & database
	query := r.db.Where("gender = ? AND preference = ? AND food_pref = ?", gender, preference, foodPreference)

	err := query.Find(&students).Error
	if err != nil {
		log.Println("Database query error:", err) // Debug log
		return nil, err
	}

	log.Println("Students fetched:", students) // Debug log
	return students, nil
}

func (r *StudentRepositoryImpl) SearchStudentsByName(name string) ([]entity.Student, error) {
	var students []entity.Student
	err := r.db.Where("LOWER(name) LIKE LOWER(?)", "%"+name+"%").Find(&students).Error
	return students, err
}

func (r *StudentRepositoryImpl) SearchStudentsByID(studentID string) (*entity.Student, error) {
	var student entity.Student
	err := r.db.Where("id = ?", studentID).First(&student).Error
	if err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *StudentRepositoryImpl) SearchStudentsByRoomNumber(roomNumber string) ([]entity.Student, error) {
	var students []entity.Student
	err := r.db.Where("room_number = ?", roomNumber).Find(&students).Error
	return students, err
}

func (r *StudentRepositoryImpl) GetByID(id uint) (*entity.Student, error) {
	var student entity.Student
	err := r.db.First(&student, id).Error
	if err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *StudentRepositoryImpl) UpdatePendingDues(id uint, amount float64) error {
	return r.db.Model(&entity.Student{}).Where("id = ?", id).Update("pending_dues", amount).Error
}
