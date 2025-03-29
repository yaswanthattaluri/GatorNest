package usecase

import (
	"backend/internal/entity"
	"backend/internal/repository"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("secretKey123")

type AdminService interface {
	RegisterAdmin(admin entity.Admin) error
	LoginAdmin(email, password string) (*entity.Admin, string, error)
	GetAllAdmins() ([]entity.Admin, error)
}

type AdminServiceImpl struct {
	repo repository.AdminRepository
}

func NewAdminService(repo repository.AdminRepository) AdminService {
	return &AdminServiceImpl{repo: repo}
}

func (s *AdminServiceImpl) RegisterAdmin(admin entity.Admin) error {
	return s.repo.CreateAdmin(&admin)
}

func (s *AdminServiceImpl) LoginAdmin(email, password string) (*entity.Admin, string, error) {
	admin, err := s.repo.GetAdminByEmail(email)
	if err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"admin_id": admin.ID,
		"email":    admin.Email,
		"role":     "admin",
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Expires in 24 hours
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return nil, "", errors.New("failed to generate token")
	}

	return admin, tokenString, nil
}

func (s *AdminServiceImpl) GetAllAdmins() ([]entity.Admin, error) {
	return s.repo.GetAllAdmins()
}
