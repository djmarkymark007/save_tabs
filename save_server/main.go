package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

//TODO(Mark): remove the web dev firewall rule from windows defender

type Tab struct {
	URL   string `json:"url"`
	Title string `json:"title"`
}

type saveJson struct {
	Tabs []Tab `json:"tabs"`
}

// TODO(Mark): delete later
var testStuff = saveJson{
	Tabs: []Tab{
		{
			URL:   "https://google.com",
			Title: "google",
		},
		{
			URL:   "https://gmail.com",
			Title: "gmail",
		},
	},
}

func sayHigh(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "hello")
	fmt.Println("connected")
}

func postSaveTabs(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post")
	saveData := saveJson{}
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&saveData)

	for _, tab := range saveData.Tabs {
		fmt.Printf("title: %s, url: %s\n", tab.Title, tab.URL)
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, `{"id":"1"}`)
}

func getSaveTabs(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get save tab")
	data, err := json.Marshal(testStuff)
	if err != nil {
		log.Printf("Ops: %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /save-tabs", postSaveTabs)
	mux.HandleFunc("GET /save-tabs", getSaveTabs)
	mux.HandleFunc("GET /", sayHigh)
	log.Fatal(http.ListenAndServe(":8080", mux))
}
