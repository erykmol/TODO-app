import { ui, CheckBox, TextView, TextInputAcceptEvent, Button, RadioButtonSelectEvent } from 'tabris';
ui.drawer.enabled = true;

interface Task {
  checked: boolean;
  text: string;
}

let tasksCompleted = 0;
let allTasks = 0;

const taskCreate = (checkBoxEvent: any , checkedState= false) => {
  const newTask = new CheckBox({
    left: 29, top: 'prev() 30', right: 'next() 29',
    checked: checkedState,
    textColor: '#ff16a2',
    text: checkBoxEvent.text
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
};

const saveRestore = (option: number) => {
  const tasks: object = JSON.parse(localStorage.getItem('tasksArray'));
  if (!isCheckboxArray(tasks)) {
    throw new Error('Unexpected format of checkbox array.');
  }
  const savedTasksCompleted = Number(localStorage.getItem('tasksCompleted'));
  const savedAllTasks = Number(localStorage.getItem('allTasks'));
  tasksCompleted = savedTasksCompleted;
  allTasks = savedAllTasks;
  tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + allTasks;
  for (const task of tasks) {
    if(task.checked === false && option === 1) {taskCreate(task,task.checked);}
    if(task.checked === true && option === 2) {taskCreate(task,task.checked);}
    if(option === 3) {taskCreate(task,task.checked);}
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
  localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
  localStorage.setItem('tasksCompleted', JSON.stringify(tasksCompleted));
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
};

const tempName = (event: TextInputAcceptEvent) => {
  if(event.text.length>21) {
    throw new Error('Task description too long.');
  }
  tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + (++allTasks);
  taskCreate(event);
  saving();
};

const options = (event: RadioButtonSelectEvent) => {
  if (event.target.text === 'All tasks' && event.target.checked === true) {
    ui.find(CheckBox).dispose();
    ui.find(Button).dispose();
    saveRestore(3);
  }
  if (event.target.text === 'Finished tasks' && event.target.checked === true) {
      ui.find(CheckBox).dispose();
      ui.find(Button).dispose();
      saveRestore(2);
  }
  if (event.target.text === 'Unfinished tasks' && event.target.checked === true) {
      ui.find(CheckBox).dispose();
      ui.find(Button).dispose();
      saveRestore(1);
  }
};

ui.contentView.append(
  <textView centerX={0} id='input' text='0 tasks complete out of 0' top={12} font='20px' />
);

const tasksDisplay = ui.find(TextView).first();

ui.contentView.append(
  <textInput top='prev() 20' left='20%' right='20%' message='Type here, then confirm' onAccept={tempName} />
);

ui.drawer.append(
  <radioButton left={30}  top='prev() 25' text='All tasks' checked={false} onSelect={options}/>,
  <radioButton left={30}  top='prev() 25' text='Finished tasks' checked={false} onSelect={options}/>,
  <radioButton left={30}  top='prev() 25' text='Unfinished tasks' checked={false} onSelect={options}/>
);

function isCheckboxArray(value: any): value is Task[] {
  return value instanceof Array
    && value.every((entry: Task) => typeof entry.checked === 'boolean' && typeof entry.text === 'string');
}
