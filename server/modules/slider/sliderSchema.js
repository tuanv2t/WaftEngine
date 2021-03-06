const mongoose = require('mongoose');
const schema = mongoose.Schema;

const sliderSchema = new schema({
  slider_name: { type: String },
  slider_key: { type: String },
  slug_url: { type: String },
  images: [
    {
      image: { type: schema.Types.ObjectId, ref: 'file' },
      caption: { type: String },
      link: { type: String },
    },
  ],
  settings: { type: schema.Types.Mixed },
  is_removal: { type: Boolean, default: true },
  is_deleted: { type: Boolean, required: true, default: false },
  added_by: { type: schema.Types.ObjectId, ref: 'users' },
  added_at: { type: Date, default: Date.now },
});
module.exports = Slider = mongoose.model('slider', sliderSchema);
