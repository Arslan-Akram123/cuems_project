const noticeSchema = require('../models/notice');
const userSchema = require('../models/user');
const NoticeRead = require('../models/noticeRead');


async function addNotice(req, res) {
  try {
    const { title, description } = req.body;
    // console.log(title, description);
    const errors = [];

    // Title validation
    if (!title || title.trim() === '') {
      errors.push({
        field: 'title',
        message: 'Title is required'
      });
    } else {
      const trimmedTitle = title.trim();

      if (trimmedTitle.length < 2) {
        errors.push({
          field: 'title',
          message: 'Title must be at least 2 characters long'
        });
      } else if (trimmedTitle.length > 100) {
        errors.push({
          field: 'title',
          message: 'Title cannot exceed 100 characters'
        });
      } else if (!/^[a-zA-Z0-9\s\-_,.()!?@#$%^&*]+$/.test(trimmedTitle)) {
        errors.push({
          field: 'title',
          message: 'Title contains only alphanumeric characters and basic punctuation'
        });
      }
    }

    // Description validation
    if (!description || description.trim() === '') {
      errors.push({
        field: 'description',
        message: 'Description is required'
      });
    } else {
      const trimmedDescription = description.trim();

      if (trimmedDescription.length < 10) {
        errors.push({
          field: 'description',
          message: 'Description must be at least 10 characters long'
        });
      } else if (trimmedDescription.length > 2000) {
        errors.push({
          field: 'description',
          message: 'Description cannot exceed 2000 characters'
        });
      }
    }

    //  console.log(errors[0].message);
    // Check if there are any validation errors
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0].message
      });
    }
    const notice = new noticeSchema({ title, description });
    await notice.save();
    res.status(201).json({ message: 'Notice added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding notice', error: error.message });
  }
}

async function getNotices(req, res) {
  try {
    const notices = await noticeSchema.find();
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error: error.message });
  }
}

const notificationOfUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const allNotices = await noticeSchema.find().sort({ createdAt: -1 });
    const readRecords = await NoticeRead.find({ user: userId }).select('notice');

    const readNoticeIds = readRecords.map(r => r.notice.toString());

    const notices = allNotices.map(n => ({
      _id: n._id,
      title: n.title,
      description: n.description,
      createdAt: n.createdAt,
      isRead: readNoticeIds.includes(n._id.toString())
    }));


    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error: error.message });
  }
};

const markNoticeAsRead = async (req, res) => {
  try {
    const { noticeId } = req.body;
    const userId = req.user.id;

    const alreadyRead = await NoticeRead.findOne({ user: userId, notice: noticeId });

    if (!alreadyRead) {
      await NoticeRead.create({ user: userId, notice: noticeId });
    }

    res.status(200).json({ message: 'Notice marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notice as read', error: error.message });
  }
};

module.exports = { addNotice, getNotices, notificationOfUser, markNoticeAsRead };