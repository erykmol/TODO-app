import { ui, CheckBox, TextView, TextInputAcceptEvent, Button, ToggleButton } from 'tabris';

interface Task {
  checked: boolean;
  text: string;
}

let tasksCompleted = 0;
let allTasks = 0;

const saveRestore = () => {
  const tasks: object = JSON.parse(localStorage.getItem('boxArr'));
  if (!isCheckboxArray(tasks)) {
    throw new Error('Unexpected format of checkbox array.');
  }
  const savedTasksCompleted = Number(localStorage.getItem('tasksCompleted'));
  const savedAllTasks = Number(localStorage.getItem('allTasks'));
  tasksCompleted = savedTasksCompleted;
  allTasks = savedAllTasks;
  tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + allTasks;
  for (const task of tasks) {
    const oldTask = new CheckBox({
      left: 29, top: 'prev() 30', right: 'next() 29',
      checked: task.checked,
      textColor: '#ff16a2',
      text: task.text
    }).on({checkedChanged: ({ value }) => {
        if (value === true) {
          tasksDisplay.text = (++tasksCompleted) + ' tasks complete out of ' + allTasks;
        } else {
          tasksDisplay.text = (--tasksCompleted) + ' tasks complete out of ' + allTasks;
        }
        saving();
      }
    }).appendTo(ui.contentView);
    new Button({
      right: 29, top: 'prev() -32', left: 'next() 275',
      text: 'Delete'
    }).on({select: ({target}) => {
      if(oldTask.checked === true) {
        tasksDisplay.text = (--tasksCompleted) + ' tasks complete out of ' + (--allTasks);
      } else {
        tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + (--allTasks);
      }
      oldTask.dispose(),
      target.dispose(),
      saving();}
    }).appendTo(ui.contentView);
  }
};

const saving = () => {
  localStorage.clear();
  const countBox = ui.find(CheckBox);
  const tasksArray: Task[] = [];
  countBox.forEach((element) => {
    const taskData = {
      checked: element.checked,
      text: element.text
    };
    tasksArray.push(taskData);
  });
  localStorage.setItem('boxArr', JSON.stringify(tasksArray));
  localStorage.setItem('tasksCompleted', JSON.stringify(tasksCompleted));
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
};

const tempName = (event: TextInputAcceptEvent) => {
  if(event.text.length>24) {
    throw new Error('Task description too long.');
  }
  tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + (++allTasks);
  const newTask = new CheckBox({
    left: 29, top: 'prev() 30', right: 'next() 29',
    checked: false,
    textColor: '#ff16a2',
    text: event.text
  }).on({checkedChanged: ({ value }) => {
      if(value === true) {
        tasksDisplay.text = (++tasksCompleted) + ' tasks complete out of ' + allTasks;
      } else {
        tasksDisplay.text = (--tasksCompleted) + ' tasks complete out of ' + allTasks;
      }
      saving();
    }
  }).appendTo(ui.contentView);
  new Button({
    right: 29, top: 'prev() -32',
    text: 'Delete'
  }).on({select: ({target}) => {
      if(newTask.checked === true) {
        tasksDisplay.text = (--tasksCompleted) + ' tasks complete out of ' + (--allTasks);
      } else {
        tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + (--allTasks);
      }
      newTask.dispose(),
      target.dispose(),
      saving();
    }
  }).appendTo(ui.contentView);
  saving();
};

ui.contentView.append(
  <textView centerX={0} id='input' text='0 tasks complete out of 0' top={12} font='20px' />
);

const tasksDisplay = ui.find(TextView).first();

ui.contentView.append(
  <textInput top='prev() 20' left='20%' right='20%' message='Type here, then confirm' onAccept={tempName} />
);

saveRestore();

function isCheckboxArray(value: any): value is Task[] {
  return value instanceof Array
    && value.every((entry: Task) => typeof entry.checked === 'boolean' && typeof entry.text === 'string');
}
