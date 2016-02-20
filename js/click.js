'use strict';

function click_button(){
    // Add clicks-per-click to clicks.
    document.getElementById('clicks').innerHTML =
      parseInt(document.getElementById('clicks').innerHTML)
      + Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML)
      * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
}

function purchase(upgrade, cost, target, free){
    var clicks = parseInt(document.getElementById('clicks').innerHTML);
    free = free || false;

    if(!free
      && clicks < parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML)){
        return;
    }

    if(!free){
        // If user can afford upgrade...
        //   ...subtract cost of upgrade from clicks...
        document.getElementById('clicks').innerHTML =
          clicks - parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML);
    }

    // ...and increase upgrade...
    upgrades[upgrade]['level'] += 1;
    document.getElementById('upgrade-' + upgrade).innerHTML = upgrades[upgrade]['level'];

    // ...and update upgrade cost...
    upgrades[upgrade]['cost'] *= upgrades[upgrade]['multiplier'];
    document.getElementById('upgrade-' + upgrade + '-cost').innerHTML =
      upgrades[upgrade]['base'] + upgrades[upgrade]['cost'];

    // ...and increase target value, either clicks-per-click or clicks-per-second...
    document.getElementById(target).innerHTML = parseInt(document.getElementById(target).innerHTML)
      + upgrades[upgrade]['bonus'];

    // ...and recalculate multiplied values.
    var multiplier = (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100);
    document.getElementById('clicks-per-click-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML) * multiplier);
    document.getElementById('clicks-per-second-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML) * multiplier);
}

function reset_score(){
    if(!window.confirm('Reset score?')){
        return;
    }

    var ids = {
      'clicks': 0,
      'clicks-multiplier': 100,
      'clicks-per-click': 1,
      'clicks-per-click-multiplied': 1,
      'clicks-per-second': 0,
      'clicks-per-second-multiplied': 0,
    };
    for(var id in ids){
        window.localStorage.removeItem('Click.htm-' + id);
        document.getElementById(id).innerHTML = ids[id];
    }

    for(id in upgrades){
        upgrades[id]['cost'] = 1;
        upgrades[id]['level'] = 0;
    }

    for(var id in upgrades){
        window.localStorage.removeItem('Click.htm-upgrade-' + id);

        document.getElementById('upgrade-' + id).innerHTML = upgrades[id]['level'];
        document.getElementById('upgrade-' + id + '-cost').innerHTML =
          upgrades[id]['base'] + upgrades[id]['cost'];
    }
}

function reset_settings(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    window.localStorage.removeItem('Click.htm-keybind-click');
    document.getElementById('keybind-click').value = 'C';

    for(var id in upgrades){
        window.localStorage.removeItem('Click.htm-keybind-' + id);
        document.getElementById('keybind-' + id).value = upgrades[id]['keybind'];
    }
}

function second(){
    if(parseInt(document.getElementById('clicks-per-second').innerHTML) > 0){
        document.getElementById('clicks').innerHTML =
          parseInt(document.getElementById('clicks').innerHTML)
        + Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML)
          * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
    }

    // Setting the title to # of clicks makes idling easier.
    document.title = document.getElementById('clicks').innerHTML;

    // There is always another second.
    window.setTimeout(
      second,
      1000
    );
}

function settings_toggle(state){
    state = state == void 0
      ? document.getElementById('settings-button').value === '+'
      : state;
    var display = 'inline';

    if(state){
        document.getElementById('settings-button').value = '-';

    }else{
        display = 'none';
        document.getElementById('settings-button').value = '+';
    }

    for(var id in upgrades){
        document.getElementById('keybind-' + id).style.display = display;
    }
    document.getElementById('keybind-click').style.display = display;
    document.getElementById('settings-div').style.display = display;
}

var keyclick_ready = 1;
var upgrades = {
  'manual': {
    'base': 9,
    'bonus': 1,
    'cost': 1,
    'level': 0,
    'keybind': '1',
    'multiplier': 2,
    'type': 'per-click',
  },
  'script': {
    'base': 99,
    'bonus': 1,
    'cost': 1,
    'level': 0,
    'keybind': '2',
    'multiplier': 4,
    'type': 'per-second',
  },
  'employee': {
    'base': 249,
    'bonus': 2,
    'cost': 1,
    'level': 0,
    'keybind': '3',
    'multiplier': 8,
    'type': 'per-second',
  },
  'server': {
    'base': 499,
    'bonus': 3,
    'cost': 1,
    'level': 0,
    'keybind': '4',
    'multiplier': 16,
    'type': 'per-second',
  },
  'cluster': {
    'base': 999,
    'bonus': 4,
    'cost': 1,
    'level': 0,
    'keybind': '5',
    'multiplier': 32,
    'type': 'per-second',
  },
  'investor': {
    'base': 99,
    'bonus': 1,
    'cost': 1,
    'level': 0,
    'keybind': '6',
    'multiplier': 64,
    'type': 'multiplier',
  },
};

window.onbeforeunload = function(e){
    // Save clicks into window.localStorage.
    var clicks = parseInt(document.getElementById('clicks').innerHTML);
    if(clicks > 0){
        window.localStorage.setItem(
          'Click.htm-clicks',
          clicks
        );

    }else{
        window.localStorage.removeItem('Click.htm-clicks');
    }

    // Save upgrades into window.localStorage.
    for(var id in upgrades){
        // Save upgrade keybinds, if different from default.
        if(document.getElementById('keybind-' + id).value != upgrades[id]['keybind']){
            window.localStorage.setItem(
              'Click.htm-keybind-' + id,
              document.getElementById('keybind-' + id).value
            );

        }else{
            window.localStorage.removeItem('Click.htm-keybind-' + id);
        }

        // Only save level if greater than 0.
        if(upgrades[id]['level'] > 0){
            window.localStorage.setItem(
              'Click.htm-upgrade-' + id,
              upgrades[id]['level']
            );
        }

    }

    // Save click keybind, if different from default.
    if(document.getElementById('keybind-click').value != 'C'){
        window.localStorage.setItem(
          'Click.htm-keybind-click',
          document.getElementById('keybind-click').value
        );

    }else{
        window.localStorage.removeItem('Click.htm-keybind-click');
    }
};

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    // +: show settings.
    if(key === 187){
        settings_toggle(true);
        return;

    // -: hide settings.
    }else if(key === 189){
        settings_toggle(false);
        return;
    }

    key = String.fromCharCode(key);

    if(key === document.getElementById('keybind-click').value){
        if(keyclick_ready > 0){
            keyclick_ready = 0;
            click_button();
        }

        return;
    }

    for(var id in upgrades){
        if(key != document.getElementById('keybind-' + id).value){
            continue;
        }

        purchase(
          id,
          upgrades[id]['cost'],
          'clicks-' + upgrades[id]['type']
        );
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === document.getElementById('keybind-click').value){
        keyclick_ready = 1;
    }
};

window.onload = function(){
    // Load values from window.localStorage, if they exist.
    document.getElementById('keybind-click').value =
      window.localStorage.getItem('Click.htm-keybind-click') === null
        ? 'C'
        : window.localStorage.getItem('Click.htm-keybind-click');

    var ids = {
      'clicks': 0,
      'clicks-multiplier': 100,
      'clicks-per-click': 1,
      'clicks-per-second': 0,
    };

    for(var id in ids){
        document.getElementById(id).innerHTML =
          window.localStorage.getItem('Click.htm-' + id) === null
            ? ids[id]
            : window.localStorage.getItem('Click.htm-' + id);
    }

    var multiplier = (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100);
    document.getElementById('clicks-per-click-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML) * multiplier);
    document.getElementById('clicks-per-second-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML) * multiplier);

    for(id in upgrades){
        var upgrade = id[0].toUpperCase() + id.substring(1);

        document.getElementById('upgrades').innerHTML +=
          '<span id=upgrade-' + id + '>0</span>'
          + ' <input onclick=purchase("'
            + id + '",'
            + upgrades[id]['cost'] + ',"'
            + 'clicks-' + upgrades[id]['type']
          + '") type=button value=' + upgrade + '>'
          + '<input class=keybind id=keybind-' + id + ' maxlength=1>'
          + ' <span id=upgrade-' + id + '-cost>' + (upgrades[id]['base'] + upgrades[id]['cost']) +'</span><br>';
    }

    for(id in upgrades){
        document.getElementById('keybind-' + id).value =
          window.localStorage.getItem('Click.htm-keybind-' + id) === null
            ? upgrades[id]['keybind']
            : window.localStorage.getItem('Click.htm-keybind-' + id);

        var level = parseInt(window.localStorage.getItem('Click.htm-upgrade-' + id));
        level = isNaN(level)
          ? 0
          : level;
        while(level > 0){
            purchase(
              id,
              upgrades[id]['cost'],
              'clicks-' + upgrades[id]['type'],
              true
            );
            level -= 1;
        }
    }

    window.setTimeout(
      second,
      1000
    );
};
