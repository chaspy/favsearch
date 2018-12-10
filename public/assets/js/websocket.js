window.addEventListener('load', () => {
  let msgbox = document.getElementById('msgs');
  let form = document.getElementById('form');
  let sendMsg = document.getElementById('send-msg');
  let ws = new WebSocket('ws://' + window.location.host + '/websocket');

  ws.onopen = () => console.log('connection opened');
  ws.onclose = () => console.log('connection closed');
  ws.onmessage = m => {
    let li = document.createElement('li');
    li.textContent = m.data;
    msgbox.insertBefore(li, msgbox.firstChild);
  }

  sendMsg.addEventListener('click', () => sendMsg.value = '');

  form.addEventListener('submit', e => {
    ws.send(sendMsg.value);
    sendMsg.value = '';
    e.preventDefault();
  });
});
