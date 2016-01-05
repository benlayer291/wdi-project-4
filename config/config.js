var mongolab = process.env.MONGOLAB_URI;

module.exports = {
  'secret': 'shapesgamefinalproject',
  // 'database': 'mongodb://localhost:27017/shapes'
  'database': mongolab
};