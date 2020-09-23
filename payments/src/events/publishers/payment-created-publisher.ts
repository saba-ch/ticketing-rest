import { PaymentCreatedEvent, Publisher, Subjects } from "@m1cr0s3rv1c3s/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}