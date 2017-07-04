(function() {

  //set clock
  let date = new Date()
  let hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds(), ampm = '', mHours = 0
  let setHours = document.getElementsByClassName('hh')[0]
  let setMinutes = document.getElementsByClassName('mm')[0]
  let setSeconds = document.getElementsByClassName('ss')[0]
  let setAmPm = document.getElementsByClassName('ampm')[0]
  let btnAddAlarm = document.getElementsByClassName('btn-add-alarm')[0]
  let inputHours = document.getElementById('inputHours')
  let inputMinutes = document.getElementById('inputMinutes')
  let inputAmPm = document.getElementById('inputAmPm')
  let inputNote = document.getElementById('inputNote')
  let ulListAlarm = document.getElementsByClassName('list-alarm')[0]
  let alarmInputs = '';

  let checkZero = (number) => {
    if(number < 10) {
      number = ('0' + number).slice(-2)
    }

    return number 
  }

  let udpateSixty = (number) => {
    if(number > 59) {
      number = 0
    }

    return number
  }

  let updateSeconds = () => {
    seconds = udpateSixty(seconds)

    if(seconds == 0) {
      updateMinutes(minutes)
    }

    seconds = checkZero(seconds)
    setSeconds.innerHTML = seconds
  }

  let updateMinutes = (min) => {
    min++
    min = udpateSixty(min)
    min = checkZero(min)

    if(min == 0) {
      hours++
      updateHours(hours)
    }

    minutes = min
    setMinutes.innerHTML = min
  }

  let checkAmPm = (hour) => {
    let last = ''
    if(hour < 12) {
      last = 'AM'
    } else if(hour >= 12) {
      last = 'PM'
    }

    return last
  }

  let updateHours = (hr) => {
    if(hours > 23) {
      hours = 0
    }

    hr = ((parseInt(hr) + 11) % 12) + 1
    ampm = checkAmPm(hours)
    hr = checkZero(hr)
    mHours = hr;
    
    setHours.innerHTML = hr
    setAmPm.innerHTML = ampm
  }

  let validateInput = (e) => {
    value = e.target.value
    if(value.length > 1) {
      e.preventDefault()
    }
  }


  // adding an alarm
  let addAlarm = () => {
    let alarm = Object.create(alarmObj)
    
    let time = checkZero(inputHours.value) + ':' + checkZero(inputMinutes.value) + inputAmPm.value.toUpperCase()
    alarm.time = time
    alarm.note = inputNote.value

    alarmList.push(alarm)
    listAlarm()
  }

  // list an alarm
  let listAlarm = () => {
    ulListAlarm.innerHTML = '';
    alarmList.map((time, index) => {
      let li = document.createElement('li')
      li.innerHTML = '<input type="checkbox" class="alarmInputs" name="alarms" value=' + time.time + '> <span>' + time.time + '</span> ' + time.note

      ulListAlarm.append(li);
    })

    if(alarmInputs === '') {
      listInit()
    }
  }

  // pushing of alarm in list of actives
  let addAlarmActive = (check, value) => {
    if(check) {
      alarmListActivate.push(value);
    } else {
      let del = alarmListActivate.indexOf(value);
      alarmListActivate.splice(del, 1);
    }
  }


  let listInit = () => {
    alarmInputs = document.getElementsByClassName('alarmInputs')

    for(ai of alarmInputs) {
      ai.addEventListener('click', (e) => {
        addAlarmActive(e.target.checked, e.target.value)
      })
    }
  }

  // alarm
  let alarmNow = () => {
    console.log('OINK OINK OINK OINK!!!');
  }


  minutes = checkZero(minutes)
  seconds = checkZero(seconds)
  updateHours(hours)
  setMinutes.innerHTML = minutes
  setSeconds.innerHTML = seconds

  let clock = setInterval(() => {
    updateSeconds()
    seconds++
  }, 1000)

  let alarmClock = setInterval(() => {
    console.log(alarmListActivate)
    if(alarmListActivate.length > 0) {
      let checker = (mHours + ':' + minutes + ampm);
      console.log(alarmListActivate + '  ' + checker);
      let testAlarm = alarmListActivate.filter((active) => {
        return active == checker
      })
      if (testAlarm.length > 0) {
        
      }
    }
  }, 1000)

  inputHours.addEventListener('keypress', validateInput)
  inputMinutes.addEventListener('keypress', validateInput)

  let alarmList = []
  let alarmListActivate = [];
  let alarmObj = {
    time: '',
    note: '',
  }

  btnAddAlarm.addEventListener('click', addAlarm)

})()