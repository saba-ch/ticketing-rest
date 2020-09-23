import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent } from "@m1cr0s3rv1c3s/common"

import { OrderCancelledListener } from '../order-cancelled-listener'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    price: 123,
    title: 'fjdks',
    userId: 'fjsk'
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener,
    ticket,
    data,
    msg
  }

}

it('should unlock ticket call ack and publish', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})