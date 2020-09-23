import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async (done) => {

  const ticket = Ticket.build({
    title: 'test',
    price: 10,
    userId: '829'
  })

  await ticket.save()

  const firstTicket = await Ticket.findById(ticket.id)
  const secondTicket = await Ticket.findById(ticket.id)

  firstTicket!.set({ title: '1203' })
  secondTicket!.set({ title: '1203' })

  await firstTicket!.save()

  try {
    await secondTicket!.save()
  } catch(err) {
    return done()
  }

  throw new Error('should not reach this')
})

it('updates version field', async () => {
  const ticket = await Ticket.build({
    title: '1231',
    price: 989,
    userId: 'jfskfj'
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})