'use strict';

function click_button(){
    core_storage_data['clicks'] = core_round({
      'decimals': 2,
      'number': core_storage_data['clicks'] + core_storage_data['clicks-per-click'] * core_storage_data['multiplier-per-click'],
    });

    core_storage_update({
      'keys': [
        'clicks',
      ],
    });

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

function second(){
    core_storage_data['clicks'] = core_round({
      'decimals': 2,
      'number': core_storage_data['clicks'] + core_storage_data['clicks-per-second'] * core_storage_data['multiplier-per-second'],
    });

    core_storage_update({
      'keys': [
        'clicks',
      ],
    });
    core_storage_save({
      'keys': [
        'clicks',
      ],
    });

    const formatted = core_number_format({
      'decimals-min': 2,
      'number': core_storage_data['clicks'],
    });
    core_ui_update({
      'ids': {
        'ui-clicks': formatted,
      },
    });
    document.title = formatted;
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
