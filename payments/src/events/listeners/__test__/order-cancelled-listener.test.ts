import { OrderCancelledEvent, OrderStatus } from '@m1cr0s3rv1c3s/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const data: OrderCancelledEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 1,
    ticket: {
      id: 'fjdskf',
    }
  }

  const order = Order.build({
    id: data.id,
    version: 0,
    price: 10,
    status: OrderStatus.Created,
    userId: 'fdjksf'
  })

  await order.save()

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener,
    data,
    msg,
    order
  }
}

it('marks order as cancelled', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(data.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})