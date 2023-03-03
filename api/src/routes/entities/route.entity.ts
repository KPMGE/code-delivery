import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type RouteDocument = Route & Document

@Schema()
export class Route {
  @Prop()
  title: string

  @Prop(
    raw({
      lat: Number,
      lng: Number
    }),
  )
  startPositon: { lat: number; lng: number }

  @Prop(
    raw({
      lat: Number,
      lng: Number
    }),
  )
  endPosition: { lat: number; lng: number }
}

export const RouteSchema = SchemaFactory.createForClass(Route)
