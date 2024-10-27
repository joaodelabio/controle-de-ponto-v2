document.addEventListener("DOMContentLoaded", function () {
    const reportContainer = document.getElementById("report-container");

    function renderReport() {
        const registers = JSON.parse(localStorage.getItem("register")) || [];
        reportContainer.innerHTML = "";

        registers.forEach((register, index) => {
            const registerElement = document.createElement("div");
            registerElement.classList.add("register");

            registerElement.innerHTML = `
                <p>Data: ${register.date} | Hora: ${register.time} | Tipo: ${register.type}</p>
                <p>Observação: ${register.observacao}</p>
                <button onclick="editRegister(${index})">Editar</button>
                <button onclick="alert('Exclusão não permitida')">Excluir</button>
            `;

            reportContainer.appendChild(registerElement);
        });
    }

    window.editRegister = function (index) {
        const registers = JSON.parse(localStorage.getItem("register"));
        const register = registers[index];
        const newObservacao = prompt("Digite a nova observação:", register.observacao);

        if (newObservacao !== null) {
            register.observacao = newObservacao;
            registers[index] = register;
            localStorage.setItem("register", JSON.stringify(registers));
            renderReport();
        }
    };

    renderReport();
});
