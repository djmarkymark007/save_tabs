package status

import (
	"net/http"
)

func IsAlive(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
}

//TODO(Mark): maybe a status page?
// show all tag mark as show or not
// webpage per tag
// how many have been read
// how many unread
