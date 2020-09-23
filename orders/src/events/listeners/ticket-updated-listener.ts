import { Listener, TicketUpdatedEvent, Subjects } from '@m1cr0s3rv1c3s/common'
import { Message } from 'node-nats-streaming'

import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data)
    if(!ticket) { throw new Error('Ticket not found') }
    
    const { price, title } = data
    ticket.set({ title, price })

    await ticket.save()

    msg.ack()
  }
}