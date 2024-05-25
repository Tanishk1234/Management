// Prompt the user to enter registered mobile number and password
var mobileNumber = prompt('Enter your registered mobile number:');
var enteredPassword = prompt('Enter your password:');

// Predefined registered mobile number and password
var predefinedMobileNumber = '9897706852';
var predefinedPassword = '12344321';

// Check if entered credentials match the predefined values
if (mobileNumber !== predefinedMobileNumber || enteredPassword !== predefinedPassword) {
    alert('Invalid credentials. Website cannot be accessed.');
    window.close(); // Close the tab or browser
} else {
    // If the entered credentials match, proceed to load saved data and set up event listeners
    loadSavedData();
}

document.getElementById('jewelryForm').addEventListener('submit', function(event) {
    // Form submission handling code...
});

function saveData() {
    // Saving data code...
}

function loadSavedData() {
    // Loading saved data code...
}

function sendToWhatsApp(orderId, name, quantity, fine, wastage, total) {
    // Sending data to WhatsApp code...
}


document.getElementById('jewelryForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var name = formData.get('name');
    var quantity = parseFloat(formData.get('quantity'));
    var fine = parseFloat(formData.get('fine'));
    var wastage = parseFloat(formData.get('wastage'));
    
    // Generate unique order ID in a constant format
    var orderId = '#' + ('000' + (document.querySelectorAll('.card').length + 1)).slice(-4);

    // Calculate total amount by multiplying sum by quantity and dividing by 100
    var total = ((fine + wastage) * quantity) / 100;

    var detailsDiv = document.getElementById('details');
    var card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML += '<p>Name:</p><p>' + name + '</p>';
    card.innerHTML += '<p>Order ID:</p><p>' + orderId + '</p>';
    card.innerHTML += '<p>Quantity (gm):</p><p>' + quantity + '</p>';
    card.innerHTML += '<p>Tunch:</p><p>' + fine + '</p>';
    card.innerHTML += '<p>Wastage:</p><p>' + wastage + '</p>';
    card.innerHTML += '<p>Total Fine(gm):</p><p>' + total.toFixed(2) + '</p>';
    var paymentButton = document.createElement('button');
    paymentButton.textContent = 'Payment Done';
    paymentButton.addEventListener('click', function() {
        this.classList.add('green');
        this.style.display = 'none'; // Hide payment button after payment is done
        var tick = document.createElement('span');
        tick.innerHTML = '&#10003;'; // Checkmark symbol
        tick.classList.add('tick');
        card.appendChild(tick);
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Entry';
        deleteButton.classList.add('deleteButton');
        deleteButton.addEventListener('click', function() {
            detailsDiv.removeChild(card);
            saveData();
        });
        card.appendChild(deleteButton);
        sendToWhatsApp(orderId, name, quantity, fine, wastage, total);
        saveData();
    });
    card.appendChild(paymentButton);
    detailsDiv.appendChild(card);
    saveData();
});

function saveData() {
    var cards = document.querySelectorAll('.card');
    var data = [];
    cards.forEach(function(card) {
        var cardData = {
            name: card.querySelector('p:nth-of-type(2)').textContent,
            orderId: card.querySelector('p:nth-of-type(4)').textContent,
            quantity: card.querySelector('p:nth-of-type(6)').textContent,
            Tunch: card.querySelector('p:nth-of-type(8)').textContent,
            wastage: card.querySelector('p:nth-of-type(10)').textContent,
            total: card.querySelector('p:nth-of-type(12)').textContent,
            paymentDone: card.querySelector('.green') !== null
        };
        data.push(cardData);
    });
    localStorage.setItem('jewelryData', JSON.stringify(data));
}

function loadSavedData() {
    var savedData = localStorage.getItem('jewelryData');
    if (savedData) {
        var data = JSON.parse(savedData);
        var detailsDiv = document.getElementById('details');
        data.forEach(function(cardData) {
            var card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML += '<p>Name:</p><p>' + cardData.name + '</p>';
            card.innerHTML += '<p>Order ID:</p><p>' + cardData.orderId + '</p>';
            card.innerHTML += '<p>Quantity (gm):</p><p>' + cardData.quantity + '</p>';
            card.innerHTML += '<p>Tunch:</p><p>' + cardData.fine + '</p>';
            card.innerHTML += '<p>Wastage:</p><p>' + cardData.wastage + '</p>';
            card.innerHTML += '<p>Total Amount:</p><p>' + cardData.total + '</p>';
            if (!cardData.paymentDone) {
                var paymentButton = document.createElement('button');
                paymentButton.textContent = 'Payment Done';
                paymentButton.addEventListener('click', function() {
                    this.classList.add('green');
                    this.style.display = 'none'; // Hide payment button after payment is done
                    var tick = document.createElement('span');
                    tick.innerHTML = '&#10003;'; // Checkmark symbol
                    tick.classList.add('tick');
                    card.appendChild(tick);
                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete Entry';
                    deleteButton.classList.add('deleteButton');
                    deleteButton.addEventListener('click', function() {
                        detailsDiv.removeChild(card);
                        saveData();
                    });
                    card.appendChild(deleteButton);
                    sendToWhatsApp(cardData.orderId, cardData.name, parseFloat(cardData.quantity), parseFloat(cardData.fine), parseFloat(cardData.wastage), parseFloat(cardData.total));
                    saveData();
                });
                card.appendChild(paymentButton);
            } else {
                var tick = document.createElement('span');
                tick.innerHTML = '&#10003;'; // Checkmark symbol
                tick.classList.add('tick');
                card.appendChild(tick);
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Entry';
                deleteButton.classList.add('deleteButton');
                deleteButton.addEventListener('click', function() {
                    detailsDiv.removeChild(card);
                    saveData();
                });
                card.appendChild(deleteButton);
            }
            detailsDiv.appendChild(card);
        });
    }
}

function sendToWhatsApp(orderId, name, quantity, fine, wastage, total) {
    // Constructing the message for the specific card
    var message = "Order Details:\n\n";
    message += "Name: " + name + "\n";
    message += "Order ID: " + orderId + "\n";
    message += "Quantity (gm): " + quantity + "\n";
    message += "Fine: " + fine + "\n";
    message += "Wastage: " + wastage + "\n";
    message += "Total Fine(gm): " + total.toFixed(2) + "\n\n";

    // Constructing WhatsApp message link
    var whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(message);

    // Open WhatsApp with the message
    window.open(whatsappUrl);
}
