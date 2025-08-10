module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = async (req, res) => {
        const reservations = { ...req.body };
        
        if(req.params.id) reservations.reservation_id = req.params.id;

        try {
            existsOrError( reservations.user_id, 'Faça login para comprar a passagem.')
            existsOrError( reservations.flight_id, 'Número do voo não informado.')
            existsOrError( reservations.reserved_at, 'Data de reserva não informada.')
            existsOrError( reservations.expires_at, 'Data de expiração não informada.')
            existsOrError( reservations.total_amount, 'Valor não passado.')
            existsOrError( reservations.status, 'Problema no status.')

            const reservationsFromDB = await app.db('reservations')
                .where( { 
                    user_id: reservations.user_id,
                    flight_id: reservations.flight_id,
                    reserved_at: reservations.reserved_at
                } ).first()

            if(!reservations.reservation_id) {
                notExistsOrError(reservationsFromDB, 'Reserva já feita.')
            }
                
        } catch (msg) {
            return res.status(400).send(msg)
        } 
        if(reservations.reservation_id) {
            app.db('reservations')
                .update( reservations )
                .where( { reservation_id: reservations.reservation_id } )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('reservations')
                .insert( reservations )
                .returning('reservation_id')
                .then(ids => res.status(201).json({ obj: { reservation_id: ids[0].reservation_id } }))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
            app.db('reservations')
                .select('*')
                .then(reservations => res.json(reservations))
                .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
            app.db('reservations')
                .select('*')
                .where( { reservation_id: req.params.id } )
                .first()
                .then(reservations => res.json(reservations))
                .catch(err => res.status(500).send(err))
    }

    const getByFlightId = (req, res) => {
            app.db('reservations')
                .select('*')
                .where( { flight_id: req.params.id} )
                .then(reservations => res.json(reservations))
                .catch(err => res.status(500).send(err))
    }

    const getByUserId = (req, res) => {
            app.db('reservations')
                .select('*')
                .where( { user_id: req.params.id} )
                .then(reservations => res.json(reservations))
                .catch(err => res.status(500).send(err))
    }

    return { save, get, getById, getByFlightId, getByUserId }
}