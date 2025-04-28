const mongoose = require('mongoose');

const orgSocials = mongoose.Schema({
  org_social_name: { type: String },
  org_social_number: { type: String },
  org_social_email: { type: String },
  org_social_content: { type: String },
  org_social_files: { type: String },
}, {
  timestamps: true
});

const OrgSocials = mongoose.model('OrgSocials', orgSocials);
module.exports = OrgSocials;