import { OrderCreatedEvent, OrderStatus } from '@m1cr0s3rv1c3s/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'fdjkf',
    userId: 'fdjsfl',
    status: OrderStatus.Created,
    ticket: {
      id: 'fjdskf',
      price: 40
    }
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

it('replicates order info', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(data.ticket.price).toEqual(order!.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})