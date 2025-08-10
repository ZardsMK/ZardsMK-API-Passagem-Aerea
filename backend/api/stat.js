module.exports = app => {
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        payaments: Number,
        reservations: Number,
        passengers: Number,
        flights: Number,
        createdAt: Date
    })

    const get = (req, res) => {
        Stat.findOne( {}, {}, {sort: {'createdAt': -1 } })
            .then(stat => {
                const defautStat = {
                    users: 0,
                    payaments: 0,
                    reservations: 0,
                    passengers: 0,
                    flights: 0,
                } 
                res.json(stat || defautStat)
            })
    }

    return { Stat, get }
}