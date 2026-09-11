'use strict';

function click_button(event){
    event.target.blur();

    core_storage_data.clicks = core_round({
      'decimals': 2,
      'number': core_storage_data.clicks + core_storage_data.clicks_per_click * core_storage_data.multiplier_per_click,
    });

    core_storage_update(['clicks']);

    core_ui_update({
      'ids': {
        'ui_clicks': core_number_format({
          'decimals_min': 2,
          'number': core_storage_data.clicks,
        }),
      },
    });
}

function purchase(upgrade, cost, target, free){
    free = free || false;

    if(!free
      && core_storage_data.clicks < core_storage_data['upgrade_' + upgrade + '_cost']){
        return;
    }

    if(!free){
        core_storage_data.clicks = core_round({
          'decimals': 2,
          'number': core_storage_data.clicks - core_storage_data['upgrade_' + upgrade + '_cost'],
        });
        core_ui_update({
          'ids': {
            'ui_clicks': core_number_format({
              'decimals_min': 2,
              'number': core_storage_data.clicks,
            }),
          },
        });
    }

    core_storage_data['upgrade_' + upgrade] += 1;
    core_storage_data['upgrade_' + upgrade + '_cost'] *= upgrades[upgrade].multiplier;
    document.getElementById('ui_upgrade_' + upgrade + '_cost').textContent = core_number_format({
      'number': core_storage_data['upgrade_' + upgrade + '_cost'],
    });

    core_storage_data[target] = core_round({
      'decimals': 2,
      'number': core_storage_data[target] + upgrades[upgrade].bonus,
    });

    update_multiplied();
    core_storage_update();
}

function repo_init(){
    core_repo_init({
      'events': {
        'click_button': {
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
            'target': 'clicks_per_click',
          },
          'script': {
            'bonus': 1,
            'cost': 20,
            'multiplier': 4,
            'target': 'clicks_per_second',
          },
          'employee': {
            'bonus': 2,
            'cost': 50,
            'multiplier': 8,
            'target': 'clicks_per_second',
          },
          'server': {
            'bonus': 3,
            'cost': 100,
            'multiplier': 16,
            'target': 'clicks_per_second',
          },
          'cluster': {
            'bonus': 4,
            'cost': 200,
            'multiplier': 32,
            'target': 'clicks_per_second',
          },
          'supercomputer': {
            'bonus': 5,
            'cost': 500,
            'multiplier': 64,
            'target': 'clicks_per_second',
          },
          'coffeemaker': {
            'bonus': .1,
            'cost': 20,
            'multiplier': 64,
            'target': 'multiplier_per_click',
          },
          'investor': {
            'bonus': .01,
            'cost': 20,
            'multiplier': 64,
            'target': 'multiplier_per_second',
          },
        },
      },
      'info': '<a href=../Docs.htm/repos/click-htm.htm target=_blank>View Docs for Click.htm</a>',
      'storage': {
        'clicks': 0,
        'clicks_per_click': 1,
        'clicks_per_click_multiplied': 1,
        'clicks_per_second': 0,
        'clicks_per_second_multiplied': 0,
        'multiplier_per_click': 1,
        'multiplier_per_second': 1,
      },
      'title': 'Click.htm',
    });

    update_multiplied();

    let upgradesHTML = '';
    for(const id in upgrades){
        const upgrade = id[0].toUpperCase() + id.substring(1);

        upgradesHTML += '<tr><td><span id=upgrade_' + id + '>0</span>'
          + ' <td><button id=' + id + ' type=button>' + upgrade + '</button>'
          + ' <td><span id=ui_upgrade_' + id + '_cost></span>'
          + '<input class=hidden id=upgrade_' + id + '_cost type=text>';
    }
    document.getElementById('upgrades').innerHTML = upgradesHTML;

    for(const id in upgrades){
        const storage = {};

        storage['upgrade_' + id] = 0;
        storage['upgrade_' + id + '_cost'] = upgrades[id].cost;

        core_storage_add({
          'storage': storage,
        });

        document.getElementById(id).onclick = function(){
            purchase(
              this.id,
              core_storage_data['upgrade_' + this.id + '_cost'],
              upgrades[this.id].target
            );
        };

        document.getElementById('ui_upgrade_' + id + '_cost').textContent = core_number_format({
          'number': core_storage_data['upgrade_' + id + '_cost'],
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
        'ui_clicks': core_number_format({
          'decimals_min': 2,
          'number': core_storage_data.clicks,
        }),
      },
    });
}

function second(){
    core_storage_data.clicks = core_round({
      'decimals': 2,
      'number': core_storage_data.clicks + core_storage_data.clicks_per_second * core_storage_data.multiplier_per_second,
    });

    core_storage_update(['clicks']);
    core_storage_save({
      'rebind': false,
    });

    const formatted = core_number_format({
      'decimals_min': 2,
      'number': core_storage_data.clicks,
    });
    core_ui_update({
      'ids': {
        'ui_clicks': formatted,
      },
    });
    document.title = formatted + ' - ' + core_repo_title;
}

function update_multiplied(){
    core_storage_data.clicks_per_click_multiplied = core_round({
      'decimals': 2,
      'number': core_storage_data.clicks_per_click * core_storage_data.multiplier_per_click,
    });
    core_storage_data.clicks_per_second_multiplied = core_round({
      'decimals': 2,
      'number': core_storage_data.clicks_per_second * core_storage_data.multiplier_per_second,
    });
}
