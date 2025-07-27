// Mock models for development without database
console.log('Warning: Using mock models for development');

const mockModel = {
  findOne: () => Promise.resolve(null),
  findAll: () => Promise.resolve([]),
  create: (data) => Promise.resolve({ id: 1, ...data, toJSON: () => ({ id: 1, ...data }) }),
  update: () => Promise.resolve([1]),
  destroy: () => Promise.resolve(1),
  hasMany: () => {},
  belongsTo: () => {}
};

const User = mockModel;
const Item = mockModel;
const Bid = mockModel;

module.exports = {
  User,
  Item,
  Bid
}; 