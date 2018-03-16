#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const {
  addItem,
  updateItem,
  removeItem,
  listItems,
  listDay
} = require('./pouch');

const questions = [
  {
    type: 'list',
    name: 'day',
    message: 'Day:',
    choices: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ]
  },
  {
    type: 'input',
    name: 'from',
    message: 'Start time (HH:MM):'
  },
  {
    type: 'input',
    name: 'to',
    message: 'End time (HH:MM):'
  },
  {
    type: 'list',
    name: 'course',
    message: 'Course:',
    choices: [
      'Networks',
      'Economics',
      'Intro to AI',
      'OS',
      'Management',
      'Quality'
    ]
  },
  {
    type: 'list',
    name: 'week',
    message: 'Week:',
    choices: [
      'Weekly',
      'Week 1',
      'Week 2'
    ]
  },
  {
    type: 'list',
    name: 'category',
    message: 'Category:',
    choices: [
      'Lecture',
      'Tutorial',
      'Lab'
    ],
    default: 'Lecture'
  },
  {
    type: 'input',
    name: 'location',
    message: 'Location:'
  }
];

program
  .version('1.2.0')
  .option('Schedule Management System');

//Add Command
program
  .command('add')
  .alias('a')
  .description('Add an item')
  .action(() => {
    prompt(questions).then(answers => {
      addItem({ 
        _id: new Date().toJSON(),
        day: answers.day,
        from: answers.from,
        to: answers.to,
        category: answers.category,
        week: answers.week,
        course: answers.course,
        location: answers.location
      });
    });
  });

//Update command
program
  .command('update <_id>')
  .alias('u')
  .description('Update an item')
  .action(_id => {
    prompt(questions).then(answers => {
      updateItem(_id, {
        _id: _id,
        day: answers.day,
        from: answers.from,
        to: answers.to,
        category: answers.category,
        week: answers.week,
        course: answers.course,
        location: answers.location
      })
    });
  });

//Remove command
program
  .command('remove <_id>')
  .alias('r')
  .description('Remove an item')
  .action(_id => removeItem(_id));

//List command
program
  .command('list')
  .alias('l')
  .description('List all items')
  .action(() => {
    listItems()
      .then(items => items.forEach(item => console.log(item)))
      .catch(err => console.log(err));
  });

//List all items of a given day
program
  .command('listDay <d>')
  .alias('d')
  .description('List all items of a given day')
  .action(d => {
    listDay(d)
      .then(items => items.forEach(item => console.log(item)))    
      .catch(err => console.log(err));
  })

program.parse(process.argv);