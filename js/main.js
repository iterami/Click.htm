'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'click-button': {
          'onclick': click_button,
        },
      },
      'globals': {
        'keyclick_ready': 1,
        'upgrades': {
          'manual': {
            'bonus': 1,
            'cost': 2,
            'multiplier': 2,
            'target': 'clicks-per-click',
          },
          'script': {
            'bonus': 1,
            'cost': 20,
            'multiplier': 4,
            'target': 'clicks-per-second',
          },
          'employee': {
            'bonus': 2,
            'cost': 50,
            'multiplier': 8,
            'target': 'clicks-per-second',
          },
          'server': {
            'bonus': 3,
            'cost': 100,
            'multiplier': 16,
            'target': 'clicks-per-second',
          },
          'cluster': {
            'bonus': 4,
            'cost': 200,
            'multiplier': 32,
            'target': 'clicks-per-second',
          },
          'coffeemaker': {
            'bonus': 10,
            'cost': 20,
            'multiplier': 64,
            'target': 'multiplier-per-click',
          },
          'investor': {
            'bonus': 1,
            'cost': 20,
            'multiplier': 64,
            'target': 'multiplier-per-second',
          },
        },
      },
      'storage': {
        'clicks': 0,
        'clicks-per-click': 1,
        'clicks-per-click-multiplied': 1,
        'clicks-per-second': 0,
        'clicks-per-second-multiplied': 0,
        'multiplier-per-click': 100,
        'multiplier-per-second': 100,
      },
      'title': 'Click.htm',
    });

    core_storage_data['clicks-per-click-multiplied'] = Math.floor(core_storage_data['clicks-per-click'] * (core_storage_data['multiplier-per-click'] / 100));
    core_storage_data['clicks-per-second-multiplied'] = Math.floor(core_storage_data['clicks-per-second'] * (core_storage_data['multiplier-per-second'] / 100));

    for(let id in upgrades){
        let upgrade = id[0].toUpperCase() + id.substring(1);

        document.getElementById('upgrades').innerHTML +=
          '<span id=upgrade-' + id + '>0</span>'
          + ' <input id=' + id + ' type=button value=' + upgrade + '>'
          + ' <span id=upgrade-' + id + '-cost>' + (upgrades[id]['cost'] + core_storage_data['upgrade-' + id + '-cost']) +'</span><br>';
    }

    for(let id in upgrades){
        let storage = {};

        storage['upgrade-' + id] = 0;
        storage['upgrade-' + id + '-cost'] = upgrades[id]['cost'];

        core_storage_add({
          'storage': storage,
        });

        document.getElementById(id).onclick = function(){
            purchase(
              this.id,
              core_storage_data['upgrade-' + this.id + '-cost'],
              upgrades[this.id]['target']
            );
        };
    }

    core_interval_modify({
      'id': 'second',
      'interval': 1000,
      'todo': second,
    });

    core_storage_update();
}
