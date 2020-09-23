import { TicketUpdatedEvent } from '@m1cr0s3rv1c3s/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"


const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fmdskf',
    price: 1
  })

  await ticket.save()


  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    price: 10,
    title: 'fdsjkf',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1
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

it('finds and updates a ticket', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(data.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks a message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('do not call ack if event is in future', async () => {
  const { listener, data, msg } = await setup()

  try {
    await listener.onMessage({ ...data, version: data.version + 1 }, msg)
  } catch(err) {}
  
  expect(msg.ack).not.toHaveBeenCalled()
})
