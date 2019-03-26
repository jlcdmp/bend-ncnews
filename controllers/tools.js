

exports.sortByCheck = (q) => {
  if (q.sort_by !== 'created_at' || q.sort_by !== 'votes' || q.sort_by !== 'article_id') {
    res.status(400).send({ message: `Cannot sort_by ${q.sort_by}` });
  }
};

exports.authorCheck = (q) => {
  if (q.author !== 'butter_bridge' && q.author !== 'rogersop' && q.author !== 'icellusedkars') {
    res.status(400).send({ message: `Author ${q.author} does not exsist` });
  }
};

exports.orderByCheck = (q) => {
  if (q.order_by !== 'asc' || q.order_by !== 'desc') {
    res.status(400).send({ message: `Order_by ${q.order_by} does not exsist use asc or desc instead` });
  }
};
