const context = {
    paginateHistory: async (req, collection, filter, sort, include) => {
        const populate = include ?? []
        const page = req.query.page ? parseInt(req.query.page) : 1
        const limit = req.query.limit ? parseInt(req.query.limit) : 15
        const data = await collection
            .find({ ...filter })
            .sort({ ...sort })
            .populate(populate)
            .skip((page * limit) - limit).limit(limit)
        const count = await collection.find({ ...filter }).sort({ ...sort }).count()
        const context = {
            data: data,
            current_page: page,
            per_page: limit,
            total: count,
            total_page: Math.ceil(count / limit)
        }
        return context
    },
}

module.exports = context