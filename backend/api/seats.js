module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = async (req, res) => {
        const seats = { ...req.body };

        if(req.params.id) seats.seat_id = req.params.id;

        try {
            existsOrError( seats.flight_id, 'Erro ao pegar o número do voo.')
            existsOrError( seats.seat_number, 'Erro ao pegar o número do assento.')
            existsOrError( seats.status, 'Erro ao pegar os status.')

            const seatFromDB = await app.db('seats')
                .where( { 
                    seat_number: seats.seat_number,
                    flight_id: seats.flight_id,
                    status: "indisponível"
                } ).first()

            if(!seats.seat_id) {
                notExistsOrError(seatFromDB, 'Assento indisponível.')
            }
                
        } catch (msg) {
            return res.status(400).send(msg)
        } 

        if(seats.seat_id) {
            app.db('seats')
                .update( seats )
                .where( { seat_id: seats.seat_id } )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('seats')
                .insert( seats )
                .returning('seat_id')
                .then(ids => res.status(201).json({ obj: { seat_id:ids[0].seat_id} }))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
            app.db('seats')
                .select('*')
                .then(seats => res.json(seats))
                .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
            app.db('seats')
                .select('*')
                .where( { flight_id: req.params.id} )
                .then(seats => res.json(seats))
                .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}