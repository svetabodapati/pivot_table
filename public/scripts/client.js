var menu = document.querySelector(".context-menu");
var btns = document.querySelectorAll(".context-btn");
var table = document.querySelector('tbody');
var body = document.querySelector('body');
init();


function init(){
	body.addEventListener("contextmenu", displayOptions);
	body.addEventListener("click", hideOptions);
}

function displayOptions(){
	if(event.target.classList.contains('src') || event.target.classList.contains('dest')){
		event.preventDefault();
    	menu.style.left = (event.pageX) +"px";
    	menu.style.top = (event.pageY) +"px";
    	menu.classList.add("active");
    	enableButtons(event.target.innerHTML);
	}else{
		menu.classList.remove("active");
		disableButtons();
	}
}

function hideOptions(){
	menu.classList.remove("active");
	disableButtons();
}


function enableButtons(ip){
	for(let i=0; i<btns.length; i++){
		btns[i].disabled = false;
		btns[i].value = ip.trim();
	}
}

function disableButtons(){
	for(let i=0; i<btns.length; i++){
		btns[i].disabled = true;
		btns[i].value = '';
	}
}

function clearData(){
	table.innerHTML = "";
	var filter = {};
	filter['clear'] = true;
	postData('/update_filter', filter)
    .then(data => updateTable(data))
    .catch(error => console.error(error));
}

function filter(btn, direction){
	table.innerHTML = "";
	var ip = btn.value;
	var filter = {};
	filter['clear'] = false;
	filter['ip'] = ip;
	filter['dir'] = direction; 
	postData('/update_filter', filter)
    .then(data => updateTable(data))
    .catch(error => console.error(error));
}


function postData(url, filter){
	  // Default options are marked with *
	//console.log("posting data");
	//console.log(filter);
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(filter), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses JSON response into native JavaScript objects

}


function updateTable(res){
	var data = res.data;
	var newHTML = "";
	//console.log("data from within client")
	//console.log(data);
	for(let i=0; i<data.length; i++){
		newHTML = newHTML+
		`
				<tr>
					<td scope="col" class="src">
						${data[i].result["All_Traffic.src"]}
					</td>
					<td scope="col" class="dest">
						${data[i].result["All_Traffic.dest"]}
					</td>
					<td scope="col" class="bytes">
						${data[i].result.sum_bytes}
					</td>
				</tr>
		`;
	}
	table.innerHTML = newHTML;
}