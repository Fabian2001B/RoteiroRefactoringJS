const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
    // Função query
    function getPeca(apresentacao) {
        return pecas[apresentacao.id];
    }

    // Calcula o total de uma apresentação
    function calcularTotalApresentacao(apre) {
        let total = 0;
        switch (getPeca(apre).tipo) {
            case "tragedia":
                total = 40000;
                if (apre.audiencia > 30) {
                    total += 1000 * (apre.audiencia - 30);
                }
                break;
            case "comedia":
                total = 30000;
                if (apre.audiencia > 20) {
                    total += 10000 + 500 * (apre.audiencia - 20);
                }
                total += 300 * apre.audiencia;
                break;
            default:
                throw new Error(`Peça desconhecida: ${getPeca(apre).tipo}`);
        }
        return total;
    }

    // Calcula os créditos de uma apresentação
    function calcularCredito(apre) {
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (getPeca(apre).tipo === "comedia")
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    // Formata valor monetário
    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR",
            { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valor / 100);
    }

    // Calcula o total da fatura somando todas apresentações
    function calcularTotalFatura() {
        let total = 0;
        for (let apre of fatura.apresentacoes) {
            total += calcularTotalApresentacao(apre);
        }
        return total;
    }

    // Calcula o total de créditos somando todas apresentações
    function calcularTotalCreditos() {
        let total = 0;
        for (let apre of fatura.apresentacoes) {
            total += calcularCredito(apre);
        }
        return total;
    }

    // Corpo principal simplificado
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura())}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos()} \n`;
    return faturaStr;
}

// Leitura dos arquivos JSON
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Geração da fatura
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
