const ManagerTrackingModel = require('../models/manager-tracking.model');
const _context = require('../context')

const ManagerTrackingController = {
  get: async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 30;

      const pipeline = [];
      if (req.query.search) {
        const regex = new RegExp(req.query.search, 'i');
        pipeline.push({
          $match: {
            $or: ['api_url', 'id_address', 'ip_device', 'device', 'screen'].map((field) => ({
              [field]: { $regex: regex },
            })),
          },
        });
      };
      if (req.query.subdomain) { pipeline.push({ $match: { subdomain: req.query.subdomain } }) };
      if (req.query.method) { pipeline.push({ $match: { method: req.query.method } }) };
      if (req.query.type) { pipeline.push({ $match: { type: req.query.type } }) };

      pipeline.push({ $sort: { 'createdAt': -1 } });
      pipeline.push({
        $facet: {
          list: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          total: [{ $count: 'count' }],
        },
      });

      const data = await ManagerTrackingModel.aggregate(pipeline);
      const list = (data[0]?.list || []);
      const total = data[0]?.total?.[0]?.count || 0;
      const context = {
        data: list,
        current_page: page,
        per_page: limit,
        total,
        total_page: Math.ceil(total / limit),
      }
      return res.status(200).json({ status: true, data: { context } });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Server error' })
    }
  },

  post: async (req, res) => {
    try {
      const body = req.body;
      const context = await ManagerTrackingModel.create(body);
      return res.status(200).json({ status: true, data: { context } });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Server error' })
    }
  }
};

module.exports = ManagerTrackingController;