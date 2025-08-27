const {
  ManagerTrackingUrlModel,
  ManagerTrackingUrlCounterModel,
  ManagerTrackingModel
} = require('../models/manager-tracking.model');

class ManagerTrackingController {
  static async get(req, res) {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 30;
      const start_date = req.query.start;
      const end_date = req.query.end;
      const pipeline = [];

      if (req.query.search) {
        const regex = new RegExp(req.query.search, 'i');
        const searchableFields = ['api_url', 'ip_address', 'ip_device', 'device', 'screen'];

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

      if (start_date || end_date) {
        const dateFilter = {};
        if (start_date) {
          dateFilter.$gte = new Date(start_date);
        }
        if (end_date) {
          const end = new Date(end_date);
          end.setHours(23, 59, 59, 999);
          dateFilter.$lte = end;
        }
        pipeline.push({ $match: { createdAt: dateFilter } });
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
      const parsedUrl = new URL(body.api_url);
      const url = `${parsedUrl.origin}${parsedUrl.pathname}`;
      const manager_tracking_url_id = await ManagerTrackingController.findOrCreateManagerUrl(body.api_url);
      await ManagerTrackingController.handleManagerTrackingCounter(manager_tracking_url_id);

      const context = await ManagerTrackingModel.create({
        ...body,
        api_url: url,
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
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 30;
      const sort = req.query.sort || '-count_item';
      const startDate = req.query.start ? new Date(`${req.query.start}T00:00:00.000Z`) : null;
      const endDate = req.query.end ? new Date(`${req.query.end}T23:59:59.999Z`) : null;
      if (endDate) endDate.setHours(23, 59, 59, 999);
      // const pipeline = [
      //   {
      //     $lookup: {
      //       from: 'managertrackings',
      //       let: { urlId: '$_id' },
      //       pipeline: [
      //         {
      //           $match: {
      //             $expr: {
      //               $and: [
      //                 { $eq: ['$manager_tracking_url_id', '$$urlId'] },
      //                 ...(startDate ? [{ $gte: ['$createdAt', startDate] }] : []),
      //                 ...(endDate ? [{ $lte: ['$createdAt', endDate] }] : []),
      //               ]
      //             }
      //           }
      //         }
      //       ],
      //       as: 'items'
      //     }
      //   },
      //   { $addFields: { count_item: { $size: '$items' } } },
      //   { $project: { items: Number(req.query.items || 0) } },
      // ];
      const pipeline = [
        {
          $lookup: {
            from: 'managertrackingcounters',
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
        {
          $addFields: {
            count: {
              $reduce: {
                input: '$items',
                initialValue: 0,
                in: {
                  $add: ['$$value', { $ifNull: ['$$this.count', 0] }]
                }
              }
            }
          }
        }
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
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Server error' });
    }
  }

  static async handleManagerTrackingCounter(manager_tracking_url_id) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const existingCounter = await ManagerTrackingUrlCounterModel.findOne({
        manager_tracking_url_id,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      if (existingCounter) {
        await ManagerTrackingUrlCounterModel.updateOne(
          { _id: existingCounter._id },
          { $inc: { count: 1 } }
        );
      } else {
        await ManagerTrackingUrlCounterModel.create({
          manager_tracking_url_id,
          count: 1
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async getSeedManagerTrackingUrlCounter(req, res) {
    const pipeline = [
      { $lookup: { from: 'managertrackings', localField: '_id', foreignField: 'manager_tracking_url_id', as: 'items' } },
      { $addFields: { count_item: { $size: '$items' } } },
      { $project: { items: 0 } },
    ];
    const data = await ManagerTrackingUrlModel.aggregate(pipeline);
    await Promise.all(data.map((item) => {
      ManagerTrackingUrlCounterModel.create({
        manager_tracking_url_id: item._id,
        count: item.count_item
      })
    }))
    return res.status(200).json(data);
  }
}
module.exports = ManagerTrackingController;
