'use strict';

function click_button(){
    core_storage_data['clicks'] = core_round({
      'decimals': 2,
      'number': core_storage_data['clicks'] + core_storage_data['clicks-per-click'] * core_storage_data['multiplier-per-click'],
    });

    core_storage_update([
      'clicks',
    ]);

    core_ui_update({
      'ids': {
        'ui-clicks': core_number_format({
          'decimals-min': 2,
          'number': core_storage_data['clicks'],
        }),
      },
    });

    document.getElementById('click-button').blur();
}

function purchase(upgrade, cost, target, free){
    free = free || false;

    if(!free
      && core_storage_data['clicks'] < core_storage_data['upgrade-' + upgrade + '-cost']){
        return;
    }

    if(!free){
        core_storage_data['clicks'] = core_round({
          'decimals': 2,
          'number': core_storage_data['clicks'] - core_storage_data['upgrade-' + upgrade + '-cost'],
        });
        core_ui_update({
          'ids': {
            'ui-clicks': core_number_format({
              'decimals-min': 2,
              'number': core_storage_data['clicks'],
            }),
          },
        });
    }

    core_storage_data['upgrade-' + upgrade] += 1;
    core_storage_data['upgrade-' + upgrade + '-cost'] *= upgrades[upgrade]['multiplier'];
    document.getElementById('ui-upgrade-' + upgrade + '-cost').textContent = core_number_format({
      'decimals-min': 0,
      'number': core_storage_data['upgrade-' + upgrade + '-cost'],
    });

    core_storage_data[target] = core_round({
      'decimals': 2,
      'number': core_storage_data[target] + upgrades[upgrade]['bonus'],
    });

    update_multiplied();
    core_storage_update();
}

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
          'supercomputer': {
            'bonus': 5,
            'cost': 500,
            'multiplier': 64,
            'target': 'clicks-per-second',
          },
          'coffeemaker': {
            'bonus': .1,
            'cost': 20,
            'multiplier': 64,
            'target': 'multiplier-per-click',
          },
          'investor': {
            'bonus': .01,
            'cost': 20,
            'multiplier': 64,
            'target': 'multiplier-per-second',
          },
        },
      },
      'info': '<a href=../Docs.htm/repos/click-htm.htm>Docs</a>',
      'storage': {
        'clicks': 0,
        'clicks-per-click': 1,
        'clicks-per-click-multiplied': 1,
        'clicks-per-second': 0,
        'clicks-per-second-multiplied': 0,
        'multiplier-per-click': 1,
        'multiplier-per-second': 1,
      },
      'title': 'Click.htm',
    });

    update_multiplied();

    let upgradesHTML = '';
    for(const id in upgrades){
        const upgrade = id[0].toUpperCase() + id.substring(1);

        upgradesHTML += '<tr><td><span id=upgrade-' + id + '>0</span>'
          + ' <td><button id=' + id + ' type=button>' + upgrade + '</button>'
          + ' <td><span id=ui-upgrade-' + id + '-cost></span>'
          + '<input class=hidden id=upgrade-' + id + '-cost type=text>';
    }
    document.getElementById('upgrades').innerHTML = upgradesHTML;

    for(const id in upgrades){
        const storage = {};

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

        document.getElementById('ui-upgrade-' + id + '-cost').textContent = core_number_format({
          'decimals-min': 0,
          'number': core_storage_data['upgrade-' + id + '-cost'],
        });
    }

    core_interval_modify({
      'id': 'second',
      'interval': 1000,
      'todo': second,
    });

    core_storage_update();
    core_ui_update({
      'ids': {
        'ui-clicks': core_number_format({
          'decimals-min': 2,
          'number': core_storage_data['clicks'],
        }),
      },
    });
}

function second(){
    core_storage_data['clicks'] = core_round({
      'decimals': 2,
      'number': core_storage_data['clicks'] + core_storage_data['clicks-per-second'] * core_storage_data['multiplier-per-second'],
    });

    core_storage_update([
      'clicks',
    ]);
    core_storage_save([
      'clicks',
    ]);

    const formatted = core_number_format({
      'decimals-min': 2,
      'number': core_storage_data['clicks'],
    });
    core_ui_update({
      'ids': {
        'ui-clicks': formatted,
      },
    });
    document.title = formatted + ' - ' + core_repo_title;
}

function update_multiplied(){
    core_storage_data['clicks-per-click-multiplied'] = core_round({
      'decimals': 2,
      'number': core_storage_data['clicks-per-click'] * core_storage_data['multiplier-per-click'],
    });
    core_storage_data['clicks-per-second-multiplied'] = core_round({
      'decimals': 2,
      'number': core_storage_data['clicks-per-second'] * core_storage_data['multiplier-per-second'],
    });
}
