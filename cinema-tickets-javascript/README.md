# Cinema Tickets Service

A Node.js implementation of a ticket purchasing service that handles adult, child, and infant tickets with specific business rules.

## Features

- Supports three ticket types: Adult (£25), Child (£15), Infant (£0)
- Enforces business rules (max 25 tickets, adults required for children/infants)
- Integrates with payment and seat reservation services
- Comprehensive validation and error handling

## Requirements

- Node.js v20.9.0 or higher
- npm

## Installation

```bash
npm install
```

## Running Tests

```bash
npm test
```

Tests use Jest (https://jestjs.io/) and are located in the `test/` directory.

## Usage

```javascript
import TicketService from './src/pairtest/TicketService.js';
import TicketTypeRequest from './src/pairtest/lib/TicketTypeRequest.js';

const service = new TicketService();

service.purchaseTickets(
    1,
    new TicketTypeRequest('ADULT', 2),
    new TicketTypeRequest('CHILD', 1),
    new TicketTypeRequest('INFANT', 1)
);
```

## Business Rules

- Maximum 25 tickets per purchase
- Child and Infant tickets require at least one Adult ticket
- Infants do not pay and do not get seats. They are seated on an Adult's lap
- All accounts with ID > 0 are valid
- Payment and seat reservation are handled by external services