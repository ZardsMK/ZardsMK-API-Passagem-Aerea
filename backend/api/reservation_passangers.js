module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = async (req, res) => {
        const reservations_passangers = { ...req.body };

        if(req.params.id) reservations_passangers.id = req.params.id;

        try {

            existsOrError( reservations_passangers.reservation_id, 'Id da reserva não informado.')
            existsOrError( reservations_passangers.passenger_name, 'Nome do passageiro não informada.')
            const reservationsPassangerFromDB = await app.db('reservation_passengers')
                .where( { 
                    passenger_name: reservations_passangers.passenger_name,
                    reservation_id: reservations_passangers.reservation_id
                } ).first()

            if(!reservations_passangers.id) {
                notExistsOrError(reservationsPassangerFromDB, 'Passageiro já reservou assento(s).')
            }
                
        } catch (msg) {
            return res.status(400).send(msg)
        } 

        if(reservations_passangers.id) {
            app.db('reservation_passengers')
                .update( reservations_passangers )
                .where( { id: reservations_passangers.id } )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('reservation_passengers')
                .insert( reservations_passangers )
                .returning('id')
                .then(ids => res.status(201).json({ obj: { id: ids[0].id } }))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
            app.db('reservation_passengers')
                .select('*')
                .then(reservations_passangers => res.json(reservations_passangers))
                .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
            app.db('reservation_passengers')
                .select('*')
                .where( { id: req.params.id} )
                .first()
                .then(reservations_passangers => res.json(reservations_passangers))
                .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}