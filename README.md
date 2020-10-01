# Bus ticket usecase

This is a sample use case for solving bus ticket problem for a single bus traveller 


## Context
1 bus, 40 seats. One ticket per seat.  

#####Features from the server:  
• Update the ticket status (open/close + adding user details)  
• View Ticket Status  
• View all closed tickets  
• View all open tickets  
• View Details of person owning the ticket.  
• Additional API for admin to reset the server (opens up all the tickets)  

## Development

We use `node` version `10.20.1`

```
nvm install 10.20.1
```

```
nvm use 10.20.1
```

The first time, you will need to run

```
npm install
```

Then just start the server with

```
npm run start
```

# API Validation

By using celebrate the req.body schema becomes clary defined at route level, so even frontend devs can read what an API endpoint expects without need to writting a documentation that can get outdated quickly.

```js
route.post(
  '/signup',
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  controller.signup,
);
```

**Example error**

```json
{
  "errors": {
    "message": "child \"email\" fails because [\"email\" is required]"
  }
}
```

