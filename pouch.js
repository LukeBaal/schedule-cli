const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('schedule');
// PouchDB.debug.enable('*');

db.info().catch(err => console.log(err));


const addItem = item => {
  db.put(item)
  .then(() => console.info("Item added!"))
  .catch(err => console.log(err));
}

const updateItem = (_id, item) => {
  db.get(_id)
    .then(doc => {
      doc.name = item.name;
      doc.course = item.course;
      doc.date = item.date;
      return db.put(doc);
    })
    .then(doc => console.info('Item Updated!'))
    .catch(err => console.log(err));
}

const removeItem = (_id) => {
  db.get(_id)
    .then(doc => db.remove(doc))
    .then(() => console.info('Item Removed!'))
    .catch(err => console.log(err));
}

const listItems = () => {
  return db.allDocs({include_docs: true})
    .then(res => {
      data = [];
      res.rows.forEach(row => {
        data.push(row.doc);
      });
      return data;
    })
    .catch(err => console.log(err));
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

// Create index for the 'day' and from' time
db.createIndex({
  index: {fields: ['day', 'from']}
});

//List Items of a day
const listDay = (day) => {
  return db.createIndex({
    index: {fields: ['day']}
  }).then(() => {
    return db.find({
      selector: {day: {$eq: day}}
    });
  }).then(results => {
    data = [];
    for (item of results.docs){
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
    return data;
  }).catch(err => console.log(err));
}

// const doc = {
//   _id: new Date().toJSON(),
//   day: 'Monday',
//   from: '09:40',
//   to: '11:00',
//   course: 'OS',
//   week: 'Weekly',
//   category: 'Tutorial',
//   location: 'UA1220'
// };

// listItems().then(results => {
//   results.forEach(doc => removeItem(doc._id));
// });
// addItem(doc);
// listItems().then(results => console.info(results));
// listDay('Monday');

// removeItem('2018-03-16T13:37:28.686Z');
// updateItem('os lab 4 report', doc);
// db.put(doc).catch(err => console.log(err));
// db.get('os lab 4 report').then(doc => console.log(doc)).catch(err => console.log(err));
// listDay('Monday')
//       .then(items => console.info(items))
//       .catch(err => console.log(err));
// const sdata = require('./schedule');
// let i = 0;
// let start = new Date();
// sdata.forEach(item => {
//   item._id = new Date(start.getMilliseconds()+i).toJSON();
//   i++;
//   console.log(item._id);
//   addItem(item);
// });

module.exports = {
  addItem,
  updateItem,
  removeItem,
  listItems,
  listDay
}