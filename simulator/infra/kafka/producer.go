package kafka

import (
	"log"
	"os"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func NewKafkaProducer() *ckafka.Producer {
  configMap := &ckafka.ConfigMap {
    "bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
  }

  p, err := ckafka.NewProducer(configMap)
  if err != nil {
    log.Fatalf("error creating new producer: %v", err.Error())
  }

  return p
}

func Publish(msg string, topic string, producer *ckafka.Producer) error {
  message := &ckafka.Message{ 
    TopicPartition: ckafka.TopicPartition{
      Topic: &topic,
      Partition: ckafka.PartitionAny,
    },
    Value: []byte(msg),
  }

  err := producer.Produce(message, nil)
  if err != nil {
    return err
  }

  return nil
}
