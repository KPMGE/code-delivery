import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Producer } from 'kafkajs';
import { Socket, Server } from 'socket.io'

type KafkaMessage = {
  routeId: string
  clientId: string
  position: [number, number]
  finished: boolean
};

@WebSocketGateway()
export class RoutesGateway implements OnModuleInit {
  private kafkaProducer: Producer

  @WebSocketServer()
  server: Server

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka
  ) { }


  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect()
  }

  @SubscribeMessage('new-direction')
  handleMessage(client: Socket, payload: { routeId: string }) {
    this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({ routeId: payload.routeId, clientId: client.id })
        }
      ]
    })

    console.log(payload)
  }

  sendPosition(data: KafkaMessage) {
    const {clientId, ...rest} = data
    const clients = this.server.sockets

    const hasClientConnected = clients.sockets.has(clientId)
    if (!hasClientConnected) {
      console.log(`The client with clientId: ${clientId} is not connected to the server`)
      return
    }

    const client = clients.sockets.get(clientId)
    client.emit('new-position', rest)
  }
}
