package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func sayHigh(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "hello")
	fmt.Println("connected")
}

func sayPost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /", sayPost)
	mux.HandleFunc("GET /", sayHigh)
	log.Fatal(http.ListenAndServe(":8080", mux))
}
