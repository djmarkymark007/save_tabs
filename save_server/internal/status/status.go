package status

import (
	"encoding/json"
	"log"
	"net/http"
)

func IsAlive(w http.ResponseWriter, r *http.Request) {
	log.Printf("IsAlive called. Method: %s, User-Agent: %s", r.Method, r.UserAgent())

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Connection", "close") // Add this line
	w.WriteHeader(http.StatusOK)

	if r.Method != http.MethodHead {
		response := map[string]string{"status": "ok"}
		json.NewEncoder(w).Encode(response)
	}
}

//TODO(Mark): maybe a status page?
// do we want the status to be a webpage or the extension show it?
// show all tag mark as show or not
// webpage per tag
// how many have been read
// how many unread
