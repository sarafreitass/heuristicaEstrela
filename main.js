/*
  Funções para o calculo do Heuristica:
  - euclidianDistance: Heuristica correta, calcula a distancia euclidiana
  - wrongDistance: Heuristica errada, calcula a distancia euclidiana, só que sem tirar a raiz da soma
*/
function euclidianDistance(x1, y1, x2, y2) {
  // raiz( (x1 - x2)² + (y1 - y2)² )
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function wrongDistance(x1, y1, x2, y2) {
  // ((x1 - x2)² + (y1 - y2)²)²
  return Math.pow(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2), 2);
}

//logica heuristica, precisa adicionar onclick, name e value certinhos no html do botao e dps atualizar a variavel na funcao que seleciona a heuristica
var heuristica = true; // Variável inicial

function selectHeuristica(valor) {
  heuristica = valor; // Atualiza o valor da variável
}
/* ------------------------------------------------------------------------ */

/*
  Funções de apoio utilizadas no projeto
  - randInt: retorna um numero aleatorio no intervalo [min, max[ => Se pa vai tirar dps, usei so pra gerar a turbulencia
  - sortList: faz o bubbleSort de um array, no nosso caso ordena baseado no custoCalculado dos objetos
  - atualizarListaAbertos e atualizarListaFechados: funções para mostrar as listas de abertos e fechados na tela
*/

function randInt(min, max) {
  return Math.floor((Math.random() * (max - min)) + min)
}

function sortList(array) {
  const len = array.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (array[j].custoCalculado > array[j + 1].custoCalculado) {
        const aux = array[j];
        array[j] = array[j + 1];
        array[j + 1] = aux;
      }
    }
  }
}

/*function atualizarListaAbertos() {
  var listaAbertos = document.getElementById("listaAbertos"); 
  listaAbertos.innerHTML = "";
  for (var i = 0; i < listaDeNos.length; i++) {
    var liElemento = document.createElement("li");
    liElemento.textContent = listaDeNos[i].nome;
    listaAbertos.appendChild(liElemento); 
  }
}

function atualizarListaFechados() {
  var listaFechados = document.getElementById("listaFechados"); 
  listaFechados.innerHTML = ""; 
  for (var i = 0; i < listaDeNos.length; i++) {
    var liElemento = document.createElement("li");
    liElemento.textContent = listaDeNos[i].nome;
    listaFechados.appendChild(liElemento); 
  }
}*/

/* ------------------------------------------------------------------------ */

/*
  * Classe No
  
  * Atributos:
    - nome: Nome utilizado para identificar o No
    - x: coordenada x
    - y: coordenada y
    - heuristica: Valor calculado em tempo de execução utilizando uma das heuristicas escolhidas
    - custoAcumulado: Valor calculado em tempo de execução, soma dos custos reais até o nó
    - custoCalculado: Valor calculado em tempo de execução, custoAcumulado + heuristica
    - adjacentes: Lista com os nós adjacentes 

  * Metodos:
    - addAdjacencia(adjacencia)
      - Da um push da adjacencia na lista de nós adjacentes a um determinado nó escolhido
*/
class No {
  constructor(nome, x, y, adjacentes = [], heuristica = 0) {
    this.nome = nome;
    this.x = x;
    this.y = y;
    this.heuristica = heuristica;
    this.custoAcumulado = null;
    this.custoCalculado = null;
    this.adjacentes = adjacentes;
  }

  addAdjacencia(adjacencia) {
    adjacencia.custo = euclidianDistance(this.x, this.y, adjacencia.prox.x, adjacencia.prox.y);
    this.adjacentes.push(adjacencia);
  }

  criacao() {
    // Desenhar o círculo
    fill("#ff483f");
    stroke(0);
    circle(this.x, this.y, 10);

    // Definir a palavra e seu estilo
    let palavra = this.nome;
    textAlign(CENTER, BOTTOM);
    textSize(12);
    fill(0);

    // Posicionar a palavra no centro do círculo
    text(palavra, this.x, this.y);
  }

  desenhaAdjacentes() {
    this.adjacentes.forEach(element => {
      stroke(0);
      line(this.x, this.y, element.prox.x, element.prox.y);
    });
  }
}
/* ------------------------------------------------------------------------------------------------------ */

/*
  * Classe Adjacencia
  
  * Atributos:
    - prox: Referencia para o proximo nó
    - turbulencia: Custo da turbulencia entre os nos
    - custo: Custo real entre os nos
*/
class Adjacencia {
  constructor(prox, turbulencia = randInt(0, 3), custo = null) {
    this.prox = prox;
    this.turbulencia = turbulencia;
    this.custo = custo;
  }
}

/* ------------------------------------------------------------------------------------ */

/*
  * Classe Grafo
    - Principal classe do projeto
    - Contem o algoritmo A*
  
  * Atributos:
    - nos: lista com todos os nos pertencentes ao grafo
    - h: função heuristica utilizada

  * Metodos:
    - addNo(no):
      - Adiciona um nó a lista de nos do grafo
      
    - calculaHeuristicas(destino):
      - Calcula a heuristica de cada no ate o destino

    - aStar(inicio, destino):
      - Algoritmo a* em si
      - Funcionamento descrito no código
*/
class Grafo {
  constructor(heuristicaCorreta) {
    this.nos = [];
    this.h = heuristicaCorreta ? euclidianDistance : wrongDistance;
    this.historico = {
      abertos: [],
      fechados: []
    }
  }

  addNo(no) {
    this.nos.push(no)
  }

  calculaHeuristicas(destino) {
    this.nos.forEach(no => {
      no.heuristica = this.h(no.x, no.y, destino.x, destino.y);
    })
  }

  updateHistorico(abertos, fechados) {
    let aux = abertos.map(x => x);
    this.historico.abertos.push(aux);
    aux = fechados.map(x => x);
    this.historico.fechados.push(aux);
  }

  // Algoritmo A*
  aStar(inicio, destino) {
    // Criando lista de nos abertos e fechados
    let abertos = [];
    let fechados = [inicio];
    this.updateHistorico(abertos, fechados);
    // Index: valor a ser iterado no while, ultimo indice da lista de nos fechados
    let index = fechados.length - 1;

    // Inicializando o nó inicial com custo acumulado igual à 0
    fechados[0].custoAcumulado = 0;

    // Calcular a heuristica de todos os nós
    this.calculaHeuristicas(destino);

    // Repetir ate o nó escolhido ser o ultimo no da lista de fechados
    // Ou iterar y vezes (so pra n loopar infinitamente)
    while (fechados[index].nome !== destino.nome && index < 10000) {

      // Colocar na lista de nós abertos os nós adjacentes
      fechados[index].adjacentes.forEach(adj => {
        // Se Existir um elemento com mesmo nome na lista de nós fechados, não add ele na de abertos
        if (fechados.some((el) => el.nome === adj.prox.nome)) {
          console.warn(`Elemento '${adj.prox.nome}' já visitado!\nAbrindo proximo elemento!`)
        } else {
          // Clona o nó, porque se não você vai alterar os dados diretamente no nó raiz salvo no grafo
          let aux = new No(adj.prox.nome, adj.prox.x, adj.prox.y, adj.prox.adjacentes, adj.prox.heuristica);
          // Add na lista de nos abertos
          abertos.push(aux);
          console.log(`Adcionando ${adj.prox.nome} a lista de abertos`)
          //atualizarListaAbertos()
        }
      });

      // Calcular o Custo
      abertos.forEach(no => {
        // Se não foi calculado o custo, calculamos ele
        if (no.custoCalculado === null) {
          // Adjacencia = {prox, turbulencia, custo}
          // Procurar na lista de nós adjacentes do nó anterior (ultimo nó fechado)
          // Pega os dados adjacentes desse nó
          let adjData = fechados[index].adjacentes.find(el => el.prox.nome === no.nome);

          // Custo real acumulado até esse nó (g(n))
          /* VER SE TA CERTO */
          no.custoAcumulado = adjData.custo + adjData.turbulencia + fechados[index].custoAcumulado;

          // Custo estimado calculado com a heuristica (f(n) = h(n) + g(n))
          no.custoCalculado = no.heuristica + no.custoAcumulado;
        }
      })

      // Ordena a lista de nós abertos
      sortList(abertos);


      // Pega o nó de menor custo
      let noEscolhido = abertos[0];

      /* DEBUG */
      console.log("noAtual: " + fechados[index].nome);
      console.table(abertos)
      console.log("noEscolhido: " + noEscolhido.nome);
      /*   DEBUG */

      // Colocar na lista de nós fechados
      fechados.push(noEscolhido);
      this.updateHistorico(abertos, fechados);

      // Tirar da lista de nós abertos
      abertos.splice(0, 1)

      // Avalia o proximo nó;
      index++;
    }
    // Se loopar infinitamente e n chegar no destino, printa error e mensagem na tela
    if (index === 10000 && fechados[index].nome !== destino.nome) {
      window.alert("O algoritmo a* não pode encontrar uma solução dentro de 10000 passos!\nCheque o console para mais detalhes!")
      console.error("Não foi possivel encontrar uma solução para o a*!\n Podem ter ocorrido da heuristica não estar correta!")
    }
    /* RESULTADO */
    console.table(fechados)
    return fechados;
  }
}

// TESTE
/*
let a = 0;
let grafo = new Grafo();
let lista_de_nos = [
  new No("Quessada", 0, 0),
  new No("Sara", 4, 0),
  new No("Vini", 5, 5),
  new No("Anitta", 0, 7),
  new No("Cavo", 10, 10),
]
let listaAdjacencias = [
  [
    new Adjacencia(lista_de_nos[1]),
    new Adjacencia(lista_de_nos[2])
  ],
  [
    new Adjacencia(lista_de_nos[4])
  ],
  [
    new Adjacencia(lista_de_nos[1]),
    new Adjacencia(lista_de_nos[2]),
    new Adjacencia(lista_de_nos[3]),
    // new Adjacencia(lista_de_nos[4])
  ],
  [
    new Adjacencia(lista_de_nos[4])
  ],
  []
]

lista_de_nos.forEach((el, idx) => {
  grafo.addNo(el);
  listaAdjacencias[idx].forEach(adj => {
    grafo.nos[idx].addAdjacencia(adj);
  });
})
*/