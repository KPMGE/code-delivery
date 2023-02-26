package main

import (
	"fmt"
	"log"

	"github.com/KPMGE/code-delivery/infra/kafka"
	kafkaprod "github.com/KPMGE/code-delivery/application/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error loading .env file: %v", err.Error())
	}
}

func main() {
  msgChan := make(chan *ckafka.Message)
  consumer := kafka.NewKafkaConsumer(msgChan)
  go consumer.Consume()

  for msg := range msgChan {
    fmt.Println("messge received: " + string(msg.Value))
    go kafkaprod.Produce(msg)
  }
}
