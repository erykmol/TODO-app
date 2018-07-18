import { ui, TextInput, CheckBox, TextView } from 'tabris';

let tasksCompleted = 0;
let allTasks = 0;

ui.contentView.append(
  new TextView({
    id: 'input',
    text: '0 tasks complete out of 0',
    centerX: 0,
    top: 12,
    font: '20px'
  })
).children();

const tasksDisplay = ui.find(TextView).first();

new TextInput({
  top: 'prev() 20', left: '20%', right: '20%',
  message: 'Type here, then confirm'
}).on({
  accept: ({ text }) => {
    tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + (++allTasks);
    new CheckBox({
      left: 50, top: 'prev() 30',
      checked: false,
      textColor: '#ff16a2',
      text
    }).on({
      checkedChanged: ({ value }) => {
        if (value === true) {
          tasksDisplay.text = (++tasksCompleted) + ' tasks complete out of ' + allTasks;
        } else {
          tasksDisplay.text = (--tasksCompleted) + ' tasks complete out of ' + allTasks;
        }
      }
    }).appendTo(ui.contentView);
  }
}).appendTo(ui.contentView);
