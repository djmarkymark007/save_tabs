package main

import (
	"log"
	"net/http"

	tabs "github.com/djmarkymark007/save_tabs/save_server/internal/save_all_tabs"
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

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /save-tabs", tabs.PostSaveTabs)
	mux.HandleFunc("GET /save-tabs", tabs.GetSaveTabs)
	log.Fatal(http.ListenAndServe(":8080", mux))
}
