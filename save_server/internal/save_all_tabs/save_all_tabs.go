package save_all_tabs

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/djmarkymark007/save_tabs/save_server/internal/database"
	"github.com/google/uuid"
)

type Tab struct {
	URL   string `json:"url"`
	Title string `json:"title"`
}

type saveJson struct {
	Tabs []Tab `json:"tabs"`
}

func tabsToTabsParms(tabs []Tab) ([]string, []string) {
	titles := []string{}
	urls := []string{}

	for index := range len(tabs) {
		titles = append(titles, tabs[index].Title)
		urls = append(urls, tabs[index].URL)
	}

	return titles, urls
}

func tabsParmsToTabs(titles, urls []string) saveJson {
	result := saveJson{}

	for index := range len(titles) {
		result.Tabs = append(result.Tabs, Tab{URL: urls[index], Title: titles[index]})
	}

	return result
}

// TODO(Mark): clean up Print messages
func PostBrowserState(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post")
	saveData := saveJson{}
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&saveData)

	for _, tab := range saveData.Tabs {
		fmt.Printf("title: %s, url: %s\n", tab.Title, tab.URL)
	}

	titles, urls := tabsToTabsParms(saveData.Tabs)

	dbParams := database.SaveBrowserStateParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		Titles:    titles,
		Urls:      urls,
	}

	_, err := database.Config.DB.SaveBrowserState(r.Context(), dbParams)
	if err != nil {
		database.AddLog(fmt.Sprintf("ERROR: In PostSaveBrowserState. database error %v", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetLastBrowserState(w http.ResponseWriter, r *http.Request) {
	fmt.Println("get save tab")

	dbTabs, err := database.Config.DB.GetLastBrowserState(r.Context())
	if err != nil {
		database.AddLog(fmt.Sprintf("ERROR: In GetLastBrowserState. database error %v", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	tabs := tabsParmsToTabs(dbTabs.Titles, dbTabs.Urls)
	data, err := json.Marshal(tabs)
	if err != nil {
		log.Printf("Ops: %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500"))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
