const axios = require("axios");

const lolController = {
  getAll: async (req, res) => {
    const { keyword } = req.query;
    const response = await axios.get(
      "https://youtube138.p.rapidapi.com/auto-complete/",
      {
        headers: {
          'X-RapidAPI-Key': 'c8f7f98ebamsh3f22109b4e348eap14dcd3jsndb416cd74d99',
          'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
        },
        params: { q: keyword ?? '', hl: 'vi', gl: 'VN' },
      }
    )
    return res.status(200).json({ message: response.data })
  }
}

module.exports = lolController