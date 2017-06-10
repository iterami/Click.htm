'use strict';

function click_button(){
    // Add clicks-per-click to clicks.
    core_storage_data['clicks'] += Math.floor(core_storage_data['clicks-per-click'] * (core_storage_data['clicks-multiplier'] / 100));

    core_storage_update();
}

function purchase(upgrade, cost, target, free){
    free = free || false;

    if(!free
      && core_storage_data['clicks'] < core_storage_data['upgrade-' + upgrade + '-cost']){
        return;
    }

    if(!free){
        // If user can afford upgrade...
        //   ...subtract cost of upgrade from clicks...
        core_storage_data['clicks'] -= core_storage_data['upgrade-' + upgrade + '-cost'];
    }

    // ...and increase upgrade/cost...
    core_storage_data['upgrade-' + upgrade] += 1;
    core_storage_data['upgrade-' + upgrade + '-cost'] *= upgrades[upgrade]['multiplier'];

    // ...and increase target value, either clicks-per-click or clicks-per-second...
    core_storage_data[target] += upgrades[upgrade]['bonus'];

    // ...and recalculate multiplied values.
    var multiplier = (core_storage_data['clicks-multiplier'] / 100);
    core_storage_data['clicks-per-click-multiplied'] = Math.floor(core_storage_data['clicks-per-click'] * multiplier);
    core_storage_data['clicks-per-second-multiplied'] = Math.floor(core_storage_data['clicks-per-second'] * multiplier);

    core_storage_update();
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': core_storage_save,
      },
      'storage': {
        'clicks': 0,
        'clicks-multiplier': 100,
        'clicks-per-click': 1,
        'clicks-per-click-multiplied': 1,
        'clicks-per-second': 0,
        'clicks-per-second-multiplied': 0,
        'keybind-click': 'C',
      },
      'title': 'Click.htm',
    });

    var multiplier = (core_storage_data['clicks-multiplier'] / 100);
    core_storage_data['clicks-per-click-multiplied'] = Math.floor(core_storage_data['clicks-per-click'] * multiplier);
    core_storage_data['clicks-per-second-multiplied'] = Math.floor(core_storage_data['clicks-per-second'] * multiplier);

    for(var id in upgrades){
        var upgrade = id[0].toUpperCase() + id.substring(1);

        document.getElementById('upgrades').innerHTML +=
          '<span id=upgrade-' + id + '>0</span>'
          + ' <input onclick=purchase("'
            + id + '",'
            + core_storage_data['upgrade-' + id + '-cost'] + ',"'
            + 'clicks-' + upgrades[id]['type']
          + '") type=button value=' + upgrade + '>'
          + '<input class=keybind id=keybind-' + id + ' maxlength=1>'
          + ' <span id=upgrade-' + id + '-cost>' + (upgrades[id]['base'] + core_storage_data['upgrade-' + id + '-cost']) +'</span><br>';
    }

    for(id in upgrades){
        var storage = {};

        storage['keybind-' + id] = upgrades[id]['keybind'];
        storage['upgrade-' + id] = 0;
        storage['upgrade-' + id + '-cost'] = upgrades[id]['base'];

        core_storage_add({
          'storage': storage,
        });

        var level = core_storage_data['upgrade-' + id];
        while(level > 0){
            purchase(
              id,
              core_storage_data['upgrade-' + id + '-cost'],
              'clicks-' + upgrades[id]['type'],
              true
            );
            level -= 1;
        }
    }

    settings_toggle(false);

    document.getElementById('click-button').onclick = click_button;
    document.getElementById('reset-button').onclick = function(){
        if(core_storage_reset()){
            for(var id in upgrades){
                core_storage_data['upgrade-' + id] = 0;
                core_storage_data['upgrade-' + id + '-cost'] = upgrades[id]['base'];
            }
        }
    }
    document.getElementById('settings-button').onclick = function(){
        settings_toggle();
    };

    window.setTimeout(
      second,
      1000
    );

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

        if(key === core_storage_data['keybind-click']){
            if(keyclick_ready > 0){
                keyclick_ready = 0;
                click_button();
            }

            return;
        }

        for(var id in upgrades){
            if(key != core_storage_data['keybind-' + id]){
                continue;
            }

            purchase(
              id,
              core_storage_data['upgrade-' + id + '-cost'],
              'clicks-' + upgrades[id]['type']
            );
        }
    };

    window.onkeyup = function(e){
        var key = String.fromCharCode(e.keyCode || e.which);

        if(key === core_storage_data['keybind-click']){
            keyclick_ready = 1;
        }
    };

    core_storage_update();
}

function second(){
    core_storage_data['clicks'] += Math.floor(core_storage_data['clicks-per-second']* (core_storage_data['clicks-multiplier'] / 100));

    core_storage_update();

    // Setting the title to # of clicks makes idling easier.
    document.title = core_storage_data['clicks'];

    // There is always another second.
    window.setTimeout(
      second,
      1000
    );
}

function settings_toggle(state){
    var settings_button = document.getElementById('settings-button');

    state = state == void 0
      ? settings_button.value === '+'
      : state;
    var display = 'inline';

    if(state){
        settings_button.value = '-';

    }else{
        display = 'none';
        settings_button.value = '+';
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
    'base': 2,
    'bonus': 1,
    'keybind': '1',
    'multiplier': 2,
    'type': 'per-click',
  },
  'script': {
    'base': 20,
    'bonus': 1,
    'keybind': '2',
    'multiplier': 4,
    'type': 'per-second',
  },
  'employee': {
    'base': 50,
    'bonus': 2,
    'keybind': '3',
    'multiplier': 8,
    'type': 'per-second',
  },
  'server': {
    'base': 100,
    'bonus': 3,
    'keybind': '4',
    'multiplier': 16,
    'type': 'per-second',
  },
  'cluster': {
    'base': 200,
    'bonus': 4,
    'keybind': '5',
    'multiplier': 32,
    'type': 'per-second',
  },
  'investor': {
    'base': 100,
    'bonus': 1,
    'keybind': '6',
    'multiplier': 64,
    'type': 'multiplier',
  },
};
