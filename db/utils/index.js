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

exports.formatComment = (data, ref) => {
  const format = [];
  data.forEach((element) => {
    const temp = { ...element };
    temp.article_id = ref[element.belongs_to];
    //delete temp.article_id;
    temp.author = element.created_by;
    //delete temp.author;
    const formatTime = new Date(element.created_at);
    temp.created_at = formatTime.toLocaleString();
    format.push(temp);

  });
  return format;
};
