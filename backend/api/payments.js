module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const payments = { ...req.body }

        if(req.params.id) payments.payment_id = req.params.id
        
        try {

            existsOrError(payments.reservation_id, 'Número da reserva não informado.')
            existsOrError(payments.amount, 'Valor não informado.')
            existsOrError(payments.payment_method, 'Número da reserva não informado.')
  
            const paymentFromDB = await app.db('payments')
                .where( { 
                    reservation_id: payments.reservation_id,
                    payment_status: 'pendente',
                    amount: payments.amount
                } ).first();
            
            if(!payments.payment_id) {
                notExistsOrError(paymentFromDB, 'Pagamento já foi realizado.')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if(payments.payment_id){
            app.db('payments')
                .update(payments)
                .where( { 
                    payment_id: payments.payment_id,
                    reservation_id: payments.reservation_id
                } )
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('payments')
                .insert(payments)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('payments')
            .select('*')
            .then(payments => res.json(payments))
            .catch(err => res.status(500).send(err))
    } 

    const getById = (req, res) => {
        app.db('payments')
            .select('*')
            .where( { payment_id: req.params.id } )
            .first()
            .then(payments => res.json(payments))
            .catch(err => res.status(500).send(err))
    }

    const getByReservation = (req, res) => {
        app.db('payments')
            .select('*')
            .where( { reservation_id: req.params.id } )
            .first()
            .then(payments => res.json(payments))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById, getByReservation }
}