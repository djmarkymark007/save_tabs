package webpage

import (
	"fmt"
	"net/http"
)

func CreateTag(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create a new tag")
}

func SaveWebpage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("save webpage")
	//Todo(mark): check if the webpage already exist. if so have a diffrent return
}

func GetWebpageByTab(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get webpage")
}

func MarkWebpageAsRead(w http.ResponseWriter, r *http.Request) {
	fmt.Println("read the webpage")
}
