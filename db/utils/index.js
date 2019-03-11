exports.formatTimeStamp = (data) => {
  const format = [];
  data.forEach((element) => {
    const formatTime = new Date(element.created_at);
    element.created_at = formatTime.toLocaleString();
    format.push(element);
  });
  return format;
};


exports.titleArticleID = (data) => {
  const format = {};
  data.forEach((element) => {
    format[element.title] = element.article_id;
  });
  return format;
};

exports.formatComment = (data, reference) => {
  const format = [];
  data.forEach((element) => {
    const newObj = { ...element };
    newObj.article_id = reference[element.belongs_to];
    delete newObj.belongs_to;
    newObj.author = element.created_by;
    delete newObj.created_by;
    const formatTime = new Date(element.created_at);
    newObj.created_at = formatTime.toLocaleString();
    format.push(newObj);
  });
  return format;
};
