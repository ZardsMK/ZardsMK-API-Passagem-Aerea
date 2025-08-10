module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = async (req, res) => {
        const flights = { ...req.body }
        if(req.params.id) flights.flight_id = req.params.id;

        try {
            existsOrError(flights.airline_id, 'Companhia não informada.')
            existsOrError(flights.origin, 'Local de partida não informado.')
            existsOrError(flights.destination, 'Local de chegada não informado.')
            existsOrError(flights.departure_time, 'Data de partida não informado.')
            existsOrError(flights.arrival_time, 'Data de chegada não informado.')
            
            const flightsFromDB = await app.db('flights')
                .where( {
                    airline_id: flights.airline_id,
                    origin: flights.origin,
                    destination: flights.destination,
                    departure_time: flights.departure_time

                } ).first()
            if(!flights.flight_id) {
                notExistsOrError( flightsFromDB, 'Voo já cadastrado.')
            }
        } catch (msg) {
            return res.status(400).send(msg);
        }

        if(flights.flight_id) {
            app.db('flights')
                .update(flights)
                .where({ flight_id: flights.flight_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('flights')
                .insert(flights)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
        
    }

        const get = (req, res) => {
            app.db('flights')
                .select('*')
                .then( flights => res.json(flights) )
                .catch(err => res.status(500).send(err))
            }

        const getById = (req, res) => {
            app.db('flights')
                .select('*')
                .where( { flight_id: req.params.id } )
                .first()
                .then( flights => res.json(flights) )
                .catch(err => res.status(500).send(err))
            }

    return { save, get, getById }
}