const pageBase64Images = require("../utils/pageBase64Images");

const toolController = {
  getImageBase64: async (req, res) => {
    const url = req.body.url;
    if (!url) return res.status(400).json({ status: false, message: 'url is required' });
    const images = await pageBase64Images.extract(url);
    const context = {
      image_base_64: images?.length > 0 ? images[0] : null,
    };
    return res.status(200).json({ status: true, data: { context } });
  }
};

module.exports = toolController;