FROM golang:1.16

ENV PATH="/go/bin:${PATH}"

RUN apt-get update && \
    apt-get install build-essential librdkafka-dev -y

CMD [ "tail", "-f", "/dev/null" ]
