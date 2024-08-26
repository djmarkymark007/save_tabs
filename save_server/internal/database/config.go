package database

var Config struct {
	DB   *Queries
	logs []string
}

func SetConfig(db *Queries) {
	Config.DB = db
}

func AddLog(log string) {
	Config.logs = append(Config.logs, log)
}
