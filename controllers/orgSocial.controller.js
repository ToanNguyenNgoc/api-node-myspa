const OrgSocials = require('../models/orgSocial.model');
const _context = require('../context')

const orgSocialController = {
  get: async (req, res) => {
    const filter = req.query.filter
    const context = await _context.paginateHistory(req, OrgSocials, filter, { createdAt: -1 })
    return res.status(200).json({ status: true, data: { context } })
  },
  post: async (req, res) => {
    try {
      if (!req.body.org_social_name || !req.body.org_social_number || !req.body.org_social_email) {
        return res.status(400).json({ message: 'Body is required' });
      }
      const newOrgSocial = new OrgSocials(Object.assign(req.body, {
        org_social_files: req.body.org_social_files ? JSON.stringify(req.body.org_social_files) : null,
      }));
      const response = await newOrgSocial.save();
      return res.status(200).json({ status: true, data: { context: response } })
    } catch (error) {
      return res.status(500).json(error)
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await OrgSocials.findByIdAndDelete(id)
      return res.status(202).json({ message: 'Deleted' })
    } catch (error) {
      return res.status(500).json(error)
    }

  }
}

module.exports = orgSocialController;