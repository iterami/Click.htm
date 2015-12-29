'use strict';

function calculate_upgrade_cost(upgrade, cost){
    document.getElementById('upgrade-' + upgrade + '-cost').innerHTML = Math.pow(
      upgrade_base + cost,
      parseInt(document.getElementById('upgrade-' + upgrade).innerHTML) + 1
    );
}

function click_button(){
    // Add clicks-per-click to clicks.
    document.getElementById('clicks').innerHTML = 
      parseInt(document.getElementById('clicks').innerHTML)
      + Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML)
      * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
}

function purchase(upgrade, cost, target){
    var clicks = parseInt(document.getElementById('clicks').innerHTML);

    if(clicks < parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML)){
        return;
    }

    // If user can afford upgrade...
    //   ...subtract cost of upgrade from clicks...
    document.getElementById('clicks').innerHTML =
      clicks - parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML);

    // ...and increase upgrade...
    document.getElementById('upgrade-' + upgrade).innerHTML =
      parseInt(document.getElementById('upgrade-' + upgrade).innerHTML) + 1;

    // ...and increase upgrade cost...
    calculate_upgrade_cost(upgrade, cost);

    // ...and increase target value, either clicks-per-click or clicks-per-second...
    document.getElementById(target).innerHTML = parseInt(document.getElementById(target).innerHTML)
      + (cost < 1 || cost > 4
        ? 1
        : cost
      );

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

    window.localStorage.removeItem('Click.htm-clicks');
    window.localStorage.removeItem('Click.htm-clicks-multiplier');
    window.localStorage.removeItem('Click.htm-clicks-per-click');
    window.localStorage.removeItem('Click.htm-clicks-per-second');

    var ids = {
      'clicks': 0,
      'clicks-multiplier': 100,
      'clicks-per-click': 1,
      'clicks-per-click-multiplied': 1,
      'clicks-per-second': 0,
      'clicks-per-second-multiplied': 0,
    };
    for(var id in ids){
        document.getElementById(id).value = ids[id];
    }

    for(id in upgrades){
        window.localStorage.removeItem('Click.htm-upgrade-' + id);

        document.getElementById('upgrade-' + id).innerHTML = 0;

        set_upgrade(
          id,
          upgrades[id]['cost']
        );
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
      'second()',
      1000
    );
}

function set_upgrade(upgrade, cost){
    document.getElementById('upgrade-' + upgrade).innerHTML =
      window.localStorage.getItem('Click.htm-upgrade-' + upgrade) || 0;
    
    calculate_upgrade_cost(upgrade, cost);
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
var upgrade_base = 2;
var upgrades = {
  'manual': {
    'cost': 0,
    'keybind': '1',
    'type': 'per-click',
  },
  'script': {
    'cost': 1,
    'keybind': '2',
    'type': 'per-second',
  },
  'employee': {
    'cost': 2,
    'keybind': '3',
    'type': 'per-second',
  },
  'server': {
    'cost': 3,
    'keybind': '4',
    'type': 'per-second',
  },
  'cluster': {
    'cost': 4,
    'keybind': '5',
    'type': 'per-second',
  },
  'investor': {
    'cost': 5,
    'keybind': '6',
    'type': 'multiplier',
  },
};

window.onbeforeunload = function(e){
    // If any progress has been made.
    if(parseInt(document.getElementById('clicks').innerHTML) > 0
      || parseInt(document.getElementById('clicks-per-click').innerHTML) > 1
      || parseInt(document.getElementById('clicks-per-second').innerHTML) > 0
      || parseInt(document.getElementById('clicks-multiplier').innerHTML) > 100){
        // Save progress into window.localStorage.
        var ids = [
          'clicks',
          'clicks-multiplier',
          'clicks-per-click',
          'clicks-per-second',
        ];

        for(var id in ids){
            window.localStorage.setItem(
              'Click.htm-' + ids[id],
              document.getElementById(ids[id]).innerHTML
            );
        }

        // Save upgrades into window.localStorage.
        for(id in upgrades){
            window.localStorage.setItem(
              'Click.htm-upgrade-' + id,
              document.getElementById('upgrade-' + id).innerHTML
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

    // Save upgrade keybinds, if different from default.
    for(var id in upgrades){
        if(document.getElementById('keybind-' + id).value != upgrades[id]['keybind']){
            window.localStorage.setItem(
              'Click.htm-keybind-' + id,
              document.getElementById('keybind-' + id).value
            );

        }else{
            window.localStorage.removeItem('Click.htm-keybind-' + id);
        }
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
          '<span id=upgrade-' + id + '></span>'
          + ' <input onclick=purchase("'
            + id + '",'
            + upgrades[id]['cost'] + ',"'
            + 'clicks-' + upgrades[id]['type']
          + '") type=button value=' + upgrade + '>'
          + '<input class=keybind id=keybind-' + id + ' maxlength=1>'
          + ' <span id=upgrade-' + id + '-cost></span><br>';
    }

    for(id in upgrades){
        document.getElementById('keybind-' + id).value =
          window.localStorage.getItem('Click.htm-keybind-' + id) === null
            ? upgrades[id]['keybind']
            : window.localStorage.getItem('Click.htm-keybind-' + id);

        set_upgrade(
          id,
          upgrades[id]['cost']
        );
    }

    window.setTimeout(
      'second()',
      1000
    );
};
