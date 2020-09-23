import { Publisher, TicketUpdatedEvent, Subjects } from "@m1cr0s3rv1c3s/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
