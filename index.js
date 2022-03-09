let mapa;
const utld = { lat: 25.50, lng: -103.55 };
const utld1 = { lat: 25.5012087, lng: -103.5512128 }
let pos1 = {lat:null, lng:null};
const icono1 = "https://img.icons8.com/fluency/50/000000/map-pin.png";
var datos = {lat:null, lng:null};
var datosdb = {lat:null, lng:null, nombre:null, lugar:null}

document.getElementById("login").addEventListener("click",logingoogle)
document.getElementById("logout").addEventListener("click", Deslogingoogle)

const firebaseConfig = {
    apiKey: "AIzaSyB2MSVBIOe6LHMUv3Z60BI-r7xDMy67U1Q",
    authDomain: "mapota-94a9e.firebaseapp.com",
    databaseURL: "https://mapota-94a9e-default-rtdb.firebaseio.com",
    projectId: "mapota-94a9e",
    storageBucket: "mapota-94a9e.appspot.com",
    messagingSenderId: "483399627152",
    appId: "1:483399627152:web:c372aa28b4e1e49dc5c315",
    measurementId: "G-HS5E4MQ17L"
};
firebase.initializeApp(firebaseConfig);

revisa();
function revisa() {
    firebase.auth().onAuthStateChanged(function (user){
        if (user){
            var usuario = user;
            llenadivs(usuario);
        }
        else{
            document.getElementById('imagen').innerHTML = "";
            document.getElementById('nombre').innerHTML = "";
        }
    })
}
function llenadivs(x1) {
    document.getElementById('imagen').innerHTML = "<img src =" +x1.photoURL + ">";
    document.getElementById('nobre').innerHTML = "<p>Bienvenido: " + x1.displayName + "</p>";

}
function logingoogle() {
    var proveedor = new firebase.auth.GoogleAuthProvider();
    firebase.auth().singInWithPopUp(proveedor)
        .then(function (result){
            var usuario = result.user;
            var token = result.credential.accessToken;
            llenadivs(usuario)
        }).catch(function (error){
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
    })

}
function Deslogingoogle() {
    firebase.auth().singOut().then(function () {
        console.log("Session ended");
    }).catch(function (error) {
        console.log("Something unexpected happened");
    })
    
}
function autentica(onAuthSuccess) {
    firebase.auth().singInAnonymously.catch(function (error) {
        console.log(error.code + ',' + error.message)
    }, {remember: 'sessionOnly'});
    onAuthSuccess();
}
function initMap() {
    mapa = new google.maps.Map(document.getElementById("map"), {
        center: utld,
        zoom: 15,
        disableDoubleClickZoom: true,
    });
    var rpdb = firebase.database().ref('clicks');
    rpdb.on('child_added',
        function(snapshot){
            var snapposiciones = snapshot.val();
            x1 = snapposiciones.nombre;
            x2 = snapposiciones.lugar;
            var pos2 = new google.maps.LatLng(snapposiciones.lat, snapposiciones.lng);
            //console.log(pos2);
            agregapin(pos2, x1, x2);
        });//firebase

    mapa.addListener('click', function (e) {
        console.log(e);
        pos1.lat = e.latLng.lat();
        pos1.lng = e.latLng.lng();
        agregapin(pos1);//aparecen de nuevo
        var n1 = document.getElementById("name").value;
        var l1 = document.getElementById("location").value;
        datosdb.lat = e.latLng.lat();
        datosdb.lng = e.latLng.lng();
        datosdb.nombre = n1;
        datosdb.lugar = l1;
        agregarDB(datosdb);
    })

    function agregarDB(datos) {
        var fb1 = firebase.database().ref("pins").push(datos, function (error) {
            if (error) {
                //console.log(error)
            }
        })
    }
    function agregapin(posicion, val1, val2) {
        const pin1 = new google.maps.Marker({
            position: posicion,
            title:('Ping de: ' + nombreValue),
            map: mapa,
            icon: icono1,
            label: val1 + " " + val2

        })
        const infowindow = new google.maps.InfoWindow({
            content: ('Description: ') +descripcion,
        });
        pin1.addListener('click', ()=>{
            infowindow.open({
                anchor: pin1,
                map: mapa,
                shouldFocus: false,
            });
        });
    }
}
