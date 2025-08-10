module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = async (req, res) => {
        const reservations_seats = { ...req.body };

        if(req.params.id) reservations_seats.id = req.params.id;

        try {
            existsOrError( reservations_seats.reservation_id, 'Id da reserva não informado.')
            existsOrError( reservations_seats.passenger_id, 'Id do passageiro não informado.')
            existsOrError( reservations_seats.seat_id, 'Id do assento não informado.')

            const reservationsSeatsFromDB = await app.db('reservation_seats')
                .where( { 
                    passenger_id: reservations_seats.passenger_id,
                    reservation_id: reservations_seats.reservation_id,
                    seat_id: reservations_seats.seat_id
                } ).first()

            if(!reservations_seats.id) {
                notExistsOrError(reservationsSeatsFromDB, 'Reserva de assento já reservado.')
            }
                
        } catch (msg) {
            return res.status(400).send(msg)
        } 

        if(reservations_seats.id) {
            app.db('reservation_seats')
                .update( reservations_seats )
                .where( { id: reservations_seats.id } )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('reservation_seats')
                .insert( reservations_seats )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
            app.db('reservation_seats')
                .select('*')
                .then(reservations_seats => res.json(reservations_seats))
                .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
            app.db('reservation_seats')
                .select('*')
                .where( { id: req.params.id} )
                .first()
                .then(reservations_seats => res.json(reservations_seats))
                .catch(err => res.status(500).send(err))
    }

    const getBySeatId = (req, res) => {
            app.db('reservation_seats')
                .select('*')
                .where( { seat_id: req.params.id} )
                .first()
                .then(reservations_seats => res.json(reservations_seats))
                .catch(err => res.status(500).send(err))
    }

    return { save, get, getById, getBySeatId }
}