package config

import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/lib/pq"
)

func TestDBConnection() (*sql.DB, error) {
    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s sslmode=disable",
        os.Getenv("DB_HOST"), os.Getenv("DB_USER"),
        os.Getenv("DB_PASS"), "test_db",
    )
    return sql.Open("postgres", dsn)
}
