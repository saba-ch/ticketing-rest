import { Publisher, Subjects, OrderCancelledEvent } from '@m1cr0s3rv1c3s/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}