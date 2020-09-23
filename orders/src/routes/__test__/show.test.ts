import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Ticket } from "../../models/ticket"


it('fetches the order', async () => {
  const ticket = Ticket.build({
    title: 'fdsjkf',
    price: 19,
    id: new mongoose.Types.ObjectId().toHexString(),
  })
  await ticket.save()

  const user = global.signin()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  
  expect(order.id).toEqual(fetchedOrder.id)
})

it('returns unauthorized if we try to access someone elses order', async () => {
  const ticket = Ticket.build({
    title: 'fdsjkf',
    price: 19,
    id: new mongoose.Types.ObjectId().toHexString(),
  })
  await ticket.save()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})