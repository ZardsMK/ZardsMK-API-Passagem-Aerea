module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    const auth = app.config.passport.authenticate();

    app.post('/reservations', auth, app.api.reservations.save);
    app.post('/seats', auth, app.api.seats.save);
    app.post('/payments', auth, app.api.payments.save);
    app.post('/reservation_passengers', auth, app.api.reservation_passangers.save);
    app.post('/reservation_seats', auth, app.api.reservation_seats.save);
    app.put('/payments/:id', auth, app.api.payments.save);
    app.put('/reservations/:id', auth, app.api.reservations.save);

    app.route('/users')
        .all(auth)
        .post(app.api.user.save)
        .get(app.api.user.get);

    app.route('/users')
        .all(auth)
        .post(app.api.user.save)
        .get(app.api.user.get);

    app.route('/airlines')
        .post(auth, app.api.airlines.save)
        .get(app.api.airlines.get)

    app.route('/airlines/:id')
        .get(app.api.airlines.getById)
        .put(auth, app.api.airlines.save); 

    app.route('/flights')
        .post(auth, app.api.flights.save)
        .get(app.api.flights.get)

    app.route('/flights/:id')
        .get(app.api.flights.getById)
        .put(auth, app.api.flights.save); 
    
    app.route('/passengers')
        .all(auth)
        .post(app.api.passengers.save)
        .get(app.api.passengers.get);
    
    app.route('/passengers/:id')
        .all(auth)
        .get(app.api.passengers.getById)
        .put(app.api.passengers.save);

    app.route('/reservations')
        .get(app.api.reservations.get);
    
    app.route('/reservations/:id')
        .get(app.api.reservations.getById);

    app.route('/reservations/flight/:id')
        .all(auth)
        .get(app.api.reservations.getByFlightId);

    app.route('/reservations_passangers')
        .all(auth)
        .get(app.api.reservation_passangers.get);
    
    app.route('/reservations_passangers/:id')
        .all(auth)
        .get(app.api.reservation_passangers.getById)
        .put(app.api.reservation_passangers.save);

    app.route('/seats/reservation/:id')
        .get(app.api.reservation_seats.getBySeatId);

    app.route('/payments/reservation/:id')
        .all(auth)
        .get(app.api.reservations.getByUserId);

    app.route('/payments/pay/:id')
        .all(auth)
        .get(app.api.payments.getByReservation);

    app.route('/seats')
        .get(app.api.seats.get);

    app.route('/seats/:id')
        .get(app.api.seats.getById) 
        .put(auth, app.api.seats.save);
    
    app.route('/payments')
        .all(auth)
        .get(app.api.payments.get);

    app.route('/payments/:id')
        .all(auth)
        .get(app.api.payments.getById);
    
    app.route('/airports')
        .get(app.api.airports.get)
        .post(auth, app.api.airports.save);

    app.route('/airports/:id')
        .get(app.api.airports.getById)
        .put(auth, app.api.airports.save);

    app.route('/stats')
        .get(app.api.stat.get)
}