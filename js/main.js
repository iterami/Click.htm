'use strict';

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
