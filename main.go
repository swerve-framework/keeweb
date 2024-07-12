package main

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/swerve-framework/swerve-go"
)

//go:embed dist
var keeweb embed.FS

func main() {
	keeweb, _ := fs.Sub(keeweb, "dist")
	http.Handle("/", http.FileServer(http.FS(keeweb)))
	err := http.ListenAndServe(":8080", swerve.Handler(http.DefaultServeMux,
		swerve.WithTitle("KeeWeb"),
		swerve.WithKnownHashesFromFS(keeweb, swerve.SHA384Hash)))
	if err != nil {
		panic(err)
	}
}
