package kafka

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/KPMGE/code-delivery/application/route"
	"github.com/KPMGE/code-delivery/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

// ex: { "routeId": "1", "clientId":"1" }
func Produce(msg *ckafka.Message) {
  producer := kafka.NewKafkaProducer()
  route := route.NewRoute()

  err := json.Unmarshal([]byte(string(msg.Value)), &route)
  if err != nil {
    log.Fatalf("error unmarshaling route: %v", err.Error())
  }

  err = route.LoadPositions()
  if err != nil {
    log.Fatalf("error loading positions: %v", err.Error())
  }

  positions, err := route.ExportPositionsAsJson()
  if err != nil {
    log.Fatalf("error exporting positions: %v", err.Error())
  }

  topic := os.Getenv("KAFKA_PRODUCE_TOPIC")
  for _, p := range positions {
    kafka.Publish(p, topic, producer)
    time.Sleep(time.Millisecond * 500)
  }
}

