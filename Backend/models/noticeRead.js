const { Schema, model } = require('mongoose');

const noticeReadSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  notice: { type: Schema.Types.ObjectId, ref: 'Notice', required: true },
  readAt: { type: Date, default: Date.now }
});

const NoticeRead = model('NoticeRead', noticeReadSchema);
module.exports = NoticeRead;
