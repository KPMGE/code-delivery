### Run consoles, inside container
```bash
# run producer console: 
kafka-console-producer --bootstrap-server=localhost:9092 --topic=route.new-direction


# run consumer console: 
kafka-console-consumer --bootstrap-server=localhost:9092 --topic=route.new-position --group=terminal
```
