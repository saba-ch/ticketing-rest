import { ExpirationCompleteEvent, Publisher, Subjects } from "@m1cr0s3rv1c3s/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}