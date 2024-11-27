document.addEventListener("DOMContentLoaded", () => {
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const diasContainer = document.getElementById("dias-semana");
    const periodosContainer = document.getElementById("periodos-container");
    const previewLista = document.getElementById("lista-preview");
    const nomeGuerraInput = document.getElementById("nome-guerra");
    const enviarButton = document.getElementById("enviar");

    // Objeto para armazenar as seleções de cada dia
    const selecoes = {};

    // Obter a data atual e calcular os próximos dias até domingo
    const hoje = new Date();
    const diaAtual = hoje.getDay(); // Dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
    const diasRestantes = diaAtual === 0 ? 0 : 8 - diaAtual; // Inclui o domingo, mesmo se hoje for domingo
    const semana = Array.from({ length: diasRestantes }, (_, i) => {
        const dia = new Date(hoje);
        dia.setDate(hoje.getDate() + i);
        return {
            nome: diasSemana[dia.getDay()], // Nome do dia da semana
            data: dia.toISOString().split("T")[0], // Formato YYYY-MM-DD
            display: dia.toLocaleDateString("pt-BR", { day: "numeric", month: "numeric" }) // Formato DD/MM
        };
    });

    // Renderizar os botões dos dias
    semana.forEach(({ nome, data, display }, index) => {
        const button = document.createElement("button");
        button.textContent = `${nome} (${display})`;
        button.dataset.data = data;
        if (index === 0) button.classList.add("active");
        button.addEventListener("click", () => selecionarDia(button));
        diasContainer.appendChild(button);

        // Inicializar seleções para cada dia
        selecoes[data] = [];
    });

    // Monitorar Nome de Guerra
    nomeGuerraInput.addEventListener("input", () => {
        enviarButton.disabled = nomeGuerraInput.value.trim() === "";
    });

    atualizarPeriodos(semana[0].data);

    function selecionarDia(button) {
        salvarSelecoes(document.querySelector("#dias-semana button.active").dataset.data);
        document.querySelectorAll("#dias-semana button").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        atualizarPeriodos(button.dataset.data);
    }

    function atualizarPeriodos(data) {
        periodosContainer.innerHTML = "";
        const periodos = ["Café da Manhã", "Almoço", "Janta", "Ceia"];
        periodos.forEach(periodo => {
            const label = document.createElement("label");
            label.innerHTML = `
                <input type="checkbox" data-data="${data}" value="${periodo}" ${
                selecoes[data].includes(periodo) ? "checked" : ""
            }>
                ${periodo}
            `;
            label.querySelector("input").addEventListener("change", atualizarPrevia);
            periodosContainer.appendChild(label);
        });
    }

    function salvarSelecoes(data) {
        const checkboxes = periodosContainer.querySelectorAll("input:checked");
        selecoes[data] = Array.from(checkboxes).map(checkbox => checkbox.value);
    }

    function atualizarPrevia() {
        salvarSelecoes(document.querySelector("#dias-semana button.active").dataset.data);
        previewLista.innerHTML = "";
        Object.keys(selecoes).forEach(data => {
            if (selecoes[data].length > 0) {
                const li = document.createElement("li");
                li.textContent = `${data}: ${selecoes[data].join(", ")}`;
                previewLista.appendChild(li);
            }
        });
    }

    enviarButton.addEventListener("click", () => {
        const nomeGuerra = nomeGuerraInput.value.trim();
        if (!nomeGuerra) {
            alert("Por favor, preencha o Nome de Guerra.");
            return;
        }
        alert(`Dados enviados:\nNome de Guerra: ${nomeGuerra}\nSeleções: ${JSON.stringify(selecoes, null, 2)}`);
    });
});