$(document).ready(function () {
    lancamentos = [];
});

function addLancamento() {
    
    /* obtém array do storage */
    var memoria =JSON.parse(localStorage.getItem('lancamentos'));
    if (memoria != null)
        lancamentos =memoria;

    /* verifica se lançamento ativo está no storage: em caso positivo, significa que lcto está sendo editado. */
    memoria =JSON.parse(localStorage.getItem('lancamentoativo'));
    var codigoativo =0;
    if (memoria != null)
        codigoativo =memoria.codigo;
    
    /* objeto lançamento */
    var lancamento = {
        'data': $('#InputData').val(),
        'descricao': $('#InputDescricao').val(),
        'valor': $('#InputValor').val()
    };

    /* determina código do lançamento: se será o código do que está sendo editado ou um novo. */
    if (codigoativo >0) {
        lancamento.codigo =codigoativo;
    } else {
        lancamento.codigo =nextCodigo();
    }

    /* caso esteja editando lançamento, remove objeto com conteúdo anterior do array */
    if (codigoativo >0) {
        lancamentos.forEach(function(e) {
            if (e.codigo === codigoativo) {
              item =e;
              return;
            }	
        });
    
        var indice =lancamentos.indexOf(item);
    
        lancamentos.splice(indice,1);
    }

    /* insere lançamento no array */
    lancamentos.push(lancamento);
    
    /* armazena array no storage */
    localStorage.setItem('lancamentos', JSON.stringify(lancamentos));

    /* exibe extrato em tela */
    showExtrato();

    /* remove lançamento ativo do storage */
    localStorage.removeItem('lancamentoativo');
};

function showExtrato(ordOption) {
    let htmlextrato = ' ';
    var saldo = 0;

    /* ordenação padrão: por código */
    if (ordOption ==null)
        ordOption =2;

    /* cabeçalho da tabela */
    htmlextrato = '<thead>'
                +     '<tr>'
                +        '<th scope="col"><button type="submit" class="btn btn-sm btn-block btn-outline-success" onclick="ordData()">Data</button></th>'
                +        '<th scope="col"><button type="submit" class="btn btn-sm btn-block btn-outline-success" onclick="ordCodigo()">Código</button></th>'
                +        '<th scope="col">Descrição</th>'
                +        '<th scope="col">Valor</th>'
                +        '<th scope="col">Saldo</th>'
                +        '<th scope="col">Editar</th>'
                +        '<th scope="col">Remover</th>'
                +     '</tr>'
                + '</thead>'
                + '<tbody>';
    
    
    /* conteúdo da tabela */
    var memoria =JSON.parse(localStorage.getItem('lancamentos'));
    if(memoria != null) {
        lancamentos =memoria;

        /* opção ordenação == 1 == data;
                 ordenação == 2 == código; */
        if (ordOption ==1){
            var ordena = function(a,b){
                if (a.data <b.data)
                    return -1;
                else if (a.data >b.data)
                    return 1;
                else
                    return 0;
            }
        } else {
            var ordena = function(a,b){
                if (a.codigo <b.codigo)
                    return -1;
                else if (a.codigo >b.codigo)
                    return 1;
                else
                    return 0;
            }
        }

        /* ordena lançamentos */
        lancamentos.sort(ordena);

        /* exibe lançamentos */
        lancamentos.forEach(function(lancamento){
            saldo += parseFloat(lancamento.valor);
    
            /* corpo da tabela */
            htmlextrato += '<tr>'
                        + '<td class="dataLcto">' + lancamento.data + '</td>'
                        + '<td class="codigoLcto">' + lancamento.codigo + '</td>'
                        + '<td class="descLcto">' + lancamento.descricao + '</td>'
                        + '<td' + (lancamento.valor <0?' class="negativo"':'') + '>' + decimal(lancamento.valor) + '</td>'
                        + '<td' + (saldo<0?' class="negativo"':'') + '>' + decimal(saldo) + '</td>'
                        + '<td>' + '<button type="submit" class="btn btn-sm btn-block btn-info" onclick="editarLcto(' + lancamento.codigo + ')">Editar</button>' + '</td>'
                        + '<td>' + '<button type="submit" class="btn btn-sm btn-block btn-danger" onclick="removerLcto(' + lancamento.codigo + ')">Remover</button>' + '</td>'
                        + '</tr>';
    
        });
    }

    /* fechamento da tabela */
    htmlextrato += '</tbody>';

    $('#extrato').html(htmlextrato);
};

function clearExtrato() {
    lancamentos = [];
    localStorage.clear();
    showExtrato();
};

function nextCodigo() {
    memoria =localStorage.getItem('ultimocodigo');

    if (memoria != null) {
        codigo =parseInt(memoria)+1;
    } else{
        codigo =1;
    }

    localStorage.setItem('ultimocodigo',codigo);

    return codigo;
};

function ordData() {
    ordOption =1;
    showExtrato(ordOption);
};

function ordCodigo() {
    ordOption =2;
    showExtrato(ordOption);
};

function removerLcto(remcod) {
    var item;

    /* obtém array do storage */
    var memoria =JSON.parse(localStorage.getItem('lancamentos'));

    if (memoria != null)
        lancamentos =memoria;
 
    /* obtém objeto do array que corresponde à linha onde o botão foi clicado */
    lancamentos.forEach(function(e) {
        if (e.codigo === remcod) {
          item =e;
          return;
        }	
    });

    /* obtém índice do objeto do array que corresponde à linha onde o botão foi clicado */
    var indice =lancamentos.indexOf(item);

    /* remove objeto do array */
    lancamentos.splice(indice,1);

    /* armazena novo array no storage */
    localStorage.setItem('lancamentos', JSON.stringify(lancamentos));

    /* exibe extrato em tela */
    showExtrato();
}

function editarLcto(edtcod) {
    var item;
    
    /* obtém array do storage */
    var memoria =JSON.parse(localStorage.getItem('lancamentos'));
    if (memoria != null)
        lancamentos =memoria;

    /* obtém objeto do array que corresponde à linha onde o botão foi clicado */
    lancamentos.forEach(function(e) {
        if (e.codigo === edtcod) {
          item =e;
          return;
        }	
    });
    
    /* disponibiliza dados na tela para edição pelo usuário */
    $('#InputData').val(item.data);
    $('#InputDescricao').val(item.descricao);
    $('#InputValor').val(item.valor);

    /* grava objeto no storage para controle de item sendo inserido ou sendo editado */
    localStorage.setItem('lancamentoativo', JSON.stringify(item));
}

function decimal(value) {
    if (value) {
        return parseFloat(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    return '0,00';
}