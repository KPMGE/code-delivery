package route

import (
	"bufio"
	"encoding/json"
	"errors"
	"os"
	"strconv"
	"strings"
)

type Route struct {
	ClientID  string     `json:"clientId"`
	ID        string     `json:"routeId"`
	Positions []Position `json:"positions"`
}

type Position struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

type PartialRoutePosition struct {
	ID       string     `json:"routeId"`
	ClientID string     `json:"clientId"`
	Position [2]float64 `json:"position"`
	Finished bool       `json:"finished"`
}

func NewRoute() *Route {
  return &Route{}
}

func (r *Route) LoadPositions() error {
	if r.ID == "" {
		return errors.New("document id not provided")
	}

	f, err := os.Open("destinations/" + r.ID + ".txt")
	if err != nil {
		return err
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		splitedPositions := strings.Split(line, ",")

		lat, err := strconv.ParseFloat(splitedPositions[0], 64)
		if err != nil {
			return err
		}

		long, err := strconv.ParseFloat(splitedPositions[1], 64)
		if err != nil {
			return err
		}

		r.Positions = append(r.Positions, Position{
			Lat:  lat,
			Long: long,
		})
	}

	return nil
}

func (r *Route) ExportPositionsAsJson() ([]string, error) {
	var jsonPositions []string

	for i, p := range r.Positions {
		partialPos := PartialRoutePosition{
			ID:       r.ID,
			ClientID: r.ClientID,
			Finished: false,
			Position: [2]float64{p.Lat, p.Long},
		}

		if i == len(r.Positions)-1 {
			partialPos.Finished = true
		}

		jsonPos, err := json.Marshal(partialPos)

		if err != nil {
			return nil, err
		}

		jsonPositions = append(jsonPositions, string(jsonPos))
	}

	return jsonPositions, nil
}
