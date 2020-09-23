import { Listener, Subjects, OrderCancelledEvent } from "@m1cr0s3rv1c3s/common"
import { Message } from "node-nats-streaming"

import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'
import { queueGroupName } from './queue-group-name'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if(!ticket) { throw new Error('Ticket not found') }

    ticket.set({ orderId: undefined })

    await ticket.save()

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })

    msg.ack()
  }
}