package entity

import "time"

type Preference string
type Cleanliness string
type FoodPreference string
type PeopleOver string
type LanguagePreference string

const (
	EarlyBird     Preference = "Early Bird"
	NightOwl      Preference = "Night Owl"
	VeryTidy      Cleanliness = "Very Tidy"
	ModeratelyTidy Cleanliness = "Moderately Tidy"
	Messy         Cleanliness = "Messy"
	NoGuests      PeopleOver = "Private Space"
	OccasionalGuests PeopleOver = "Occasional Visitors"
	AlwaysGuests  PeopleOver = "Social Space"
	Veg          FoodPreference = "Veg"
	NonVeg       FoodPreference = "Non-Veg"
	SameLanguage LanguagePreference = "Yes"
	NoPreference LanguagePreference = "No"
	EitherWay    LanguagePreference = "Either one is fine"
)

type Student struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      *time.Time `gorm:"index" json:"deleted_at,omitempty"`
	Name           string     `json:"name"`
	Email          string     `json:"email"`
	RoomID         *uint      `json:"room_id"`
	Phone          string     `json:"phone,omitempty"`
	DormPreference string     `json:"dorm_preference,omitempty"`
	Password       string     `json:"password"`
	Gender         string     `json:"gender,omitempty"`
	Age            int        `json:"age,omitempty"`
	Major          string     `json:"major,omitempty"`
	LanguageSpoken string     `json:"language_spoken,omitempty"`
	Preference     Preference `json:"preference,omitempty"`
	Cleanliness    Cleanliness `json:"cleanliness,omitempty"`
	FoodPref       FoodPreference `json:"food_preference,omitempty"`
	PeopleOver     PeopleOver `json:"people_over,omitempty"`
	LangPref       LanguagePreference `json:"language_preference,omitempty"`
}

