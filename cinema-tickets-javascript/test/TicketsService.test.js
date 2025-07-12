import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js';

describe('TicketService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Valid purchases', () => {
        it('should process a valid purchase correctly', () => {
            const service = new TicketService();
            const requests = [
                new TicketTypeRequest('ADULT', 2),
                new TicketTypeRequest('CHILD', 3),
                new TicketTypeRequest('INFANT', 1),
            ];
    
            const makePaymentSpy = jest.spyOn(TicketPaymentService.prototype, 'makePayment');
            const reserveSeatSpy = jest.spyOn(SeatReservationService.prototype, 'reserveSeat');
        
            service.purchaseTickets(1, ...requests);
        
            expect(makePaymentSpy).toHaveBeenCalledWith(1, (2*25 + 3*15));
            expect(reserveSeatSpy).toHaveBeenCalledWith(1, 5);
        });
    
        it('should allow a purchase with only adult ticket type requests', () => {
            const service = new TicketService();
            const makePaymentSpy = jest.spyOn(TicketPaymentService.prototype, 'makePayment');
            const reserveSeatSpy = jest.spyOn(SeatReservationService.prototype, 'reserveSeat');
      
            service.purchaseTickets(1, new TicketTypeRequest('ADULT', 3));
      
            expect(makePaymentSpy).toHaveBeenCalledWith(1, (3*25));
            expect(reserveSeatSpy).toHaveBeenCalledWith(1, 3);
        });
    
        it('should handle maximum allowed tickets (25)', () => {
            const service = new TicketService();
            const makePaymentSpy = jest.spyOn(TicketPaymentService.prototype, 'makePayment');
            const reserveSeatSpy = jest.spyOn(SeatReservationService.prototype, 'reserveSeat');
      
            service.purchaseTickets(1, new TicketTypeRequest('ADULT', 25));
      
            expect(makePaymentSpy).toHaveBeenCalledWith(1, (25*25));
            expect(reserveSeatSpy).toHaveBeenCalledWith(1, 25);
        });
    });

    describe('Input validation', () => {
        it('should throw an error if accountId is invalid - using 0', () => {
            const service = new TicketService();
    
            expect(() => service.purchaseTickets(0, new TicketTypeRequest('ADULT', 1)))
                .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(0, new TicketTypeRequest('ADULT', 1)))
            .toThrow('Invalid accountId');
        });

        it('should throw an error if accountId is invalid - using a float', () => {
            const service = new TicketService();

            expect(() => service.purchaseTickets(1.5, new TicketTypeRequest('ADULT', 1)))
              .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1.5, new TicketTypeRequest('ADULT', 1)))
              .toThrow('Invalid accountId');
          });
        
          it('should throw an error if accountId is invalid - using a string', () => {
            const service = new TicketService();

            expect(() => service.purchaseTickets('1', new TicketTypeRequest('ADULT', 1)))
              .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets('1', new TicketTypeRequest('ADULT', 1)))
              .toThrow('Invalid accountId');
          });
        
          it('should throw an error if accountId is invalid - using null', () => {
            const service = new TicketService();

            expect(() => service.purchaseTickets(null, new TicketTypeRequest('ADULT', 1)))
              .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(null, new TicketTypeRequest('ADULT', 1)))
              .toThrow('Invalid accountId');
          });
    
        it('should throw an error if there are no ticket type requests provided', () => {
            const service = new TicketService();
    
            expect(() => service.purchaseTickets(1))
                .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1))
                .toThrow('No ticket requests provided');
        });

        it('should throw an error if there is a negative ticket count', () => {
            const service = new TicketService();

            expect(() => service.purchaseTickets(1, new TicketTypeRequest('ADULT', -1)))
                .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1, new TicketTypeRequest('ADULT', -1)))
                .toThrow('Number of tickets cannot be negative');
        });
    });

    describe('Business rules', () => {
        it('should throw an error if more than 25 tickets are requested at once', () => {
            const service = new TicketService();
    
            expect(() => service.purchaseTickets(1, new TicketTypeRequest('ADULT', 26)))
                .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1, new TicketTypeRequest('ADULT', 26)))
                .toThrow('Cannot purchase more than 25 tickets at a time');
        });
    
        it('should throw an error if there is a child ticket requested without an adult ticket', () => {
            const service = new TicketService();

            expect(() => service.purchaseTickets(1, new TicketTypeRequest('CHILD', 3)))
                .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1, new TicketTypeRequest('CHILD', 3)))
                .toThrow('Child and Infant tickets require at least one Adult ticket');
        });
    
        it('should throw an error if an infant ticket is requested without an adult ticket', () => {
            const service = new TicketService();
    
            expect(() => service.purchaseTickets(1, new TicketTypeRequest('INFANT', 2)))
                .toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1, new TicketTypeRequest('INFANT', 2)))
                .toThrow('Child and Infant tickets require at least one Adult ticket');
        });
    
        it('should throw an error if the amount of infant tickets exceeds adult tickets', () => {
            const service = new TicketService();
    
            expect(() => service.purchaseTickets(1, 
                new TicketTypeRequest('ADULT', 1),
                new TicketTypeRequest('INFANT', 2)
            )).toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1, 
                new TicketTypeRequest('ADULT', 1),
                new TicketTypeRequest('INFANT', 2)
            )).toThrow('Each Infant must have an accompanying Adult');
        });
    
        it('should throw an error if the total tickets equals zero', () => {
            const service = new TicketService();

            expect(() => service.purchaseTickets(1, 
                new TicketTypeRequest('ADULT', 0),
                new TicketTypeRequest('CHILD', 0),
                new TicketTypeRequest('INFANT', 0)
            )).toThrow(InvalidPurchaseException);
            expect(() => service.purchaseTickets(1, 
                new TicketTypeRequest('ADULT', 0),
                new TicketTypeRequest('CHILD', 0),
                new TicketTypeRequest('INFANT', 0)
            )).toThrow('At least one ticket must be purchased');
        });
    });

    describe('Third-party service validation', () => {
        it('should test TicketPaymentService validation directly', () => {
            const paymentService = new TicketPaymentService();
            
            expect(() => paymentService.makePayment(1.5, 100))
                .toThrow(TypeError);
            expect(() => paymentService.makePayment(1.5, 100))
                .toThrow('accountId must be an integer');
            
            expect(() => paymentService.makePayment(1, 100.5))
                .toThrow(TypeError);
            expect(() => paymentService.makePayment(1, 100.5))
                .toThrow('totalAmountToPay must be an integer');
        });
      
        it('should test SeatReservationService validation directly', () => {
            const reservationService = new SeatReservationService();
            
            expect(() => reservationService.reserveSeat(1.5, 5))
                .toThrow(TypeError);
            expect(() => reservationService.reserveSeat(1.5, 5))
                .toThrow('accountId must be an integer');
            
            expect(() => reservationService.reserveSeat(1, 5.5))
                .toThrow(TypeError);
            expect(() => reservationService.reserveSeat(1, 5.5))
                .toThrow('totalSeatsToAllocate must be an integer');
        });
      });
});
