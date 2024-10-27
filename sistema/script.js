const date = new Date();
const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
const dataEscolhida = document.getElementById("data-escolhida");

btnRegistrarPonto.addEventListener("click", register);

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrentDate();

const dialogPonto = document.getElementById("dialog-ponto");

const dialogData = document.getElementById("dialog-data");
dialogData.textContent = "Data: " + getCurrentDate();

const dialogHora = document.getElementById("dialog-hora");

//dialogHora.textContent = getCurrentTime();

const selectRegisterType = document.getElementById("register-type");

function setRegisterType() {
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));
    
    if (lastRegister) {
        const lastType = lastRegister.type;
        
        switch(lastType) {
            case "entrada":
                selectRegisterType.value = "intervalo";
                break;
            case "intervalo":
                selectRegisterType.value = "volta-intervalo";
                break;
            case "volta-intervalo":
                selectRegisterType.value = "saida";
                break;
            case "saida":
                selectRegisterType.value = "entrada";
                break;
            default:
                selectRegisterType.value = "entrada";
        }
    } else {
        selectRegisterType.value = "entrada";
    }
}

const btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async () => {

    let register = await getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);

    localStorage.setItem("lastRegister", JSON.stringify(register));

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setInterval(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    dialogPonto.close();
});

function isDateInThePast(date) {
    const [day, month, year] = date.split("/");
    const registroDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    
    registroDate.setHours(0, 0, 0, 0); // zerar as horas, para que ele compare apenas a data. caso contrário, a função sempre
    currentDate.setHours(0, 0, 0, 0);  //  retornará true quando for verificar se a data de entrada estiver no passado.

    return registroDate < currentDate;
}

function formatoData(dateInput) {
    const [year, month, day] = dateInput.split("-");
    return `${day}/${month}/${year}`;
}

async function getObjectRegister(registerType) {

    const location = await getUserLocation();
    const dataRegistro = dataEscolhida.value ? formatoData(dataEscolhida.value) : getCurrentDate();
    const pastDate = isDateInThePast(dataRegistro);

    console.log(location);

    ponto = {
        "date": dataRegistro,
        "time": getCurrentTime(),
        "location": location,
        "id": 1,
        "type": registerType,
        "pastDate": pastDate
    }
    return ponto;
}

function renderReport() {
    const reportContainer = document.getElementById("report-container");
    const registers = getRegisterLocalStorage("register");

    reportContainer.innerHTML = "";

    registers.forEach(register => {
        const registerElement = document.createElement("div");
        registerElement.classList.add("register");

        if (register.isPastDate) {
            registerElement.classList.add("past-date");
        }

        registerElement.textContent = `Data: ${register.date} | Hora: ${register.time} | Tipo: ${register.type}`;
        reportContainer.appendChild(registerElement);
    });
}

const fecharDialog = document.getElementById("dialog-fechar");
fecharDialog.addEventListener("click", () => {
    dialogPonto.close();
})

const registersLocalStorage = getRegisterLocalStorage("register");

function saveRegisterLocalStorage(register) {

    registersLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registersLocalStorage));
}

function getRegisterLocalStorage(key) {
    
    let registers = localStorage.getItem(key);

    if(!registers) {
        return [];
    }

    return JSON.parse(registers);
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        }, 
        (error) => {
            reject("Erro " + error);
        });
    });
}

function register() {

    setRegisterType();

    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if (lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Ultimo registro: " + lastDateRegister + " | " + lastTimeRegister + " | " + lastRegisterType;
    }
    dialogHora.textContent = "Hora: " + getCurrentTime();

    let interval = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentTime();
    }, 1000);

    console.log(interval);

    const dataRegistro = dataEscolhida.value ? dataEscolhida.value : getCurrentDate();
    dialogData.textContent = "Data: " + dataRegistro;
    dialogPonto.showModal();
}

function updateContentHour() {
    horaAtual.textContent = getCurrentTime();
}

function getCurrentTime() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function getCurrentDate() {
    const date = new Date();
    return String(date.getDate()).padStart(2, '0') + "/" + String((date.getMonth() + 1)).padStart(2, '0') + "/" + date.getFullYear();
}

function getWeekDay() {
    const weekday = ["Domingo-feira", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado-feira"];
    return weekday[date.getDay()];
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getWeekDay());
console.log(getCurrentDate());
console.log(getCurrentTime());