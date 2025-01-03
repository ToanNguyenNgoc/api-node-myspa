const context = {
    paginateHistory: async (req, collection, filterParams, sort, include) => {
        const populate = include ?? []
        const page = req.query.page ? parseInt(req.query.page) : 1
        const limit = req.query.limit ? parseInt(req.query.limit) : 15

        //Handle search keyword
        let filter = filterParams;
        if (req.query.search_column && req.query.search) {
            const columns_search = req.query.search_column.split(',')
            filter = Object.assign(filter, {
                $or: columns_search.map(column => ({
                    [column]: new RegExp(req.query.search, 'i')
                }))
            })
        }

        const data = await collection
            .find({ ...filter })
            .sort({ ...sort })
            .populate(populate)
            .skip((page * limit) - limit)
            .limit(limit)
        const count = await collection.find({ ...filter }).sort({ ...sort }).count()
        const total_page = Math.ceil(count / limit)
        const context = {
            data: data,
            current_page: page,
            per_page: limit,
            total: count,
            total_page,
            last_page: Math.ceil(count / limit)
        }
        return context
    },
}

module.exports = context