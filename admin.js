// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDRCikmAmHNQvyD4Mk6Q6izTwmAK41CxuQ",
    authDomain: "arranchamento-2bec.firebaseapp.com",
    databaseURL: "https://arranchamento-2bec-default-rtdb.firebaseio.com",
    projectId: "arranchamento-2bec",
    storageBucket: "arranchamento-2bec.firebasestorage.app",
    messagingSenderId: "358113980416",
    appId: "1:358113980416:web:5782e6e35198116360e8e5",
    measurementId: "G-415P8ZB55G"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function exibirArranchamentos() {
    try {
        const tabelaBody = document.getElementById('tabela-arrachamentos-body');

        if (!tabelaBody) {
            console.error('Elemento tabela-arrachamentos-body não encontrado no DOM.');
            return;
        }

        const dbRef = ref(db, 'arrachamentos/');
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
            alert('Nenhum arranchamento encontrado.');
            return;
        }

        const arranchamentos = snapshot.val();
        tabelaBody.innerHTML = ''; // Limpa a tabela antes de preenchê-la

        Object.keys(arranchamentos).forEach(nomeGuerra => {
            const dados = arranchamentos[nomeGuerra];
            const dias = dados?.dias || {};

            Object.keys(dias).forEach(data => {
                const refeicoes = dias[data];
                const refeicoesTexto = refeicoes.join(', ');

                const linha = document.createElement('tr');
                const colunaNome = document.createElement('td');
                const colunaData = document.createElement('td');
                const colunaRefeicoes = document.createElement('td');

                colunaNome.textContent = nomeGuerra;
                colunaData.textContent = data;
                colunaRefeicoes.textContent = refeicoesTexto;

                linha.appendChild(colunaNome);
                linha.appendChild(colunaData);
                linha.appendChild(colunaRefeicoes);

                tabelaBody.appendChild(linha);
            });
        });

        console.log('Dados carregados:', arranchamentos);
    } catch (error) {
        console.error('Erro ao carregar arranchamentos:', error);
        alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
    }
}

// Função para filtrar a tabela
function filtrarTabela() {
    const filtroNome = document.getElementById('filtro-nome').value.toLowerCase();
    const filtroData = document.getElementById('filtro-data').value.toLowerCase();
    const filtroRefeicoes = document.getElementById('filtro-refeicoes').value.toLowerCase();

    const tabelaBody = document.getElementById('tabela-arrachamentos-body');
    const linhas = tabelaBody.getElementsByTagName('tr');

    Array.from(linhas).forEach(linha => {
        const colunaNome = linha.cells[0]?.textContent.toLowerCase() || '';
        const colunaData = linha.cells[1]?.textContent.toLowerCase() || '';
        const colunaRefeicoes = linha.cells[2]?.textContent.toLowerCase() || '';

        const correspondeNome = colunaNome.includes(filtroNome);
        const correspondeData = colunaData.includes(filtroData);
        const correspondeRefeicoes = colunaRefeicoes.includes(filtroRefeicoes);

        if (correspondeNome && correspondeData && correspondeRefeicoes) {
            linha.style.display = ''; // Mostra a linha
        } else {
            linha.style.display = 'none'; // Oculta a linha
        }
    });
}

// Adiciona os event listeners para os inputs
document.getElementById('filtro-nome').addEventListener('input', filtrarTabela);
document.getElementById('filtro-data').addEventListener('input', filtrarTabela);
document.getElementById('filtro-refeicoes').addEventListener('input', filtrarTabela);

document.addEventListener('DOMContentLoaded', () => {
    exibirArranchamentos(); // Chama a função após o DOM estar carregado
});
