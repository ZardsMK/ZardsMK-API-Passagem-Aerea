import schedule from 'node-schedule'

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const payamentsCount = await app.db('payments').count('payment_id').first()
        const reservationsCount = await app.db('reservations').count('reservation_id').first()
        const passengersCount = await app.db('passengers').count('passenger_id').first()
        const flightsCount = await app.db('flights').count('flight_id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {}, 
            { sort: { 'createdAt': -1 } })

        const stat = new Stat({
            users: usersCount.count,
            payaments: payamentsCount.count,
            reservations: reservationsCount.count,
            passengers: passengersCount.count,
            flights: flightsCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changePayaments = !lastStat || stat.payaments !== lastStat.payaments
        const changeReservations = !lastStat || stat.reservations !== lastStat.reservations
        const changePassengers = !lastStat || stat.passengers !== lastStat.passengers
        const changeFlights = !lastStat || stat.flights !== lastStat.flights

        if( changeUsers ||
            changePayaments ||
            changeReservations ||
            changePassengers ||
            changeFlights 
        ) {
            stat.save().then(() => console.log('[Stats] Estatíticas atualizadas!'))
        }
    })

}