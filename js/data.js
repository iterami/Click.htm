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
        // If user can afford upgrade, subtract cost of upgrade from clicks...
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

function second(){
    core_storage_data['clicks'] += Math.floor(core_storage_data['clicks-per-second'] * (core_storage_data['clicks-multiplier'] / 100));

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
