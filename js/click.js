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
      'storage': {
        'clicks': 0,
        'clicks-multiplier': 100,
        'clicks-per-click': 1,
        'clicks-per-click-multiplied': 1,
        'clicks-per-second': 0,
        'clicks-per-second-multiplied': 0,
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
          + ' <input id=' + id + ' type=button value=' + upgrade + '>'
          + ' <span id=upgrade-' + id + '-cost>' + (upgrades[id]['cost'] + core_storage_data['upgrade-' + id + '-cost']) +'</span><br>';
    }

    for(id in upgrades){
        var storage = {};

        storage['upgrade-' + id] = 0;
        storage['upgrade-' + id + '-cost'] = upgrades[id]['cost'];

        core_storage_add({
          'storage': storage,
        });

        document.getElementById(id).onclick = function(){
            purchase(
              this.id,
              core_storage_data['upgrade-' + this.id + '-cost'],
              'clicks-' + upgrades[this.id]['type']
            );
        };
    }

    document.getElementById('click-button').onclick = click_button;

    window.setTimeout(
      second,
      1000
    );

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

var keyclick_ready = 1;
var upgrades = {
  'manual': {
    'bonus': 1,
    'cost': 2,
    'multiplier': 2,
    'type': 'per-click',
  },
  'script': {
    'bonus': 1,
    'cost': 20,
    'multiplier': 4,
    'type': 'per-second',
  },
  'employee': {
    'bonus': 2,
    'cost': 50,
    'multiplier': 8,
    'type': 'per-second',
  },
  'server': {
    'bonus': 3,
    'cost': 100,
    'multiplier': 16,
    'type': 'per-second',
  },
  'cluster': {
    'bonus': 4,
    'cost': 200,
    'multiplier': 32,
    'type': 'per-second',
  },
  'investor': {
    'bonus': 1,
    'cost': 20,
    'multiplier': 64,
    'type': 'multiplier',
  },
};
