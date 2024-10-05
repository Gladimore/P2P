const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const peerIdInput = document.getElementById('peerId');
const connectPeerButton = document.getElementById('connectPeer');
const myPeerIdDisplay = document.getElementById('myPeerId');

const peer = new Peer();

peer.on('open', (id) => {
    myPeerIdDisplay.innerText = id;
    myPeerIdDisplay.style.cursor = 'pointer'; // Change cursor to pointer for copy

    // Copy Peer ID to clipboard when clicked
    myPeerIdDisplay.onclick = () => {
        navigator.clipboard.writeText(id).then(() => {
            showAlert('Copied!', 'Your Peer ID has been copied to the clipboard.', 'success');
        }).catch(err => {
            showAlert('Error!', 'Failed to copy Peer ID: ' + err.message, 'error');
        });
    };
});

// Handle incoming connections
peer.on('connection', (conn) => {
    setupConnection(conn);
});

// Handle button click to connect to another peer
connectPeerButton.onclick = () => {
    const peerId = peerIdInput.value;
    const conn = peer.connect(peerId);

    conn.on('open', () => {
        setupConnection(conn); // Call the setupConnection function to handle the new connection
    });

    conn.on('error', (err) => {
        showAlert('Connection Error', 'Could not connect to peer. ' + err.message, 'error');
    });
};

// Function to set up the connection
function setupConnection(conn) {
    conn.on('data', (data) => {
        messagesContainer.appendChild(createMessageElement(`Peer: ${data}`));
    });

    sendMessageButton.onclick = () => {
        const message = messageInput.value.trim();
        if (message) {
            conn.send(message);
            messagesContainer.appendChild(createMessageElement(`You: ${message}`));
            messageInput.value = '';
        }
    };

    showAlert('Connected', 'You are now connected to a peer!', 'success');
}

// Helper function to create a new message element
function createMessageElement(content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = content;
    return messageElement;
}

// Helper function to show alerts
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    });
}