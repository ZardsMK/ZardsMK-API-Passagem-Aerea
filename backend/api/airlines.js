module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = async (req, res) => {
        const airline = { ...req.body }
        if(req.params.id) airline.airline_id = req.params.id;

        try {
            existsOrError(airline.name, 'Nome não informado.');
            existsOrError(airline.logo_url, 'Url não informado.');

            const airlineFromDB = await app.db('airlines')
                .where({ name: airline.name }).first();
            if(!airline.airline_id){
                notExistsOrError(airlineFromDB, 'Companhia já cadastrado.')
            }
        } catch (msg) {
            return res.status(400).send(msg);
        }

        if(airline.airline_id) {
            app.db('airlines')
                .update(airline)
                .where({ airline_id: airline.airline_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('airlines')
                .insert(airline)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('airlines')
            .select('*')
            .then(airlines => res.json(airlines))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('airlines')
            .select('*')
            .where( { airline_id: req.params.id} )
            .first()
            .then(airlines => res.json(airlines))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}