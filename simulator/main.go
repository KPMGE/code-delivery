package main

import (
	"fmt"
	"log"

	"github.com/KPMGE/code-delivery/application/route"
)

func main() {
  testRoute := route.Route {
    ID: "1",
    ClientID: "12",
  }

  testRoute.LoadPositions()
  positions, err := testRoute.ExportPositionsAsJson()

  if err != nil {
    log.Fatal(err)
  }

  for _, pos := range positions {
    fmt.Println(pos)
  }
}
