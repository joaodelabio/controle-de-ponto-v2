document.addEventListener("DOMContentLoaded", function () {
    const diaSemana = document.getElementById("dia-semana");
    const dataAtual = document.getElementById("data-atual");
    const horaAtual = document.getElementById("hora-atual");
    const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
    const dataEscolhida = document.getElementById("data-escolhida");
    const selectRegisterType = document.getElementById("register-type");
    const alertaSucesso = document.getElementById("alerta-ponto-registrado");

    diaSemana.textContent = getWeekDay();
    dataAtual.textContent = getCurrentDate();
    updateContentHour();

    setInterval(updateContentHour, 1000); // Atualiza a hora a cada segundo

    btnRegistrarPonto.addEventListener("click", openDialog);

    document.getElementById("btn-dialog-register").addEventListener("click", async () => {
        const register = await getObjectRegister(selectRegisterType.value);
        if (register) {  // Se o registro não for nulo
            saveRegisterLocalStorage(register);
            showSuccessAlert();
            closeDialog();
            renderReport();  // Atualizar o relatório após salvar
        }
    });

    document.getElementById("dialog-fechar").addEventListener("click", closeDialog);

    function openDialog() {
        const dialogPonto = document.getElementById("dialog-ponto");
        const dialogData = document.getElementById("dialog-data");
        dialogData.textContent = "Data: " + getCurrentDate();
        dialogPonto.showModal();
    }

    function closeDialog() {
        const dialogPonto = document.getElementById("dialog-ponto");
        dialogPonto.close();
    }

    function showSuccessAlert() {
        alertaSucesso.classList.remove("hidden");
        alertaSucesso.classList.add("show");
        setTimeout(() => {
            alertaSucesso.classList.remove("show");
            alertaSucesso.classList.add("hidden");
        }, 5000);
    }

    function setRegisterType() {
        let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

        if (lastRegister) {
            switch (lastRegister.type) {
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

    function saveRegisterLocalStorage(register) {
        let registers = JSON.parse(localStorage.getItem("register")) || [];
        registers.push(register);
        localStorage.setItem("register", JSON.stringify(registers));
        localStorage.setItem("lastRegister", JSON.stringify(register));
    }

    async function getObjectRegister(registerType) {
        const dataRegistro = dataEscolhida.value || getCurrentDate();
        const isFutureDate = checkIfFutureDate(dataRegistro);

        if (isFutureDate) {
            alert("Não é permitido registrar pontos em datas futuras.");
            return null;
        }

        const justificativa = document.getElementById("justificativa-ausencia").value;
        const arquivo = document.getElementById("upload-arquivo").files[0]?.name || "";
        const observacao = document.getElementById("observacao").value;

        return {
            date: dataRegistro,
            time: getCurrentTime(),
            type: registerType,
            justificativa,
            arquivo,
            observacao,
        };
    }

    function checkIfFutureDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);  // Zera as horas para comparar apenas a data
        return selectedDate > today;
    }

    function renderReport() {
        const reportContainer = document.getElementById("report-container");
        reportContainer.innerHTML = "";  // Limpa o relatório antes de renderizar novamente

        const registers = JSON.parse(localStorage.getItem("register")) || [];

        registers.forEach(register => {
            const registerElement = document.createElement("div");
            registerElement.classList.add("register");
            registerElement.textContent = `Data: ${register.date} | Hora: ${register.time} | Tipo: ${register.type} | Observação: ${register.observacao}`;
            reportContainer.appendChild(registerElement);
        });
    }

    function updateContentHour() {
        horaAtual.textContent = getCurrentTime();
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString("pt-BR");
    }

    function getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString("pt-BR");
    }

    function getWeekDay() {
        const weekday = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        return weekday[new Date().getDay()];
    }

    renderReport();
});
