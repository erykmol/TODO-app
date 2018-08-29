import { ui, TextView, Composite, ImageView, RadioButtonSelectEvent, CollectionView, Button, RadioButton } from 'tabris';
ui.drawer.enabled = true;

const scheduleList = '{\
  "Friday, Sept. 14, 2018\\n\\n": [\
    "4:00pm – 8:00pm: Registration at Blue Mountain at the Grand Central Lodge in the Village\\n",\
    "4:00pm – 8:00pm: Vendor Village – Lift Plaza\\n"\
  ],\
  "Saturday, Sept. 15, 2018\\n\\n": [\
    "6:00am – 4:00pm: Registration in the Grand Central Lodge in the Village\\n",\
    "7:30am – 4:00pm: Vendor Village – Lift Plaza\\n",\
    "8:00am – 8:15am: 120km Start (Gord Canning Blvd Start Area)\\n",\
    "10:00am – 10:20am: 80km Start (Gord Canning Blvd Start Area)\\n",\
    "11:00am – 4:00pm: Interactive Family Activities – Blue Mountain Village\\n",\
    "11:00am – 4:00pm: Post Race Food\\n",\
    "11:00am – 5:00pm: Live Music – Coca-Cola Village Stage\\n",\
    "1:15pm – 2:00pm: 80km Awards on the stage in the Events Plaza\\n",\
    "2:30pm – 3:00pm: 120km Awards on the stage in the Events Plaza\\n"\
  ],\
  "Sunday, Sept. 16, 2018\\n\\n": [\
    "6:00am – 8:30am: Registration in the Grand Central Lodge in the Village\\n",\
    "8:00am – 2:00pm: Vendor Village – Lift Plaza\\n",\
    "8:00am: 40km Start (Gord Canning Blvd Start Area)\\n",\
    "10:30am: True Grit 70km Start(Gord Canning Blvd Start Area)\\n",\
    "10:45am: True Grit 40km Start(Gord Canning Blvd Start Area)\\n",\
    "10:45am – 11:15pm: 40km Awards on the stage in the Events Plaza\\n",\
    "11:30am: Kid’s Race (Gord Canning Blvd Start Area)\\n",\
    "11:30am - 4:00pm: Live Music – Coca-Cola Village Stage\\n",\
    "1:15pm – 2:00pm: True Grit Awards on the stage in the Events Plaza\\n"\
  ]\
}';

const filter = ( day = 'All', button = ''): string[] => {
  const schedule = JSON.parse(scheduleList);
  const daysList = Object.keys(schedule);
  const modelArr: string[] = [];
  let modelList = '';

  if(button === 'map'){
    model.push('resources/map.png');
    return model;
  }else {
    if( day === 'All' ){
      for(const keyDay of daysList){
        modelList=keyDay;
        for(const activity of schedule[keyDay]){
          modelList+=activity;
        }
        modelArr.push(modelList);
      }
      return modelArr;
    }
    if( day === 'First Day' ){
      modelList=daysList[0];
      for(const activity of schedule[daysList[0]]){
        modelList+=activity;
      }
      modelArr.push(modelList);
      return modelArr;
    }
    if( day === 'Second Day' ){
      modelList=daysList[1];
      for(const activity of schedule[daysList[1]]){
        modelList+=activity;
      }
      modelArr.push(modelList);
      return modelArr;
    }
    if( day === 'Last Day' ){
      modelList=daysList[2];
      for(const activity of schedule[daysList[2]]){
      modelList+=activity;
      }
      modelArr.push(modelList);
      return modelArr;
    }
  }
};

let model = filter();

const frontPage = new CollectionView({
  left: 0, top: 35, right: 0, bottom: 0,
  backgroundImage: 'resources/back.png',
  itemCount: model.length,
  cellHeight: 'auto',
  createCell: () => {
    const cell = new Composite();
    new TextView({
      left: 30, top: 'prev() 16', right: 30,
      font: 'bold 20px', textColor: '#efeded',
      alignment: 'center'
    }).appendTo(cell);
    new ImageView({
      zoomEnabled: true,
      top: 'prev() 25', scaleMode: 'stretch'
    }).appendTo(cell);
    return cell;
  },
  updateCell: (cell, index) => {
      cell.apply({
        TextView: {text: model[index]},
        ImageView: {image: model[index]}
      });
}}).appendTo(ui.contentView);

new TextView({
  centerX: 0, top: 10,
  text: 'Centurion cycling',
  font: 'bold 20px'
}).appendTo(ui.contentView);

const options = (event: RadioButtonSelectEvent) => {
  if (event.target.text === 'All' && event.target.checked === true) {
    model = filter();
    frontPage.load(model.length);
  }
  if (event.target.text === 'First Day' && event.target.checked === true) {
    model = filter(event.target.text);
    frontPage.load(model.length);
  }
  if (event.target.text === 'Second Day' && event.target.checked === true) {
    model = filter(event.target.text);
    frontPage.load(model.length);
  }
  if (event.target.text === 'Last Day' && event.target.checked === true) {
    model = filter(event.target.text);
    frontPage.load(model.length);
  }
};

ui.drawer.append(
  <radioButton left={30}  top='prev() 25' text='All' checked={false} onSelect={options}/>,
  <radioButton left={30}  top='prev() 25' text='First Day' checked={false} onSelect={options}/>,
  <radioButton left={30}  top='prev() 25' text='Second Day' checked={false} onSelect={options}/>,
  <radioButton left={30}  top='prev() 25' text='Last Day' checked={false} onSelect={options}/>
);
new Button({
  top: 'prev() 25', left: 30,
  text: 'map',
  font: '15px'
}).on({select : () => {
  let radioButtonFlag = 0;
  ui.drawer.find(RadioButton).forEach((widget) => {
    if(widget.checked === true){
      model = filter(widget.text,'map');
      frontPage.load(model.length);
    }else {
      radioButtonFlag+=1;
    }
  });
  if(radioButtonFlag===ui.drawer.find(RadioButton).length){
      model = filter('All','map');
      frontPage.load(model.length);
  }
}}).appendTo(ui.drawer);
