package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	data "github.com/mindfarm/balmytext/repository"
)

type handlerData struct {
	ds data.Store
}

// NewHandlerData -
// ignore unexported return linter issue
// nolint:revive
func NewHandlerData(ds data.Store) *handlerData {
	return &handlerData{ds: ds}
}

const numWords = 5

// GetWords -
func (hd *handlerData) GetWords(w http.ResponseWriter, r *http.Request) {
	// return the set of words to guess
	// only GET allowed
	if r.Method != http.MethodGet {
		http.Error(w, "Bad request - Go away!", http.StatusMethodNotAllowed)
		return
	}

	// difficulty is the length of each word
	difficulty := "five"
	switch strings.ToLower(r.URL.RawQuery) {
	case "easy":
		difficulty = "four"
	case "hard":
		difficulty = "six"
	}
	// Get words from Datastore
	words, err := hd.ds.GetWords(context.Background(), difficulty, numWords)
	if err != nil {
		log.Printf("ERROR getting words in GetWords handler %v", err)
		return
	}

	resp, err := json.Marshal(struct {
		C []string `json:"words"`
	}{words})
	if err != nil {
		log.Printf("ERROR marshalling words in GetWords handler %v", err)
		return
	}
	_, err = w.Write(resp)
	if err != nil {
		log.Printf("ERROR writing words in GetWords handler %v", err)
		return
	}
}

func (hd *handlerData) getAppPath() string {
	app, err := os.Executable()
	if err != nil {
		log.Fatalf("ERROR getting the executable path %v", err)
	}
	appPath, err := filepath.Abs(filepath.Dir(app))
	// if the app's path cannot be determined the app cannot run
	if err != nil {
		log.Fatalf("ERROR getting the executable path %v", err)
	}

	return appPath
}

// GetAssets
func (hd *handlerData) GetAssets(w http.ResponseWriter, r *http.Request) {
	appPath := hd.getAppPath()
	if strings.HasSuffix(r.URL.Path, ".js") {
		w.Header().Set("Content-Type", "text/javascript")
		http.ServeFile(w, r, appPath+"/assets/wordle/"+r.URL.Path)
	} else if strings.HasSuffix(r.URL.Path, ".css") {
		w.Header().Set("Content-Type", "text/css")
		http.ServeFile(w, r, appPath+"/assets/wordle/"+r.URL.Path)
	} else {
		w.Header().Set("Content-Type", "text/html")
		fmt.Println(appPath + "/assets/wordle/index.html")
		http.ServeFile(w, r, appPath+"/assets/wordle/index.html")
	}
}

// FaviconHandler -
func (hd *handlerData) FaviconHandler(w http.ResponseWriter, r *http.Request) {
	appPath := hd.getAppPath()
	http.ServeFile(w, r, appPath+"/assets/favicon.ico")
}
