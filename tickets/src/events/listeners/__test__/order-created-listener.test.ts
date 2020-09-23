import mongoose from "mongoose"
import { OrderCreatedEvent, OrderStatus } from "@m1cr0s3rv1c3s/common"
import { Message } from "node-nats-streaming"

import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"


const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    price: 123,
    title: 'jkfds',
    userId: 'fjdksfjks'
  })

  await ticket.save()

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'fdsfdsf',
    status: OrderStatus.Created,
    userId: 'fdsfs',
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    ticket,
    msg,
    listener,
    data,
  }
}

it('sets the userId of ticket', async () => {
  const { listener, msg, data, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('calls the ack function', async () => {
  const { listener, msg, data, ticket } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('publishes ticket updated event', async () => {
  const { listener, msg, data } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})