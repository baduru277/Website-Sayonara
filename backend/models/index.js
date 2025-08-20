// Mock models for development without database
console.log('Warning: Using mock models for development');

// In-memory storage
const inMemoryData = {
  users: new Map(),
  items: new Map(),
  bids: new Map(),
  nextUserId: 1,
  nextItemId: 1,
  nextBidId: 1
};

// Mock User model
const User = {
  findOne: (options) => {
    if (options.where) {
      for (let [id, user] of inMemoryData.users) {
        if (options.where.email && user.email === options.where.email) {
          return Promise.resolve({
            ...user,
            comparePassword: (password) => Promise.resolve(password === 'password'),
            update: (data) => {
              Object.assign(user, data);
              user.updatedAt = new Date();
              inMemoryData.users.set(user.id, user);
              return Promise.resolve();
            },
            toJSON: () => user
          });
        }
        if (options.where.id && user.id === options.where.id) {
          return Promise.resolve({
            ...user,
            comparePassword: (password) => Promise.resolve(password === 'password'),
            update: (data) => {
              Object.assign(user, data);
              user.updatedAt = new Date();
              inMemoryData.users.set(user.id, user);
              return Promise.resolve();
            },
            toJSON: () => user
          });
        }
      }
    }
    return Promise.resolve(null);
  },
  create: (data) => {
    const user = { id: inMemoryData.nextUserId++, ...data, createdAt: new Date(), updatedAt: new Date() };
    inMemoryData.users.set(user.id, user);
    return Promise.resolve({
      ...user,
      update: (data) => {
        Object.assign(user, data);
        user.updatedAt = new Date();
        inMemoryData.users.set(user.id, user);
        return Promise.resolve();
      },
      toJSON: () => user
    });
  },
  update: (data, options) => {
    if (options.where && options.where.id) {
      const user = inMemoryData.users.get(options.where.id);
      if (user) {
        Object.assign(user, data);
        user.updatedAt = new Date();
        inMemoryData.users.set(user.id, user);
      }
    }
    return Promise.resolve([1]);
  },
  hasMany: () => {},
  belongsTo: () => {}
};

// Mock Item model
const Item = {
  findAndCountAll: (options) => {
    const items = Array.from(inMemoryData.items.values());
    let filteredItems = items;
    
    if (options.where) {
      filteredItems = items.filter(item => {
        if (options.where.type && item.type !== options.where.type) return false;
        if (options.where.category && item.category !== options.where.category) return false;
        if (options.where.isActive !== undefined && item.isActive !== options.where.isActive) return false;
        return true;
      });
    }
    
    const rows = filteredItems.map(item => ({
      ...item,
      seller: inMemoryData.users.get(item.userId) || { id: item.userId, name: 'Unknown User' },
      toJSON: () => ({ ...item, seller: inMemoryData.users.get(item.userId) || { id: item.userId, name: 'Unknown User' } })
    }));
    
    return Promise.resolve({
      rows,
      count: filteredItems.length
    });
  },
  findByPk: (id) => {
    const item = inMemoryData.items.get(parseInt(id));
    if (item) {
      return Promise.resolve({
        ...item,
        seller: inMemoryData.users.get(item.userId) || { id: item.userId, name: 'Unknown User' },
        bids: Array.from(inMemoryData.bids.values()).filter(bid => bid.itemId === item.id),
        increment: (field) => {
          item[field] = (item[field] || 0) + 1;
          inMemoryData.items.set(item.id, item);
          return Promise.resolve();
        },
        update: (data) => {
          Object.assign(item, data);
          item.updatedAt = new Date();
          inMemoryData.items.set(item.id, item);
          return Promise.resolve();
        },
        toJSON: () => item
      });
    }
    return Promise.resolve(null);
  },
  create: (data) => {
    const item = { 
      id: inMemoryData.nextItemId++, 
      ...data, 
      createdAt: new Date(), 
      updatedAt: new Date(),
      isActive: true,
      views: 0,
      totalBids: 0
    };
    inMemoryData.items.set(item.id, item);
    return Promise.resolve({
      ...item,
      toJSON: () => item
    });
  },
  update: (data, options) => {
    if (options && options.where && options.where.id) {
      const item = inMemoryData.items.get(options.where.id);
      if (item) {
        Object.assign(item, data);
        item.updatedAt = new Date();
        inMemoryData.items.set(item.id, item);
      }
    }
    return Promise.resolve([1]);
  },
  hasMany: () => {},
  belongsTo: () => {}
};

// Mock Bid model
const Bid = {
  create: (data) => {
    const bid = { 
      id: inMemoryData.nextBidId++, 
      ...data, 
      createdAt: new Date(), 
      updatedAt: new Date(),
      isWinning: true
    };
    inMemoryData.bids.set(bid.id, bid);
    return Promise.resolve({
      ...bid,
      bidder: inMemoryData.users.get(bid.userId) || { id: bid.userId, name: 'Unknown User' },
      toJSON: () => bid
    });
  },
  update: (data, options) => {
    if (options && options.where) {
      for (let [id, bid] of inMemoryData.bids) {
        if (options.where.itemId && bid.itemId === options.where.itemId) {
          Object.assign(bid, data);
          bid.updatedAt = new Date();
          inMemoryData.bids.set(bid.id, bid);
        }
      }
    }
    return Promise.resolve([1]);
  },
  hasMany: () => {},
  belongsTo: () => {}
};

module.exports = {
  User,
  Item,
  Bid
}; 