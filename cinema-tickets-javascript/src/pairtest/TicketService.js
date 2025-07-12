import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';

const TICKET_PRICES = {
    ADULT: 25,
    CHILD: 15,
    INFANT: 0,
};
export default class TicketService {
   /**
   * @param {number} accountId
   * @param {...TicketTypeRequest} ticketTypeRequests
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
        throw new InvalidPurchaseException('Invalid accountId');
    }

    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
        throw new InvalidPurchaseException('No ticket requests provided');
    }

    const ticketCounts = this.#calculateTicketCounts(ticketTypeRequests);
    this.#validateBusinessRules(ticketCounts);

    const totalPrice = (ticketCounts.ADULT * TICKET_PRICES.ADULT) + (ticketCounts.CHILD * TICKET_PRICES.CHILD);
    const totalSeats = ticketCounts.ADULT + ticketCounts.CHILD;

    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalPrice);

    const reservationService = new SeatReservationService();
    reservationService.reserveSeat(accountId, totalSeats);
  }

  // Sums up the number of tickets for each ticket type and validates each request
  #calculateTicketCounts(ticketTypeRequests) {
    const ticketCounts = {
        ADULT: 0,
        CHILD: 0,
        INFANT: 0,
    };

    ticketTypeRequests.forEach(request => {
        const type = request.getTicketType();
        const count = request.getNoOfTickets();
  
        if (count < 0) {
            throw new InvalidPurchaseException('Number of tickets cannot be negative');
        }

        ticketCounts[type] += count;
    });

    return ticketCounts;
  }

  // Checks all business rules for ticket purchases
  #validateBusinessRules(ticketCounts) {
    const totalTickets = ticketCounts.ADULT + ticketCounts.CHILD + ticketCounts.INFANT;

    if (totalTickets === 0) {
        throw new InvalidPurchaseException('At least one ticket must be purchased');
    }
    
    if (totalTickets > 25) {
        throw new InvalidPurchaseException('Cannot purchase more than 25 tickets at a time');
    }

    if (ticketCounts.ADULT === 0 && (ticketCounts.CHILD > 0 || ticketCounts.INFANT > 0)) {
        throw new InvalidPurchaseException('Child and Infant tickets require at least one Adult ticket');
    }

    if (ticketCounts.INFANT > ticketCounts.ADULT) {
        throw new InvalidPurchaseException('Each Infant must have an accompanying Adult');
    }
  }

}
