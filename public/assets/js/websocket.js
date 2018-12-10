window.addEventListener('load', () => {
  let msgbox = document.getElementById('msgs');
  let ws = new WebSocket('ws://' + window.location.host + '/websocket');

  ws.onopen = () => console.log('connection opened');
  ws.onclose = () => console.log('connection closed');
  ws.onmessage = m => {
    let li = document.createElement('li');
    li.textContent = m.data;
    msgbox.insertBefore(li, msgbox.firstChild);
  }
});
