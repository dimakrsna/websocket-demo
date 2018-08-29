const APP = {};

(function(window){

	let status, 
		messages, 
		form, 
		input, 
		btn,
		btnSend,
		domElems,
		setStatus,
		printMessage,
		attachEvents,
		createWebSocket,
		ws,
		wsUri = 'wss://echo.websocket.org',
		isConnected = true,
		init;

	APP.variables = () => {
		status = document.querySelector('.js-status');
		messages = document.querySelector('.js-messages');
		form = document.querySelector('.js-form');
		input = document.querySelector('.js-input');
		btn = document.querySelector('.js-btn');
		btnSend = document.querySelector('.js-btn-send');
	}

	APP.createWebSocket = () => {
		ws = new WebSocket(wsUri);
		ws.onopen = () => APP.setStatus('ONLINE');
		ws.onclose = () => APP.setStatus('<i class="off">OFFLINE</i>');
		ws.onmessage = (response) => APP.printMessage(response.data);
		ws.onerror = (e) => APP.setStatus('ERROR ' + e.data )
	}

	APP.setStatus = (value) => {
		status.innerHTML = value;
	}

	APP.printMessage = (value) => {
		const li = document.createElement('li');

		li.innerHTML = value;
		messages.appendChild(li);
	}

	APP.toggleConnect = function(e){
		e.preventDefault();

		if (isConnected){
			ws.close();

			btnSend.setAttribute('disabled', 'disabled');
			e.target.innerText = 'Connect';
		} else {
			APP.createWebSocket();
			btnSend.removeAttribute('disabled');
			e.target.innerHTML = 'Disconnect';
		}

		isConnected = !isConnected;
	}

	APP.attachEvents = () => {

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			ws.send(input.value);
			input.value = '';
		})

		btnSend.addEventListener('click', (e) => {
			ws.send(input.value);
			input.value = '';
		})

		btn.addEventListener('click', (e) => {
			APP.toggleConnect(e)
		})

	}

	APP.init = () => {
		APP.variables()
		APP.createWebSocket();
		APP.attachEvents();
	}

	window.onload = APP.init();

}(window));

window.APP = APP;