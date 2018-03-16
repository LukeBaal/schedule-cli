const mongoose = require('mongoose');

//Map to global promise
mongoose.Promise = global.Promise;
//Connect to db
const db = mongoose.connect('mongodb://localhost:27017/schedulecli', {
  useMongoClient: true
});

//Import model
const Schedule = require('./models/schedule');

//Add Item
const addItem = item => {
  Schedule.create(item).then(item => {
    console.log('New Item Added');
    db.close();
  });
};

//Update Item
const updateItem = (_id, item) => {
  Schedule.update({ _id }, item)
    .then(item => {
      console.log('Item Updated');
      db.close();
    });
};

//Remove Item
const removeItem = (_id) => {
  Schedule.remove({ _id })
    .then(item => {
      console.info('Item Removed');
      db.close();
    });
};

const listItems = () => {
  return Schedule.find().sort('from')
    .then(items => {
      db.close();
      return items;
    });
}

const getWeek = () => {
  const one_week = 1000*60*60*24*7;
  const today = new Date();
  const week1 = new Date("Jan 8, 2018");
  
  const diff = today - week1;
  const week = Math.floor(diff / one_week) % 2;
  if (week === 1){
    return "Week 2";
  }else{
    return "Week 1";
  }
}

//List Items of a day
const listDay = (day) => {
  return Schedule.find({'day': day}).sort('from')
    .then(items => {
      data = [];
      for (item of items){
        if (item.week !== "Weekly" && item.week !== getWeek()){
          continue;
        }
        const reHour = /[1-9]+/;
        const fromHour = reHour.exec(item.from)[0];
        const toHour = reHour.exec(item.to)[0];

        const reMin = /:[0-9]+/;
        const fromMin = reMin.exec(item.from)[0];
        const toMin = reMin.exec(item.to)[0];
        let from, to;

        if (fromHour > 12) {
          from = `${parseInt(fromHour)%12}${fromMin}PM`;
        }else {
          from = `${fromHour}${fromMin}AM`;
        }

        if (toHour > 12) {
          to = `${parseInt(toHour)%12}${toMin}PM`;
        }else {
          to = `${item.to}AM`;
        }
        data.push(`${from}-${to}: ${item.course} ${item.category} @ ${item.location}`);
      }
      db.close();
      return data;
    })
}

module.exports = {
  addItem,
  updateItem,
  removeItem,
  listItems,
  listDay
};