import { ui, TextView, Page, NavigationView, TextInputAcceptEvent, Button, TextInput } from 'tabris';

class Event {
  public date: string;
  public time: string;
  public duration: string;
  public description: string;
  public text: string;
}

const eventMap = new Map<Event,Button>();

const eventErrorMapCheck = (inputCount: number, event: Event, titleButton: Button) => {
  if(eventMap.size!==0 && event.date!==undefined && event.time!==undefined && event.duration!==undefined){
    const currentSplitDate = event.date.split('.');
    const currentSplitTime = event.time.split(':');
    for(const [savedEvent,savedTitleButton] of eventMap){
      const savedSplitDate = savedEvent.date.split('.');
      const savedSplitTime = savedEvent.time.split(':');
      if(titleButton.text!==savedTitleButton.text && Number(savedSplitDate[0])===Number(currentSplitDate[0]) &&
      Number(savedSplitDate[1])===Number(currentSplitDate[1]) &&
      Number(savedSplitDate[2])===Number(currentSplitDate[2]) &&
      (Number(savedSplitTime[0])===Number(currentSplitTime[0]) ||
      Number(currentSplitTime[0])+Number(event.duration)>Number(savedSplitTime[0]))) {
        throw new Error('conflicts with: ' + savedTitleButton.text);
      }
    }
  }
  if(inputCount===4) {
    eventMap.set(event,titleButton);
  }
  saving();
};

function edit(changedEvent: Event, titleName: string = 'Edit Page', titleButton: Button, eventPage: Page = new Page()) {
  let inputCount = 0;
  changedEvent.text = titleButton.text;
  const textViewCount = eventPage.find(TextView);
  const editPage = new Page({
    title: titleName
  }).appendTo(navigationView);
  new TextInput({
    top: 'prev() 30', left: 40, font: '16px', right: 40,
    message: 'Date',
    text: changedEvent.date
  }).on({accept: ({ target }) => {
      if (textViewCount.length < 4) {
        changedEvent.date = target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
      else {
        textViewCount[0].text = target.text;
        changedEvent.date = target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
    }
  }).appendTo(editPage);
  new TextInput({
    top: 'prev() 30', left: 40, font: '16px', right: 40,
    message: 'Time',
    text: changedEvent.time
  }).on({
    accept: ({ target }) => {
      if (textViewCount.length < 4) {
        changedEvent.time = 'Date: ' + target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
      else {
        textViewCount[1].text = 'Time: ' + target.text;
        changedEvent.time = target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
    }
  }).appendTo(editPage);
  new TextInput({
    top: 'prev() 30', left: 40, font: '16px', right: 40,
    message: 'Duration',
    text: changedEvent.duration
  }).on({accept: ({ target }) => {
      if (textViewCount.length < 4) {
        changedEvent.duration = target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
      else {
        textViewCount[2].text = 'Duration: ' + target.text + 'h';
        changedEvent.duration = target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
    }
  }).appendTo(editPage);
  new TextInput({
    top: 'prev() 30', left: 40, font: '16px', right: 40,
    message: 'Description',
    text: changedEvent.description
  }).on({accept: ({ target }) => {
      if (textViewCount.length < 4) {
        changedEvent.description = target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
      else {
        textViewCount[3].text = 'Description: ' + target.text;
        changedEvent.description = target.text;
        inputCount = inputCount + 1;
        eventErrorMapCheck(inputCount,changedEvent,titleButton);
      }
    }
  }).appendTo(editPage);
}

const checkHighlight = (eventButtonMap: Map<Event,Button>) => {
  const nowDate = new Date();
  const nextEventDisplay = frontPage.find(TextView).first();
  for(const [event,titleButton] of eventButtonMap){
    const splitDate = event.date.split('.');
    const splitTime = event.time.split(':');
    if (Number(splitDate[0])===nowDate.getDate() &&
      Number(splitDate[1])===(nowDate.getMonth() + 1) &&
      Number(splitDate[2])===nowDate.getFullYear()) {
        if ((nowDate.getHours()===Number(splitTime[0]) && nowDate.getMinutes()>=Number(splitTime[1])) ||
        (nowDate.getHours()>Number(splitTime[0]) && nowDate.getHours()-Number(splitTime[0])<Number(event.duration))) {
        titleButton.textColor = '#f202ff';
      }else if(nowDate.getHours()<Number(splitTime[0])){
        nextEventDisplay.text = 'Next coming event: ' + titleButton.text;
      }else {
        eventButtonMap.delete(event);
        titleButton.dispose();
        saving();
      }
    }else if((Number(splitDate[0])<nowDate.getDate() &&
      (Number(splitDate[1])<(nowDate.getMonth() + 1) || Number(splitDate[1])===(nowDate.getMonth() + 1)) &&
      (Number(splitDate[2])<nowDate.getFullYear() || Number(splitDate[2])===nowDate.getFullYear())) ||
      (Number(splitDate[1])<(nowDate.getMonth() + 1) &&
      (Number(splitDate[2])<nowDate.getFullYear() || Number(splitDate[2])===nowDate.getFullYear())) ||
      Number(splitDate[2])<nowDate.getFullYear()) {
        eventButtonMap.delete(event);
        titleButton.dispose();
        saving();
    }else if(Number(splitDate[0])-nowDate.getDate()<=4 && Number(splitDate[0])-nowDate.getDate()>0 &&
      Number(splitDate[1])===(nowDate.getMonth() + 1) &&
      Number(splitDate[2])===nowDate.getFullYear()){
        nextEventDisplay.text = 'Next coming event: ' + titleButton.text;
    }
  }
};

const eventCreate = (buttonEvent: any, newEvent= new Event(), restoreSaveFlag= false) => {
  const eventTitle = new Button({
    top: 'prev() 30', left: 40,
    text: buttonEvent.text
  }).on({select: () => {
      const displayPage = new Page({
        title: 'Event Page'
      }).appendTo(navigationView);
      new TextView({
        top: 'prev() 30', left: 40, font: 'bold 16px',
        text: 'Date: ' + newEvent.date
      }).appendTo(displayPage);
      new TextView({
        top: 'prev() 30', left: 40, font: 'bold 16px',
        text: 'Time: ' + newEvent.time
      }).appendTo(displayPage);
      new TextView({
        top: 'prev() 30', left: 40, font: 'bold 16px',
        text: 'Duration: ' + newEvent.duration + 'h'
      }).appendTo(displayPage);
      new TextView({
        top: 'prev() 30', left: 40, font: 'bold 16px', right: 40,
        text: 'Description: ' + newEvent.description
      }).appendTo(displayPage);
      new Button({
        top: 'prev() 30', left: 40,
        text: 'Edit'
      }).on({select: () => {
          edit(newEvent,'Edit Page',eventTitle,displayPage);
        }
      }).appendTo(displayPage);
    }
  }).appendTo(frontPage);
  if(restoreSaveFlag===false) {
    edit(newEvent, 'Event Page', eventTitle); }else { eventMap.set(newEvent,eventTitle); }
};

function isEventArray(value: any): value is Event[] {
  return value instanceof Array
    && value.every((entry: Event) => typeof entry.date === 'string' && typeof entry.time === 'string' &&
    typeof entry.duration === 'string' && typeof entry.description === 'string');
}

const saveRestore = () => {
  const events: object = JSON.parse(localStorage.getItem('eventsArray'));
  if (!isEventArray(events)) {
    throw new Error('Unexpected format of event array.');
  }
  for (const event of events) {
    eventCreate(event,event,true);
  }
};

const saving = () => {
  localStorage.clear();
  const eventsArray: Event[] = [];
  eventMap.forEach((value,key) => {
    eventsArray.push(key);
  });
  localStorage.setItem('eventsArray', JSON.stringify(eventsArray));
};

const tempName = (event: TextInputAcceptEvent) => {
  if (event.text.length > 21) {
    throw new Error('Event title too long.');
  }
  eventCreate(event);
};

const navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);

const frontPage = new Page({
  title: 'Event list'
}).appendTo(navigationView);

frontPage.append(
  <textInput top='prev() 20' message='Type the name of an event' onAccept={tempName} centerX={0}/>,
  <textView top='prev() 20' id='input' text='No upcoming events' font='20px' centerX={0}/>
);
if(JSON.parse(localStorage.getItem('eventsArray'))!==null) { saveRestore(); }
setInterval(checkHighlight,3000,eventMap);
