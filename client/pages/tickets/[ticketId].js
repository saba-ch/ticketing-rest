import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

const TicketShow = ({ ticket }) => {

  const { doRequest, errors } = useRequest({
    method: 'post',
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
    url: '/api/orders',
    body: {
      ticketId: ticket.id
    },
  })

  

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button
        className='btn btn-primary'
        onClick={() => doRequest()}
      >
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow