var currentUser = firebase.auth().currentUser;
let registerUsers = [];
let users = {};
let totalUsers = 0;
let COrders = [];
let orders = {};
let totalOrders = 0;
let CItems = [];
let items = {};
let totalItems = 0;

if(currentUser !== null){
    $("#firebaseui-auth-container").hide();
}

firebase.database().ref().child('users').on('value', snap => {
    users = snap.val();
    totalUsers = Object.keys(users).length;
    $("#users").text(totalUsers);
    for(let user in users) {
        registerUsers.push(users[user]);
    }
    populateUsers()
});

firebase.database().ref().child('gigs').on('value', snap => {
    items = snap.val();
    totalItems = Object.keys(items).length;
    $("#items").text(totalItems);
    for(let item in items) {
        CItems.push(items[item]);
    }
    populateItems()
});

firebase.database().ref().child('orders').on('value', snap => {
    orders = snap.val();
    totalOrders = Object.keys(orders).length;
    $("#orders").text(totalOrders);
    for(let order in orders) {
        COrders.push(orders[order]);
    }
    populateOrders()
    $.loadingBlockHide// Hide loading overlay
});


function populateUsers() {
    let tbody = $("#tbody-users");
    tbody.text("");
    for(let i=totalUsers-1; i>=0; i--){
        let user = registerUsers[i];
        let status = "";
        if (user.isBuyer) {
            status = '<button class="btn btn-primary" onclick="switchProfile(\''+user.id+'\', '+false+')\">Seller</button>';
        } else {
            status = '<button class="btn btn-success" onclick="switchProfile(\''+user.id+'\', '+true+')\">Buyer</button>';
        }
        let row = "<tr>"+
        "<th scope='row'>"+(1+ parseInt(i))+"</th>"+
        "<td>"+user.name+"</td>"+
        "<td>"+user.phoneNumber+"</td>"+
        "<td>"+user.location+"</td>"+
        "<td>"+user.email+"</td>"+
        "<td>"+status+"</td>"+
        "</tr>";
        tbody.append(row)
    }
}

function populateOrders() {
    let tbody = $("#tbody-orders");
    tbody.text("");
    for(let i=totalOrders-1; i>=0; i--){
        let order = COrders[i];
        let row = "<tr>"+
        "<th scope='row'>"+(1+ parseInt(i))+"</th>"+
        "<td>"+items[order.gigId].name+"</td>"+
        "<td>"+users[order.client]['name']+"</td>"+
        "<td>"+users[order.seller]['name']+"</td>"+
        "<td>"+order.location+"</td>"+
        "<td>"+order.qty+"</td>"+
        "<td>"+order.total+"</td>"+
        "<td>"+order.status+"</td>"+
        "</tr>";
        tbody.append(row)
    }
}

function populateItems() {
    let tbody = $("#tbody-items");
    tbody.text("");
    for(let i=totalItems-1; i>=0; i--){
        let item = CItems[i];
        let row = "<tr>"+
        "<th scope='row'>"+(1+ parseInt(i))+"</th>"+
        "<td>"+item.name+"</td>"+
        "<td>"+users[item.sellerId].name+"</td>"+
        "<td>"+item.unit+"</td>"+
        "<td>"+item.price+"</td>"+
        "</tr>";
        tbody.append(row)
    }
}

function switchProfile(id, status) {
    console.log(id, status);
    firebase.database().ref().child('users').child(id).child("isBuyer").setValue(status);
}