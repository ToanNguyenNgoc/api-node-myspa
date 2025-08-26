const {
  ManagerTrackingUrlModel,
  ManagerTrackingModel
} = require('../models/manager-tracking.model');

class ManagerTrackingController {
  static async get(req, res) {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 30;

      const pipeline = [];

      if (req.query.search) {
        const regex = new RegExp(req.query.search, 'i');
        const searchableFields = ['api_url', 'id_address', 'ip_device', 'device', 'screen'];

        pipeline.push({
          $match: {
            $or: searchableFields.map(field => ({
              [field]: { $regex: regex }
            }))
          }
        });
      }

      if (req.query.subdomain) {
        pipeline.push({ $match: { subdomain: req.query.subdomain } });
      }

      if (req.query.method) {
        pipeline.push({ $match: { method: req.query.method } });
      }

      if (req.query.type) {
        pipeline.push({ $match: { type: req.query.type } });
      }

      if (req.query.start || req.query.end) {
        const dateFilter = {};

        if (req.query.start) {
          const start = new Date(req.query.start); // Ex: "2025-07-26 13:55:25"
          if (!isNaN(start.getTime())) {
            dateFilter.$gte = start;
          }
        }

        if (req.query.end) {
          const end = new Date(req.query.end); // Ex: "2025-08-27 00:00:00"
          if (!isNaN(end.getTime())) {
            dateFilter.$lte = end;
          }
        }

        if (Object.keys(dateFilter).length > 0) {
          pipeline.push({ $match: { createdAt: dateFilter } });
        }
      }

      pipeline.push({ $sort: { createdAt: -1 } });
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
      const list = data[0]?.list || [];
      const total = data[0]?.total?.[0]?.count || 0;

      return res.status(200).json({
        status: true,
        data: {
          context: {
            data: list,
            current_page: page,
            per_page: limit,
            total,
            total_page: Math.ceil(total / limit),
          }
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Server error' });
    }
  }

  static async post(req, res) {
    try {
      const body = req.body;
      const manager_tracking_url_id = await ManagerTrackingController.findOrCreateManagerUrl(body.api_url);

      const context = await ManagerTrackingModel.create({
        ...body,
        manager_tracking_url_id,
      });

      return res.status(200).json({ status: true, data: { context } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Server error' });
    }
  }
  //GROUP URL

  static async findOrCreateManagerUrl(api_url) {
    const parsedUrl = new URL(api_url);
    const url = `${parsedUrl.origin}${parsedUrl.pathname}`;
    const existing = await ManagerTrackingUrlModel.findOne({ url });
    if (existing) {
      return existing._id;
    }
    const created = await ManagerTrackingUrlModel.create({ url });
    return created._id;
  }

  static async getManagerTrackingUrls(req, res) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 30;
    const sort = req.query.sort || '-count_item';
    const startDate = req.query.start ? new Date(req.query.start) : null;
    const endDate = req.query.end ? new Date(req.query.end) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const pipeline = [
      {
        $lookup: {
          from: 'managertrackings',
          let: { urlId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$manager_tracking_url_id', '$$urlId'] },
                    ...(startDate ? [{ $gte: ['$createdAt', startDate] }] : []),
                    ...(endDate ? [{ $lte: ['$createdAt', endDate] }] : []),
                  ]
                }
              }
            }
          ],
          as: 'items'
        }
      },
      { $addFields: { count_item: { $size: '$items' } } },
      { $project: { items: Number(req.query.items || 0) } },
    ];
    //SEARCH
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      pipeline.push({
        $match: {
          $or: ['url'].map(field => ({
            [field]: { $regex: regex }
          }))
        }
      });
    }
    //DATE

    //SORT
    const sortField = sort.replace(/^-/, '');
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });
    //PAGINATE
    pipeline.push({
      $facet: {
        list: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        total: [{ $count: 'count' }],
      },
    });
    const data = await ManagerTrackingUrlModel.aggregate(pipeline);
    const list = data[0]?.list || [];
    const total = data[0]?.total?.[0]?.count || 0;
    return res.status(200).json({
      status: true,
      data: {
        context: {
          data: list,
          current_page: page,
          per_page: limit,
          total,
          total_page: Math.ceil(total / limit),
        }
      }
    });
  }
}
module.exports = ManagerTrackingController;
