import { TicketCreatedEvent } from "@m1cr0s3rv1c3s/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'test',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener,
    data,
    msg
  }
}

it('should create a ticket', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.price).toEqual(data.price)
})

it('should call ack', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})