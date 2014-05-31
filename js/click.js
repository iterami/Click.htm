function calculate_upgrade_cost(upgrade, cost){
    document.getElementById('upgrade-' + upgrade + '-cost').innerHTML = Math.pow(
      upgrade_base + cost,
      parseInt(document.getElementById('upgrade-' + upgrade).innerHTML) + 1
    );
}

function click_button(){
    // add clicks-per-click to clicks
    document.getElementById('clicks').innerHTML = 
      parseInt(document.getElementById('clicks').innerHTML)
      + Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML)
      * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
}

function purchase(upgrade, cost, target){
    // if user can afford upgrade
    if(parseInt(document.getElementById('clicks').innerHTML)
      >= parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML)){
        // subtract cost of upgrade from clicks
        document.getElementById('clicks').innerHTML =
          parseInt(document.getElementById('clicks').innerHTML)
        - parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML);

        // increase upgrade
        document.getElementById('upgrade-' + upgrade).innerHTML =
          parseInt(document.getElementById('upgrade-' + upgrade).innerHTML) + 1;

        // increase upgrade cost
        calculate_upgrade_cost(upgrade, cost);

        // increase target value, either clicks-per-click or clicks-per-second
        document.getElementById(target).innerHTML = parseInt(document.getElementById(target).innerHTML)
          + (cost < 1 || cost > 4
            ? 1
            : cost
          );

        // recalculate multiplied values
        document.getElementById('clicks-per-click-multiplied').innerHTML =
          Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML)
          * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));

        document.getElementById('clicks-per-second-multiplied').innerHTML =
          Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML)
          * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
    }
}

function reset(){
    if(confirm('Reset?')){
        window.localStorage.removeItem('click-clicks');
        window.localStorage.removeItem('click-clicks-multiplier');
        window.localStorage.removeItem('click-clicks-per-click');
        window.localStorage.removeItem('click-clicks-per-second');

        window.localStorage.removeItem('click-upgrade-cluster');
        window.localStorage.removeItem('click-upgrade-employee');
        window.localStorage.removeItem('click-upgrade-investor');
        window.localStorage.removeItem('click-upgrade-manual');
        window.localStorage.removeItem('click-upgrade-script');
        window.localStorage.removeItem('click-upgrade-server');

        document.getElementById('clicks').innerHTML = 0;
        document.getElementById('clicks-multiplier').innerHTML = 100;
        document.getElementById('clicks-per-click').innerHTML = 1;
        document.getElementById('clicks-per-second').innerHTML = 0;

        document.getElementById('clicks-per-click-multiplied').innerHTML = 1;
        document.getElementById('clicks-per-second-multiplied').innerHTML = 0;

        document.getElementById('upgrade-cluster').innerHTML = 0;
        document.getElementById('upgrade-employee').innerHTML = 0;
        document.getElementById('upgrade-investor').innerHTML = 0;
        document.getElementById('upgrade-manual').innerHTML = 0;
        document.getElementById('upgrade-script').innerHTML = 0;
        document.getElementById('upgrade-server').innerHTML = 0;

        set_upgrade(
          'cluster',
          4
        );
        set_upgrade(
          'employee',
          2
        );
        set_upgrade(
          'investor',
          5
        );
        set_upgrade(
          'manual',
          0
        );
        set_upgrade(
          'script',
          1
        );
        set_upgrade(
          'server',
          3
        );

        document.getElementById('hotkey-click').value = 'C';
        document.getElementById('hotkey-manual').value = 'A';
        document.getElementById('hotkey-script').value = 'R';
        document.getElementById('hotkey-employee').value = 'E';
        document.getElementById('hotkey-server').value = 'S';
        document.getElementById('hotkey-cluster').value = 'T';
        document.getElementById('hotkey-investor').value = 'V';
    }
}

function second_loop(){
    if(parseInt(document.getElementById('clicks-per-second').innerHTML) > 0){
        document.getElementById('clicks').innerHTML =
          parseInt(document.getElementById('clicks').innerHTML)
        + Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML)
          * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
    }
    // setting the title to # of clicks makes idling easier
    document.title = document.getElementById('clicks').innerHTML;

    // there is always another second
    setTimeout('second_loop()', 1000);
}

function set_upgrade(upgrade, cost){
    document.getElementById('upgrade-' + upgrade).innerHTML =
      window.localStorage.getItem('click-upgrade-' + upgrade) === null
        ? 0
        : window.localStorage.getItem('click-upgrade-' + upgrade);
    
    calculate_upgrade_cost(upgrade, cost);
}

var keyclick_ready = 1;
var upgrade_base = 2;

// load values from localStorage, if they exist
document.getElementById('clicks').innerHTML =
  window.localStorage.getItem('click-clicks') === null
    ? 0
    : window.localStorage.getItem('click-clicks');

document.getElementById('clicks-multiplier').innerHTML =
  window.localStorage.getItem('click-clicks-multiplier') === null
    ? 100
    : window.localStorage.getItem('click-clicks-multiplier');

document.getElementById('clicks-per-click').innerHTML =
  window.localStorage.getItem('click-clicks-per-click') === null
    ? 1
    : window.localStorage.getItem('click-clicks-per-click');

document.getElementById('clicks-per-second').innerHTML =
  window.localStorage.getItem('click-clicks-per-second') === null
    ? 0
    : window.localStorage.getItem('click-clicks-per-second');

document.getElementById('clicks-per-click-multiplied').innerHTML =
  Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML)
  * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));

document.getElementById('clicks-per-second-multiplied').innerHTML =
  Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML)
  * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));

set_upgrade(
  'cluster',
  4
);
set_upgrade(
  'employee',
  2
);
set_upgrade(
  'investor',
  5
);
set_upgrade(
  'manual',
  0
);
set_upgrade(
  'script',
  1
);
set_upgrade(
  'server',
  3
);

setTimeout(
  'second_loop()',
  1000
);

window.onbeforeunload = function(e){
    // if any progress has been made
    if(parseInt(document.getElementById('clicks').innerHTML) > 0
      || parseInt(document.getElementById('clicks-per-click').innerHTML) > 1
      || parseInt(document.getElementById('clicks-per-second').innerHTML) > 0
      || parseInt(document.getElementById('clicks-multiplier').innerHTML) > 100){
        // save progress into localStorage
        window.localStorage.setItem(
          'click-clicks',
          document.getElementById('clicks').innerHTML
        );
        window.localStorage.setItem(
          'click-clicks-multiplier',
          document.getElementById('clicks-multiplier').innerHTML
        );
        window.localStorage.setItem(
          'click-clicks-per-click',
          document.getElementById('clicks-per-click').innerHTML
        );
        window.localStorage.setItem(
          'click-clicks-per-second',
          document.getElementById('clicks-per-second').innerHTML
        );

        // save upgrades into localStorage
        window.localStorage.setItem(
          'click-upgrade-cluster',
          document.getElementById('upgrade-cluster').innerHTML
        );
        window.localStorage.setItem(
          'click-upgrade-employee',
          document.getElementById('upgrade-employee').innerHTML
        );
        window.localStorage.setItem(
          'click-upgrade-investor',
          document.getElementById('upgrade-investor').innerHTML
        );
        window.localStorage.setItem(
          'click-upgrade-manual',
          document.getElementById('upgrade-manual').innerHTML
        );
        window.localStorage.setItem(
          'click-upgrade-script',
          document.getElementById('upgrade-script').innerHTML
        );
        window.localStorage.setItem(
          'click-upgrade-server',
          document.getElementById('upgrade-server').innerHTML
        );
    }
};

window.onkeydown = function(e){
    var key = window.event ? event : e;
    key = String.fromCharCode(key.charCode ? key.charCode : key.keyCode);

    if(key == document.getElementById('hotkey-click').value){
        if(keyclick_ready > 0){
            keyclick_ready = 0;
            click_button();
        }

    }else if(key == document.getElementById('hotkey-manual').value){
        purchase(
          'manual',
          0,
          'clicks-per-click'
        );

    }else if(key == document.getElementById('hotkey-script').value){
        purchase(
          'script',
          1,
          'clicks-per-second'
        );

    }else if(key == document.getElementById('hotkey-employee').value){
        purchase(
          'employee',
          2,
          'clicks-per-second'
        );

    }else if(key == document.getElementById('hotkey-server').value){
        purchase(
          'server',
          3,
          'clicks-per-second'
        );

    }else if(key == document.getElementById('hotkey-cluster').value){
        purchase(
          'cluster',
          4,
          'clicks-per-second'
        );

    }else if(key == document.getElementById('hotkey-investor').value){
        purchase(
          'investor',
          5,
          'clicks-multiplier'
        );
    }
};

window.onkeyup = function(e){
    var key = window.event ? event : e;
    key = String.fromCharCode(key.charCode ? key.charCode : key.keyCode);

    if(key == document.getElementById('hotkey-click').value){
        keyclick_ready = 1;
    }
};
