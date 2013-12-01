function click_button(){
    // add clicks-per-click to clicks
    document.getElementById('clicks').innerHTML = 
      parseInt(document.getElementById('clicks').innerHTML)
    + parseInt(document.getElementById('clicks-per-click').innerHTML);
}

function purchase(upgrade, cost, target){
    // if user can afford upgrade
    if(parseInt(document.getElementById('clicks').innerHTML) >= parseInt(document.getElementById(upgrade + '-cost').innerHTML)){
        // subtract cost of upgrade from clicks
        document.getElementById('clicks').innerHTML =
          parseInt(document.getElementById('clicks').innerHTML)
        - parseInt(document.getElementById(upgrade + '-cost').innerHTML);

        // increase upgrade
        document.getElementById(upgrade).innerHTML = parseInt(document.getElementById(upgrade).innerHTML) + 1;

        // increase upgrade cost
        document.getElementById(upgrade + '-cost').innerHTML = Math.pow(
          10 + cost * 2,
          parseInt(document.getElementById(upgrade).innerHTML) + 1
        );

        // increase target value, either clicks-per-click or clicks-per-second
        document.getElementById(target).innerHTML = parseInt(document.getElementById(target).innerHTML) + 1;
    }
}

function reset(){
    if(confirm('Reset?')){
        window.localStorage.removeItem('click-clicks');
        window.localStorage.removeItem('click-clicks-per-click');
        window.localStorage.removeItem('click-clicks-per-second');

        window.localStorage.removeItem('click-upgrade-employee');
        window.localStorage.removeItem('click-upgrade-manual');
        window.localStorage.removeItem('click-upgrade-script');
        window.localStorage.removeItem('click-upgrade-server');

        document.getElementById('clicks').innerHTML = 0;
        document.getElementById('clicks-per-click').innerHTML = 1;
        document.getElementById('clicks-per-second').innerHTML = 0;

        document.getElementById('upgrade-employee').innerHTML = 0;
        document.getElementById('upgrade-employee-cost').innerHTML = 30;
        document.getElementById('upgrade-manual').innerHTML = 0;
        document.getElementById('upgrade-manual-cost').innerHTML = 10;
        document.getElementById('upgrade-script').innerHTML = 0;
        document.getElementById('upgrade-script-cost').innerHTML = 20;
        document.getElementById('upgrade-server').innerHTML = 0;
        document.getElementById('upgrade-server-cost').innerHTML = 40;
    }
}

function second_loop(){
    if(parseInt(document.getElementById('clicks-per-second').innerHTML) > 0){
        document.getElementById('clicks').innerHTML =
          parseInt(document.getElementById('clicks').innerHTML)
        + parseInt(document.getElementById('clicks-per-second').innerHTML);
    }
    // setting the title to # of clicks makes idling easier
    document.title = document.getElementById('clicks').innerHTML;

    // there is always another second
    setTimeout('second_loop()', 1000);
}

function set_upgrade(upgrade, cost){
	document.getElementById(upgrade).innerHTML = window.localStorage.getItem('click-' + upgrade) === null
	  ? 0
	  : window.localStorage.getItem('click-' + upgrade);
	document.getElementById(upgrade + '-cost').innerHTML = Math.pow(
	  10 + cost * 10,
	  parseInt(document.getElementById(upgrade).innerHTML) + 1
	);
}

// load values from localStorage, if they exist
document.getElementById('clicks').innerHTML = window.localStorage.getItem('click-clicks') === null
  ? 0
  : window.localStorage.getItem('click-clicks');
document.getElementById('clicks-per-click').innerHTML = window.localStorage.getItem('click-clicks-per-click') === null
  ? 1
  : window.localStorage.getItem('click-clicks-per-second');
document.getElementById('clicks-per-second').innerHTML = window.localStorage.getItem('click-clicks-per-second') === null
  ? 0
  : window.localStorage.getItem('click-clicks-per-second');

set_upgrade('upgrade-employee', 2);
set_upgrade('upgrade-manual', 0);
set_upgrade('upgrade-script', 1);
set_upgrade('upgrade-server', 3);

setTimeout('second_loop()', 1000);

window.onbeforeunload = function(e){
    // if any progress has been made
    if(  parseInt(document.getElementById('clicks').innerHTML)            > 0
      || parseInt(document.getElementById('clicks-per-click').innerHTML)  > 1
      || parseInt(document.getElementById('clicks-per-second').innerHTML) > 0){
        // save progress into localStorage
        window.localStorage.setItem('click-clicks',            document.getElementById('clicks').innerHTML);
        window.localStorage.setItem('click-clicks-per-click',  document.getElementById('clicks-per-click').innerHTML);
        window.localStorage.setItem('click-clicks-per-second', document.getElementById('clicks-per-second').innerHTML);

        // save upgrades into localStorage
        window.localStorage.setItem('click-upgrade-employee',  document.getElementById('upgrade-employee').innerHTML);
        window.localStorage.setItem('click-upgrade-manual',    document.getElementById('upgrade-manual').innerHTML);
        window.localStorage.setItem('click-upgrade-script',    document.getElementById('upgrade-script').innerHTML);
        window.localStorage.setItem('click-upgrade-server',    document.getElementById('upgrade-server').innerHTML);
    }
};
