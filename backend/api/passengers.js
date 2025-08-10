module.exports = app => {

    const { existsOrError, notExistsOrError } = app.api.validation;
    
    const save = async (req, res) => {
        const passenger = { ...req.body };

        if(req.params.id) passenger.passenger_id = req.params.id;

        try {

            existsOrError(passenger.passenger_name, 'Nome não informado.')
            existsOrError(passenger.phone, 'Número de contato não informado.')

            const passengerFromDB = await app.db('passengers')
                .where( {
                    passenger_id: passenger.passenger_id,
                    passenger_name: passenger.passenger_name
                } ).first()
            
            if(!(passenger.passenger_id === req.params.id)) {
                notExistsOrError( passengerFromDB, 'Passageiro já cadastrado.')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if(req.params.id === passenger.passenger_id){
            app.db('passengers')
                .update(passenger)
                .where( { 
                    passenger_id: passenger.passenger_id,
                    passenger_name: passenger.passenger_name,
                    phone: passenger.phone
                 } )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

        } else {
            app.db('passengers')
                .insert(passenger)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('passengers')
            .select('*')
            .then(passengers => res.json(passengers))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('passengers')
            .select('*')
            .where( { passenger_id: req.params.id } )
            .first()
            .then(passengers => res.json(passengers))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}