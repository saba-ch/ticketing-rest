import { Publisher, Subjects, OrderCreatedEvent } from '@m1cr0s3rv1c3s/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated =  Subjects.OrderCreated
}