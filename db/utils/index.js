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
  //const format = [];
  data.forEach((element) => {
    console.log(element);
  });
  return format;
};
