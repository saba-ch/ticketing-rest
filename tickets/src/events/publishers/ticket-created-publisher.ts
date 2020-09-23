import { TicketCreatedEvent, Publisher, Subjects } from '@m1cr0s3rv1c3s/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
