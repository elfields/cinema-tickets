import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

describe('TicketTypeRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a valid request with ADULT type', () => {
        const request = new TicketTypeRequest('ADULT', 2);

        expect(request.getTicketType()).toBe('ADULT');
        expect(request.getNoOfTickets()).toBe(2);
    });

    it('should create a valid request with CHILD type', () => {
        const request = new TicketTypeRequest('CHILD', 1);

        expect(request.getTicketType()).toBe('CHILD');
        expect(request.getNoOfTickets()).toBe(1);
    });

    it('should create a valid request with INFANT type', () => {
        const request = new TicketTypeRequest('INFANT', 1);

        expect(request.getTicketType()).toBe('INFANT');
        expect(request.getNoOfTickets()).toBe(1);
    });

    it('should throw TypeError for invalid ticket type', () => {
        expect(() => new TicketTypeRequest('INVALID', 1))
        .toThrow(TypeError);
        expect(() => new TicketTypeRequest('INVALID', 1))
        .toThrow('type must be ADULT, CHILD, or INFANT');
    });

    it('should throw TypeError for a non-integer ticket count', () => {
        expect(() => new TicketTypeRequest('ADULT', 1.5))
        .toThrow(TypeError);
        expect(() => new TicketTypeRequest('ADULT', 1.5))
        .toThrow('noOfTickets must be an integer');
    });

    it('should throw TypeError for string ticket count', () => {
        expect(() => new TicketTypeRequest('ADULT', '2'))
        .toThrow(TypeError);
    });
});