import { ui, CheckBox, TextView, TextInputAcceptEvent } from 'tabris';

let tasksCompleted = 0;
let allTasks = 0;

ui.contentView.append(
    <textView centerX={0} id='input' text='0 tasks complete out of 0' top={12} font='20px' />
);

const tasksDisplay = ui.find(TextView).first();

const tempName = (event: TextInputAcceptEvent) => {
    tasksDisplay.text = tasksCompleted + ' tasks complete out of ' + (++allTasks),
    new CheckBox({
        left: 50, top: 'prev() 30',
        checked: false,
        textColor: '#ff16a2',
        text: event.text
    }).on({checkedChanged: ({value}) => {
            if (value === true) {
                tasksDisplay.text = (++tasksCompleted) + ' tasks complete out of ' + allTasks;
            } else {
                tasksDisplay.text = (--tasksCompleted) + ' tasks complete out of ' + allTasks;
            }
        }
    }).appendTo(ui.contentView);
};
ui.contentView.append(
    <textInput top='prev() 20' left='20%' right='20%' message='Type here, then confirm' onAccept={tempName}/>
);
