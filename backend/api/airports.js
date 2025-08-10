module.exports = app => {

    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const airports = { ...req.body }

        if(req.params.id) airports.airport_id = req.params.id

        try {
            existsOrError(airports.name, 'Nome não informado.')
            existsOrError(airports.city, 'Cidade não informado.')
            existsOrError(airports.country, 'País não informado.')
            existsOrError(airports.code, 'Código não informado.')

            const airportsFromDB = await app.db('airports')
                .where( { 
                    name: airports.name,
                    code: airports.code
                 } ).first();
            
            if(!airports.airport_id) {
                    notExistsOrError(airportsFromDB, 'Aeroporto já cadastrado.')
            }

            
        } catch (msg) {
            return res.status(400).send(msg)
        }
        
        if(airports.airport_id) {
            app.db('airports')
                .update(airports)
                .where( {airport_id: airports.airport_id} )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('airports')
                .insert(airports)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const get = (req, res) => {
        app.db('airports')
            .select('*')
            .then(airports => res.json(airports))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('airports')
            .select('*')
            .where( { airport_id: req.params.id } )
            .first()
            .then(airports => res.json(airports))
            .catch(err => res.status(500).send(err))
    }


    return { save, get, getById }
}