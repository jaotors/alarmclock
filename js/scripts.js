(function() {

  //set clock
  let storeTime = {
    hours: (new Date()).toTimeString().split(' ').splice(0,1).toString().split(':')[0],
    minutes: (new Date()).toTimeString().split(' ').splice(0,1).toString().split(':')[1],
    seconds: (new Date()).toTimeString().split(' ').splice(0,1).toString().split(':')[2],
    ampm: ((new Date()).toTimeString().split(' ').splice(0,1).toString().split(':')[0] < 12) ? 'AM' : 'PM',
  }
  let setHours = document.getElementsByClassName('hh')[0]
  let setMinutes = document.getElementsByClassName('mm')[0]
  let setSeconds = document.getElementsByClassName('ss')[0]
  let setAmPm = document.getElementsByClassName('ampm')[0]
  let btnAddAlarm = document.getElementsByClassName('btn-add-alarm')[0]
  let inputHours = document.getElementById('inputHours')
  let inputMinutes = document.getElementById('inputMinutes')
  let inputSeconds = document.getElementById('inputSeconds')
  let inputAmPm = document.getElementById('inputAmPm')
  let inputNote = document.getElementById('inputNote')
  let ulListAlarm = document.getElementsByClassName('list-alarm')[0]
  let sound = document.getElementById('alarmSound')

  /*utils*/
  let changeTwelveHours = (hours) => {
    const hour = ((parseInt(hours) + 11) % 12) + 1
    const udpatedHour =  hour < 10 ? `0${hour}` : hour

    return udpatedHour
  }

  let setTimeHtml = (time = {hours, minutes, seconds, ampm}) => {
    setSeconds.innerHTML = time.seconds
    setMinutes.innerHTML = time.minutes
    setHours.innerHTML = changeTwelveHours(time.hours)
    setAmPm.innerHTML = time.ampm
  }

  let clearInput = () => {
    inputHours.value = ''
    inputMinutes.value = ''
    inputSeconds.value = ''
    inputAmPm.selectedIndex = 0
    inputNote.value = ''
  }

  let refreshClock = () => {
    let date = new Date()
    setTimeHtml({
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      ampm: (date.getHours() < 12) ? 'AM' : 'PM'
    })
  }

  let validateInput = (e) => {
    let value = e.target.value
    let reg = new RegExp(/(?:\d*)\d+/g)
    let res = reg.test(e.key)
    
    if(value.length > 1 || !res) {
      e.preventDefault()
    }
  }

  let inputDateObj = (input = {hours, minutes, seconds}) => {
    let date = new Date();
    date.setHours(input.hours)
    date.setMinutes(input.minutes)
    date.setSeconds(input.seconds)

    let hours = date.toTimeString().split(' ').splice(0,1).toString().split(':')[0],
        minutes = date.toTimeString().split(' ').splice(0,1).toString().split(':')[1],
        seconds = date.toTimeString().split(' ').splice(0,1).toString().split(':')[2]

    return {
      hours,
      minutes,
      seconds
    }
  }

  /*main function*/
  let updateTicks = () => {
    let date = new Date()
    let ampm = (date.getHours() < 12) ? 'AM' : 'PM'
    let time = date.toTimeString().split(" ").splice(0,1).toString().split(':')

    storeTime = {
      hours: time[0],
      minutes: time[1],
      seconds: time[2],
      ampm: ampm
    }

    setTimeHtml(storeTime)
    activateAlarm();
  }

  //adding an alarm
  let addAlarm = () => {
    let alarm = Object.create(alarmObj)
    
    let input = inputDateObj({
      hours: inputHours.value,
      minutes: inputMinutes.value,
      seconds: inputSeconds.value
    })
    let ampm = inputAmPm.value.toUpperCase()
    
    let time =  `${input.hours}:${input.minutes}:${input.seconds}${ampm}`
    alarm.time = time
    alarm.note = inputNote.value

    alarmList.push(alarm)
    listAlarm()
    clearInput()
  }

  //edit an alarm
  let editAlarm = (e) => {
    let index = e.target.dataset.index
    let time = alarmList[index].time.match(/[a-zA-Z]+|[0-9]+/g)

    inputHours.value = time[0]
    inputMinutes.value = time[1]
    inputSeconds.value = time[2]
    inputAmPm.selectedIndex = time[3] === 'AM' ? 0 : 1
    inputNote.value = alarmList[index].note
  }

  //save an alarm
  let saveAlarm = (e) => {
    let index = e.target.dataset.index
    let input = inputDateObj({
      hours: inputHours.value,
      minutes: inputMinutes.value,
      seconds: inputSeconds.value
    })
    let ampm = inputAmPm.value.toUpperCase()
    alarmList[index].time = `${input.hours}:${input.minutes}:${input.seconds}${ampm}`
    alarmList[index].note = inputNote.value
  }

  //delete an alarm
  let deleteAlarm = (e) => {
    let index = e.target.dataset.index
    let message = confirm('delete this alarm?')

    if(message) {
      alarmList.splice(index, 1)
      listAlarm()
    }
    
    refreshClock()
  }

  //list an alarm
  let listAlarm = () => {
    ulListAlarm.innerHTML = '';
    alarmList.map((time, index) => {
      let li = document.createElement('li')
      let check = time.check ? 'checked' : ''
      li.className += 'clearfix'
      li.innerHTML = `<input type="checkbox" class="alarmInputs" name="alarms" value="${time.time}" data-index="${index}" ${check}>
                      <span>${time.time}</span>${time.note}<button class="stopAlarm" data-index="${index}" disabled>STOP ALARM</button>
                      <button class="delete-alarm" data-index="${index}">DELETE</button>
                      <button class="edit-alarm" data-index="${index}">EDIT</button>`

      ulListAlarm.append(li)
    })

    listInit()
  }

  //to instantiate the non-existent
  let listInit = () => {
    let alarmInputs = document.getElementsByClassName('alarmInputs')
    let editBtns = document.getElementsByClassName('edit-alarm')
    let delBtns = document.getElementsByClassName('delete-alarm')

    for(ai of alarmInputs) {
      ai.addEventListener('click', (e) => {
        alarmList[e.target.dataset.index].check = e.target.checked
        alarmList[e.target.dataset.index].alarm = e.target.checked
      })
    }

    for(eBtn of editBtns) {
      eBtn.addEventListener('click', (e) => {
        if(e.target.innerHTML === 'EDIT') {
          e.target.innerHTML = 'SAVE'
          
          editAlarm(e)

          document.getElementsByClassName('delete-alarm')[0].disabled = true
          btnAddAlarm.disabled = true

        } else {
          e.target.innerHTML = 'EDIT'

          saveAlarm(e)

          clearInput()
          document.getElementsByClassName('delete-alarm')[0].disabled = false
          btnAddAlarm.disabled = false
          listAlarm()
        }
      })
    }

    for(dlBtn of delBtns) {
      dlBtn.addEventListener('click', deleteAlarm)
    }
  }

  // alarm
  let alarmNow = (i) => {
    //integrate sound
    sound.play()
    console.log('alarm start')
    sound.addEventListener('ended', () => {
      document.getElementsByClassName('stopAlarm')[i].disabled = true
      sound.currentTime = 0
      console.log('alarm ended');
    })
    
  }

  // set alarm to true
  let activateAlarm = () => {
    let checker = `${changeTwelveHours(storeTime.hours)}:${storeTime.minutes}:${storeTime.seconds}${storeTime.ampm}`
    alarmList.map((alarm) => {
      if(alarm.check && alarm.title != checker) {
        alarm.alarm = true
      }
    });
  }

  //start
  setTimeHtml(storeTime)
  let clock = setInterval(() => {
    updateTicks()

    let checker = `${changeTwelveHours(storeTime.hours)}:${storeTime.minutes}:${storeTime.seconds}${storeTime.ampm}`
    alarmList.map((alarm, index) => {
      if (alarm.check && alarm.time == checker && alarm.alarm) {
        alarmNow(index)
        let btnStop = document.getElementsByClassName('stopAlarm')[index]
        btnStop.disabled = false
        btnStop.addEventListener('click', (e) => {
          alarmList[e.target.dataset.index].alarm = false
          e.target.disabled = true
          sound.pause()
          sound.currentTime = 0;
        })
      }
    })
  }, 1000)

  inputHours.addEventListener('keypress', validateInput)
  inputMinutes.addEventListener('keypress', validateInput)
  inputSeconds.addEventListener('keypress', validateInput)

  let alarmList = []
  let alarmListActivate = [];
  let alarmObj = {
    time: '',
    note: '',
    check: false,
    alarm: false,
  }

  btnAddAlarm.addEventListener('click', addAlarm)

})()
