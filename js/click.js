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

function init(){
    // Load values from window.localStorage, if they exist.
    document.getElementById('clicks').innerHTML =
      window.localStorage.getItem('Click.htm-clicks') === null
        ? 0
        : window.localStorage.getItem('Click.htm-clicks');

    document.getElementById('hotkey-click').value =
      window.localStorage.getItem('Click.htm-hotkey-click') === null
        ? 'C'
        : window.localStorage.getItem('Click.htm-hotkey-click');

    document.getElementById('clicks-multiplier').innerHTML =
      window.localStorage.getItem('Click.htm-clicks-multiplier') === null
        ? 100
        : window.localStorage.getItem('Click.htm-clicks-multiplier');

    document.getElementById('clicks-per-click').innerHTML =
      window.localStorage.getItem('Click.htm-clicks-per-click') === null
        ? 1
        : window.localStorage.getItem('Click.htm-clicks-per-click');

    document.getElementById('clicks-per-second').innerHTML =
      window.localStorage.getItem('Click.htm-clicks-per-second') === null
        ? 0
        : window.localStorage.getItem('Click.htm-clicks-per-second');

    document.getElementById('clicks-per-click-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML)
      * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));

    document.getElementById('clicks-per-second-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML)
      * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));

    for(id in upgrades){
        document.getElementById('upgrades').innerHTML +=
          '<span id=upgrade-' + upgrades[id][0] + '></span>'
          + ' <input onclick=purchase('
            + upgrades[id][0] + ','
            + upgrades[id][1] + ','
            + 'clicks-' + upgrades[id][3]
          + ') type=button value=' + upgrades[id][0] + '>'
          + ' <input id=hotkey-' + upgrades[id][0] + ' maxlength=1>'
          + ' <span id=upgrade-' + upgrades[id][0] + '-cost></span><br>';
    }

    for(id in upgrades){
        document.getElementById('hotkey-' + upgrades[id][0]).value =
          window.localStorage.getItem('Click.htm-hotkey-' + upgrades[id][0]) === null
            ? upgrades[id][2]
            : window.localStorage.getItem('Click.htm-hotkey-' + upgrades[id][0]);

        set_upgrade(
          upgrades[id][0],
          upgrades[id][1]
        );
    }

    setTimeout(
      'second_loop()',
      1000
    );
}

function purchase(upgrade, cost, target){
    if(parseInt(document.getElementById('clicks').innerHTML)
      < parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML)){
        return;
    }

    // If user can afford upgrade...
    //   ...subtract cost of upgrade from clicks...
    document.getElementById('clicks').innerHTML =
      parseInt(document.getElementById('clicks').innerHTML)
    - parseInt(document.getElementById('upgrade-' + upgrade + '-cost').innerHTML);

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
    document.getElementById('clicks-per-click-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-click').innerHTML)
      * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));

    document.getElementById('clicks-per-second-multiplied').innerHTML =
      Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML)
      * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
}

function reset_score(){
    if(!confirm('Reset score?')){
        return;
    }

    window.localStorage.removeItem('Click.htm-clicks');
    window.localStorage.removeItem('Click.htm-clicks-multiplier');
    window.localStorage.removeItem('Click.htm-clicks-per-click');
    window.localStorage.removeItem('Click.htm-clicks-per-second');

    document.getElementById('clicks').innerHTML = 0;
    document.getElementById('clicks-multiplier').innerHTML = 100;
    document.getElementById('clicks-per-click').innerHTML = 1;
    document.getElementById('clicks-per-second').innerHTML = 0;

    document.getElementById('clicks-per-click-multiplied').innerHTML = 1;
    document.getElementById('clicks-per-second-multiplied').innerHTML = 0;

    for(id in upgrades){
        window.localStorage.removeItem('Click.htm-upgrade-' + upgrades[id][0]);

        document.getElementById('upgrade-' + upgrades[id][0]).innerHTML = 0;

        set_upgrade(
          upgrades[id][0],
          upgrades[id][1]
        );
    }
}

function reset_settings(){
    if(!confirm('Reset settings?')){
        return;
    }

    window.localStorage.removeItem('Click.htm-hotkey-click');
    document.getElementById('hotkey-click').value = 'C';

    for(id in upgrades){
        window.localStorage.removeItem('Click.htm-hotkey-' + upgrades[id][0]);
        document.getElementById('hotkey-' + upgrades[id][0]).value = upgrades[id][2];
    }
}

function second_loop(){
    if(parseInt(document.getElementById('clicks-per-second').innerHTML) > 0){
        document.getElementById('clicks').innerHTML =
          parseInt(document.getElementById('clicks').innerHTML)
        + Math.floor(parseInt(document.getElementById('clicks-per-second').innerHTML)
          * (parseInt(document.getElementById('clicks-multiplier').innerHTML) / 100));
    }

    // Setting the title to # of clicks makes idling easier.
    document.title = document.getElementById('clicks').innerHTML;

    // There is always another second.
    setTimeout(
      'second_loop()',
      1000
    );
}

function set_upgrade(upgrade, cost){
    document.getElementById('upgrade-' + upgrade).innerHTML =
      window.localStorage.getItem('Click.htm-upgrade-' + upgrade) === null
        ? 0
        : window.localStorage.getItem('Click.htm-upgrade-' + upgrade);
    
    calculate_upgrade_cost(upgrade, cost);
}

var keyclick_ready = 1;
var upgrade_base = 2;
var upgrades = [
  ['manual', 0, 'A', 'per-click'],
  ['script', 1, 'R', 'per-second'],
  ['employee', 2, 'E', 'per-second'],
  ['server', 3, 'S', 'per-second'],
  ['cluster', 4, 'T', 'per-second'],
  ['investor', 5, 'V', 'multiplier'],
];

window.onbeforeunload = function(e){
    // If any progress has been made.
    if(parseInt(document.getElementById('clicks').innerHTML) > 0
      || parseInt(document.getElementById('clicks-per-click').innerHTML) > 1
      || parseInt(document.getElementById('clicks-per-second').innerHTML) > 0
      || parseInt(document.getElementById('clicks-multiplier').innerHTML) > 100){
        // Save progress into window.localStorage.
        window.localStorage.setItem(
          'Click.htm-clicks',
          document.getElementById('clicks').innerHTML
        );
        window.localStorage.setItem(
          'Click.htm-clicks-multiplier',
          document.getElementById('clicks-multiplier').innerHTML
        );
        window.localStorage.setItem(
          'Click.htm-clicks-per-click',
          document.getElementById('clicks-per-click').innerHTML
        );
        window.localStorage.setItem(
          'Click.htm-clicks-per-second',
          document.getElementById('clicks-per-second').innerHTML
        );

        // Save upgrades into window.localStorage.
        for(id in upgrades){
            window.localStorage.setItem(
              'Click.htm-upgrade-' + upgrades[id][0],
              document.getElementById('upgrade-' + upgrades[id][0]).innerHTML
            );
        }
    }

    // Save click hotkey, if different from default.
    if(document.getElementById('hotkey-click').value != 'C'){
        window.localStorage.setItem(
          'Click.htm-hotkey-click',
          document.getElementById('hotkey-click').value
        );

    }else{
        window.localStorage.removeItem('Click.htm-hotkey-click');
    }

    // Save upgrade hotkeys, if different from default.
    for(id in upgrades){
        if(document.getElementById('hotkey-' + upgrades[id][0]).value != upgrades[id][2]){
            window.localStorage.setItem(
              'Click.htm-hotkey-' + upgrades[id][0],
              document.getElementById('hotkey-' + upgrades[id][0]).value
            );

        }else{
            window.localStorage.removeItem('Click.htm-hotkey-' + upgrades[id][0]);
        }
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

        return;
    }

    for(id in upgrades){
        if(key == document.getElementById('hotkey-' + upgrades[id][0]).value){
            purchase(
              upgrades[id][0],
              upgrades[id][1],
              'clicks-' + upgrades[id][3]
            );
        }
    }
};

window.onkeyup = function(e){
    var key = window.event ? event : e;
    key = String.fromCharCode(key.charCode ? key.charCode : key.keyCode);

    if(key == document.getElementById('hotkey-click').value){
        keyclick_ready = 1;
    }
};

window.onload = init;
