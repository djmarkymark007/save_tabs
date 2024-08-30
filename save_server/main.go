package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/djmarkymark007/save_tabs/save_server/internal/database"
	tabs "github.com/djmarkymark007/save_tabs/save_server/internal/save_all_tabs"
	"github.com/djmarkymark007/save_tabs/save_server/internal/status"
	"github.com/pressly/goose"
)

//TODO(Mark): setup github
// docker file for go program
// docker file for postgresql database
// when browser is open check server is alive
// work on ui
// add shortcut key
// add shortcut key for when finished read web page
// set up database files
// figure out how tags should work
// test on diffrent computer

func readSecret(file string) string {
	content, err := os.ReadFile(file)
	if err != nil {
		log.Fatalf("Error reading secret file: %v", err)
	}
	return strings.TrimSpace(string(content))
}

func runMigrations(db *sql.DB) error {
	if err := goose.SetDialect("postgres"); err != nil {
		return fmt.Errorf("failed to set dialect: %v", err)
	}

	if err := goose.Up(db, "migrations"); err != nil {
		return fmt.Errorf("failed to run migrations: %v", err)
	}

	return nil
}

func isOk(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}

func main() {

	dbUser := readSecret(os.Getenv("DB_USER_FILE"))
	dbPassword := readSecret(os.Getenv("DB_PASSWORD_FILE"))
	dbName := readSecret(os.Getenv("DB_NAME_FILE"))

	log.Printf("%s %s %s", dbUser, dbPassword, dbName)
	port := os.Getenv("PORT")
	log.Println(port)
	// Database connection
	dbURL := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		dbUser,
		dbPassword,
		dbName)

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Error opening database: %q", err)
	}
	defer db.Close()
	log.Println("opened database")

	if err := runMigrations(db); err != nil {
		log.Fatalf("Error running migrations: %v", err)
	}

	database.SetConfig(database.New(db))
	log.Println("set the config")

	mux := http.NewServeMux()
	mux.HandleFunc("POST /v1/save-tabs", tabs.PostBrowserState)
	mux.HandleFunc("GET /v1/save-tabs", tabs.GetLastBrowserState)
	mux.HandleFunc("GET /status", status.IsAlive)
	mux.HandleFunc("/", isOk)
	log.Println("created mux")

	server := http.Server{Handler: mux, Addr: ":" + port}
	log.Printf("starting server on port: %s", port)
	log.Fatal(server.ListenAndServe())
}
