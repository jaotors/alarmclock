(function() {

  //set clock
  let date = new Date()
  let hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds(), ampm = ''
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
  let alarmInputs = '';
  let sound = document.getElementById('alarmSound')

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

  let changeTwelveHours = (hours) => {
    return ((parseInt(hours) + 11) % 12) + 1
  }

  let updateTicks = () => {
    ampm = (hours < 12) ? 'AM' : 'PM'
    
    seconds++
    seconds = udpateSixty(seconds)
    seconds = checkZero(seconds)

    if(seconds == 0) {
      minutes++
      minutes = udpateSixty(minutes)
      minutes = checkZero(minutes)

      if(minutes == 0 && seconds == 0) {
        hours++

        if(hours > 23) {
          hours = 0
        }
      }
    }

    
    setSeconds.innerHTML = seconds
    setHours.innerHTML = checkZero(changeTwelveHours(hours))
    setMinutes.innerHTML = minutes
    setAmPm.innerHTML = ampm

    activateAlarm();
  }

  let validateInput = (e) => {

    let value = e.target.value
    let reg = new RegExp(/(?:\d*)\d+/g)
    let res = reg.test(e.key)

    
    if(value.length > 1 || !res) {
      e.preventDefault()
    }
  }


  // adding an alarm
  let addAlarm = () => {
    let alarm = Object.create(alarmObj)
    
    let time = checkZero(inputHours.value) + ':' + checkZero(inputMinutes.value) + ':' + checkZero(inputSeconds.value) + inputAmPm.value.toUpperCase()
    alarm.time = time
    alarm.note = inputNote.value

    alarmList.push(alarm)
    listAlarm()
    clearInput()
  }

  //edit an alarm
  let editAlarm = (e) => {
    let index = e.target.dataset.index

    if(e.target.innerHTML === 'EDIT') {
      e.target.innerHTML = 'SAVE'
      let time = alarmList[index].time.match(/[a-zA-Z]+|[0-9]+/g)

      inputHours.value = time[0]
      inputMinutes.value = time[1]
      inputSeconds.value = time[2]
      inputAmPm.selectedIndex = time[3] === 'AM' ? 0 : 1
      inputNote.value = alarmList[index].note

      document.getElementsByClassName('delete-alarm')[0].disabled = true
      btnAddAlarm.disabled = true

    } else {
      e.target.innerHTML = 'EDIT'
      alarmList[index].time = checkZero(inputHours.value) + ':' + checkZero(inputMinutes.value) + ':' + checkZero(inputSeconds.value) + inputAmPm.value.toUpperCase()
      alarmList[index].note = inputNote.value
      clearInput()
      document.getElementsByClassName('delete-alarm')[0].disabled = false
      btnAddAlarm.disabled = false
      listAlarm()
    }
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

  // list an alarm
  let listAlarm = () => {
    ulListAlarm.innerHTML = '';
    alarmList.map((time, index) => {
      let li = document.createElement('li')
      let check = time.check ? 'checked' : ''
      li.className += 'clearfix'
      li.innerHTML = '<input type="checkbox" class="alarmInputs" name="alarms" value=' + time.time + ' data-index="' + index + '"  ' + check + '> <span>' + time.time + '</span> ' + time.note + '<button class="stopAlarm" data-index="' + index + '" disabled>STOP ALARM</button><button class="delete-alarm" data-index="' + index + '">DELETE</button><button class="edit-alarm" data-index="' + index + '">EDIT</button>'

      ulListAlarm.append(li)
    })

    listInit()
  }

  let listInit = () => {
    alarmInputs = document.getElementsByClassName('alarmInputs')
    editBtns = document.getElementsByClassName('edit-alarm')
    delBtns = document.getElementsByClassName('delete-alarm')

    for(ai of alarmInputs) {
      ai.addEventListener('click', (e) => {
        alarmList[e.target.dataset.index].check = e.target.checked
        alarmList[e.target.dataset.index].alarm = e.target.checked
      })
    }

    for(eBtn of editBtns) {
      eBtn.addEventListener('click', editAlarm)
    }

    for(dlBtn of delBtns) {
      dlBtn.addEventListener('click', deleteAlarm)
    }


  }

  let clearInput = () => {
    inputHours.value = ''
    inputMinutes.value = ''
    inputSeconds.value = ''
    inputAmPm.selectedIndex = 0
    inputNote.value = ''
  }

  let refreshClock = () => {
    date = new Date()
    hours = date.getHours()
    minutes = date.getMinutes()
    seconds = date.getSeconds() 
    ampm = ''
    minutes = checkZero(minutes)
    seconds = checkZero(seconds)
    hours = checkZero(hours)
    setHours.innerHTML = hours
    setMinutes.innerHTML = minutes
    setSeconds.innerHTML = seconds
  }


  // alarm
  let alarmNow = (i) => {
    //integrate sound
    sound.play()
    sound.addEventListener('ended', () => {
      document.getElementsByClassName('stopAlarm')[i].disabled = true
      sound.currentTime = 0
    })
    
  }

  // set alarm to true
  let activateAlarm = () => {
    let checker = ((((parseInt(hours) + 11) % 12) + 1) + ':' + minutes + ':' + seconds + ampm)
    alarmList.map((alarm) => {
      if(alarm.check && alarm.title != checker) {
        alarm.alarm = true
      }
    });
  }

  //start
  
  setHours.innerHTML = checkZero(((parseInt(hours) + 11) % 12) + 1)
  setMinutes.innerHTML = checkZero(minutes)
  setSeconds.innerHTML = checkZero(seconds)
  setAmPm.innerHTML = (hours < 12) ? 'AM' : 'PM'

  let clock = setInterval(() => {
    updateTicks()

    let checker = (checkZero(changeTwelveHours(hours)) + ':' + minutes + ':' + seconds + ampm)
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
