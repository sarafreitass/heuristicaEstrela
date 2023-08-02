//VAR GLOBAIS
let aviao;
let destinoAtual;
let progresso = 0;
let velocidade = 0.01;
let telaAtual = 0;
let BotX1 = 200;
let BotY1 = 300;
let largBot1 = 200;
let altBot1 = 64;
//retangulo
let rectWidth = 200, rectHeight = 50, radius = 20;
let divisionWidth = rectWidth / 3;
let folhas = [];

let BotX2 = 150;
let BotY2 = 250;
let largBot2 = 200;
let altBot2 = 64;

// Form Data
let inicio = window.document.querySelector("#noinicial");
let destino = window.document.querySelector("#nofinal");
let checkbox = window.document.querySelector("#heuristica");
let listaAbertosDOM = window.document.querySelector("#listaAbertos");
let listaFechadosDOM = window.document.querySelector("#listaFechados");

let grafo;
let fechados;


//CONFIGURAÇÕES E APRESENTAÇÃO DA TELA

function setup() {
  createCanvas(600, 600);
  frameRate(60)
  noStroke();
  // criaGrafo();
  aviao = new Aviao();
}

function preload() {
  img_aviao = loadImage("imagens/aviao.png");
  img_comecar = loadImage("imagens/start.png");
  img_arvore = loadImage("imagens/tree.png");
}

function draw() {
  if (telaAtual == 0) { telaStart(); }

  else if (telaAtual == 1) { telaAviao(); }

  else if (telaAtual == 2) { arvore(); }

}

//CLASSES

class Aviao {
  constructor() {
    this.posX = 0;
    this.posY = 0;
  }

  mover(destino) {

    let indice_final = (fechados.length) - 1;

    if (progresso >= 1) {
      this.posX = destino.x;
      this.posY = destino.y;
      progresso = 0; // zera o progresso para o avião poder ir para o próximo no

      // Atualiza o destino para o próximo nó no grafo
      // console.log(fechados);
      let indexAtual = fechados.indexOf(destino);
      let indexProximo = indexAtual + 1;
      atualizaListasNaTela(indexAtual);
      destinoAtual = fechados[indexProximo];

      if (indexAtual == fechados.length - 1) {
        telaAtual = 2;
      }
    }

    let posX = lerp(this.posX, destino.x, progresso); //realiza a movimentação 
    let posY = lerp(this.posY, destino.y, progresso);

    imageMode(CENTER); // deixa o avião no meio do círculo 
    image(img_aviao, posX, posY, 40, 40);

    progresso += velocidade;
    if (progresso >= 1) {
      progresso = 1;
    }
  }
};

//FUNÇÕES ADICIONAIS

function criaGrafo() {
  // Criação dos nós do grafo
  grafo.addNo(new No('New York', 240, 100)); //zero
  grafo.addNo(new No('Winnipeg', 200, 50)); //um
  grafo.addNo(new No('Cidade do México', 150, 200)); //dois
  grafo.addNo(new No('Reykjavík', 300, 60)); //tres
  grafo.addNo(new No('Paris', 360, 120)); //quatro
  grafo.addNo(new No('Vancouver', 80, 50));//cinco
  grafo.addNo(new No('San Francisco', 150, 160));//seis
  grafo.addNo(new No('Bogotá', 130, 255)); //sete
  grafo.addNo(new No('Buenos Aires', 190, 495)); //oito
  grafo.addNo(new No('Brasília', 210, 375)); //nove
  grafo.addNo(new No('Lima', 90, 305)); //dez
  grafo.addNo(new No('Manaus', 170, 305)); //onze
  grafo.addNo(new No('Joanesburgo', 300, 450)); //doze
  grafo.addNo(new No('Lagos', 290, 285)); //treze
  grafo.addNo(new No('Moscou', 450, 90)); //quatorze
  grafo.addNo(new No('Viena', 400, 140)); //quinze
  grafo.addNo(new No('Trípoli', 300, 220)); //dezeseis
  grafo.addNo(new No('Perth', 550, 374));//dezessete
  grafo.addNo(new No('Nairóbi', 360, 375)); //dezoito
  grafo.addNo(new No('Riad', 395, 285)); //dezenove
  grafo.addNo(new No('Omsk', 575, 66)); //vinte

  atribuiAnexos();
}

function atribuiAnexos() {
  let adjacencias = [

    //new york
    [
      new Adjacencia(grafo.nos[1]), //winnipeg
      new Adjacencia(grafo.nos[2]), //mexico
      new Adjacencia(grafo.nos[3]), // rey
      new Adjacencia(grafo.nos[4]) //paris
    ],
    //winnipeg
    [
      new Adjacencia(grafo.nos[0]), //new york
      new Adjacencia(grafo.nos[5]) //van
    ],
    //cidade do mexico
    [
      new Adjacencia(grafo.nos[6]),//san
      new Adjacencia(grafo.nos[0]),//new york
      new Adjacencia(grafo.nos[7]) //bogota     
    ],

    //rey
    [
      new Adjacencia(grafo.nos[4]),//paris
      new Adjacencia(grafo.nos[0]),//new york
      new Adjacencia(grafo.nos[14]) //moscou     
    ],

    //paris
    [
      new Adjacencia(grafo.nos[15]),//viena
      new Adjacencia(grafo.nos[0]),//new york
      new Adjacencia(grafo.nos[3]), //rey
      new Adjacencia(grafo.nos[16]) //tripole
    ],

    //vancover
    [
      new Adjacencia(grafo.nos[6]),//sao francisco
      new Adjacencia(grafo.nos[1]) //vinipeg
    ],


    //san francisco
    [
      new Adjacencia(grafo.nos[5]),//van
      new Adjacencia(grafo.nos[2]) //mexico
    ],
    //bogota
    [
      new Adjacencia(grafo.nos[10]), //lima 
      new Adjacencia(grafo.nos[2]), //mexico
      new Adjacencia(grafo.nos[11]) //manaus
    ],
    //buenos aires
    [
      new Adjacencia(grafo.nos[9]), //brasilia 
      new Adjacencia(grafo.nos[10]), //lima
      new Adjacencia(grafo.nos[11]), //manaus
      new Adjacencia(grafo.nos[12]) //joanes
    ],

    //brasilia
    [
      new Adjacencia(grafo.nos[13]), //lagos 
      new Adjacencia(grafo.nos[8]), //buenos
      new Adjacencia(grafo.nos[11]) //manaus
    ],


    //lima
    [
      new Adjacencia(grafo.nos[7]), //bogota 
      new Adjacencia(grafo.nos[8]) //buenos
    ],

    //manaus
    [
      new Adjacencia(grafo.nos[7]), //bogota 
      new Adjacencia(grafo.nos[8]), //buenos
      new Adjacencia(grafo.nos[9]) //brasilia
    ],

    //joenes
    [
      new Adjacencia(grafo.nos[13]), //lagos 
      new Adjacencia(grafo.nos[8]), //buenos
      new Adjacencia(grafo.nos[17]),//purch
      new Adjacencia(grafo.nos[18])//nairobi
    ],

    //lagos
    [
      new Adjacencia(grafo.nos[9]), //brasilia 
      new Adjacencia(grafo.nos[16]), //tripole
      new Adjacencia(grafo.nos[19]),//hiad
      new Adjacencia(grafo.nos[18]),//nairob
      new Adjacencia(grafo.nos[12]) //joanes
    ],

    //moscou
    [
      new Adjacencia(grafo.nos[15]), //viena 
      new Adjacencia(grafo.nos[3]), //rey
      new Adjacencia(grafo.nos[20])//onsc
    ],

    //viena
    [
      new Adjacencia(grafo.nos[16]), //tripole 
      new Adjacencia(grafo.nos[4]), //paris
      new Adjacencia(grafo.nos[14])//moscou
    ],

    //tripole
    [
      new Adjacencia(grafo.nos[15]), //viena 
      new Adjacencia(grafo.nos[4]), //paris
      new Adjacencia(grafo.nos[13])//lagos
    ],

    //perfh
    [
      new Adjacencia(grafo.nos[12]) //joanes
    ],

    //nairobi
    [
      new Adjacencia(grafo.nos[12]), //joanes 
      new Adjacencia(grafo.nos[19]), //riad
      new Adjacencia(grafo.nos[13])//lagos
    ],

    //riad
    [
      new Adjacencia(grafo.nos[18]), //nairobi 
      new Adjacencia(grafo.nos[13]) //lagos
    ],

    //omsk
    [
      new Adjacencia(grafo.nos[14]) //moscou
    ]
  ]

  grafo.nos.forEach((el, idx) => {
    adjacencias[idx].forEach(adj => {
      el.addAdjacencia(adj);
    });
  })
}

function telaAviao() {
  background("#fff3f2");

  // Desenho dos nós do grafo
  for (let i = 0; i < grafo.nos.length; i++) {
    grafo.nos[i].desenhaAdjacentes();
    grafo.nos[i].criacao();
  }
  // Movimentação
  aviao.mover(destinoAtual);

};

function atualizaListasNaTela(index, g = grafo) {
  console.log(index);
  let abertos = g.historico.abertos[index].map(el =>` ${el.nome}`);
  let fechados = g.historico.fechados[index].map(el => ` ${el.nome}`);

  let listaAbertos = window.document.createElement("li");
  let listaFechados = window.document.createElement("li");

  listaAbertos.setAttribute("class", "lista-text")
  listaFechados.setAttribute("class", "lista-text")

  listaAbertos.innerText = abertos;
  listaFechados.innerText = fechados;

  listaAbertosDOM.appendChild(listaAbertos);

  listaFechadosDOM.appendChild(listaFechados);
}

function telaStart() {
  background(img_comecar);

  push();
  fill(225);
  circle(mouseX, mouseY, 10);
  pop();

  if (mouseX > BotX1 && mouseY >= BotY1 && mouseX <= (BotX1 + largBot1) && mouseY <= (BotY1 + altBot1)) {
    noFill();
    stroke(0);
    rect(BotX1, BotY1, largBot1, altBot1, 10);

    if (mouseIsPressed) {
      grafo = new Grafo(!checkbox.checked);
      criaGrafo();
      let noInicial = grafo.nos.find(element => element.nome.toLowerCase() == inicio.value.toLowerCase());
      let noDestino = grafo.nos.find(element => element.nome.toLowerCase() == destino.value.toLowerCase());
      telaAtual = 1;
      fechados = grafo.aStar(noInicial, noDestino);
      destinoAtual = fechados[0];
    }
  }
}

/*function irArvore() {

  //imageMode(CENTER); 
  let fundo = image(img_arvore,300, 300, 600, 600);

  background(img_arvore);
  push();
  fill(225);
  circle(mouseX, mouseY, 10);
  pop();

  if (mouseX > BotX2 && mouseY >= BotY2 && mouseX <= (BotX2 + largBot2) && mouseY <= (BotY2 + altBot2)) {
    noFill();
    stroke(0);
    rect(BotX2, BotY2, largBot2, altBot2, 10);

    if (mouseIsPressed) {
        telaAtual = 3;
    }
  }
}*/


class Tree {
  constructor(rectX, rectY, atual, anterior, custo) {
    this.atual = atual;
    this.anterior = anterior;
    this.custo = custo;
    this.rectX = rectX;
    this.rectY = rectY;
  }

  criacao() {
    fill('#AED3E3');
    rect(this.rectX, this.rectY, rectWidth, rectHeight, radius);

    fill(0);
    rect(this.rectX + divisionWidth, this.rectY, 1, rectHeight, radius);
    rect(this.rectX + divisionWidth * 2, this.rectY, 1, rectHeight, radius);

    textAlign(CENTER, CENTER);
    textSize(10);
    fill(0);

    text(this.atual, this.rectX + (divisionWidth / 2), this.rectY + rectHeight / 2);
    text(this.anterior, this.rectX + (divisionWidth * 1.5), this.rectY + rectHeight / 2);
    text(this.custo, this.rectX + (divisionWidth * 2.5), this.rectY + rectHeight / 2);
  }
}

function arvore(){
  var nox = 10;
  var noy = 5;
  var anterior = 'null';
  let aux = 0;

  fechados.forEach(function (mae) {
    console.log(fechados);
    // Verificar se o nó já existe na lista folhas
    let noExistente = folhas.find(function (folha) {
      return folha.atual === mae.nome;
    });
    let custo = Math.trunc(mae.custoAcumulado)
    if (!noExistente) {
    folhas.push(new Tree(nox, noy, mae.nome, anterior, custo));
    }
    
    anterior = mae.nome;
    ant_x = nox;
    let listaADJ = mae.adjacentes;
    noy = noy + rectHeight + 10;

    listaADJ.forEach(function (filho) {
      console.log(mae, filho)
      // Verificar se o nó já existe na lista folhas//
      let noExistente = folhas.find(function (folha) {
        return folha.atual === filho.nome;
      });

      if (!noExistente) {
        folhas.push(new Tree(nox, noy, filho.nome, anterior, mae.custoAcumulado));
        //nox = nox + 100;
      }
    });

  });

    for (let i = 0; i < folhas.length; i++) {
    folhas[i].criacao();
  }

}