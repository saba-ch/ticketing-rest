import { OrderStatus } from '@m1cr0s3rv1c3s/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('returns 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'fjdksfjks',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('returns 401 when purchasing an order that does not belong to user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'fjdksfjks',
      orderId: order.id
    })
    .expect(401)
})

it('returns 400 when purchasing an cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId,
    status: OrderStatus.Cancelled,
    version: 0
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'fjdksfjks',
      orderId: order.id
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId,
    status: OrderStatus.Created,
    version: 0
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201)
  
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(order.price * 100)
  expect(chargeOptions.currency).toEqual('usd')

  const payment = await Payment.findOne({
    orderId: order.id
  })

  expect(payment).toBeDefined()
})