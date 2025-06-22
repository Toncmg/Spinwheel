const pokemons = [
  { nome: 'Xatu', imagem: 'imgs/xatu.png', silhueta: 'imgs/xatu2.png', som: 'sons/xatu.mp3' },
  { nome: 'Raichu', imagem: 'imgs/raichu.png', silhueta: 'imgs/raichu2.png', som: 'sons/raichu.mp3' },
  { nome: 'Magcargo', imagem: 'imgs/magcargo.png', silhueta: 'imgs/magcargo2.png', som: 'sons/magcargo.mp3' },
  { nome: 'Venusaur', imagem: 'imgs/venusaur.png', silhueta: 'imgs/venusaur2.png', som: 'sons/venusaur.mp3' },
  { nome: 'Blastoise', imagem: 'imgs/blastoise.png', silhueta: 'imgs/blastoise2.png', som: 'sons/blastoise.mp3' },
  { nome: 'Charizard', imagem: 'imgs/charizard.png', silhueta: 'imgs/charizard2.png', som: 'sons/charizard.mp3' },
  { nome: 'Venomoth', imagem: 'imgs/venomoth.png', silhueta: 'imgs/venomoth2.png', som: 'sons/venomoth.mp3' },
  { nome: 'Machamp', imagem: 'imgs/machamp.png', silhueta: 'imgs/machamp2.png', som: 'sons/machamp.mp3' },
  { nome: 'Marowak', imagem: 'imgs/marowak.png', silhueta: 'imgs/marowak2.png', som: 'sons/marowak.mp3' },
  { nome: 'Pidgeot', imagem: 'imgs/pidgeot.png', silhueta: 'imgs/pidgeot2.png', som: 'sons/pidgeot.mp3' },
  { nome: 'Muk', imagem: 'imgs/muk.png', silhueta: 'imgs/muk2.png', som: 'sons/muk.mp3' },
  { nome: 'Feraligatr', imagem: 'imgs/feraligatr.png', silhueta: 'imgs/feraligatr2.png', som: 'sons/feraligatr.mp3' },
  { nome: 'Tentacruel', imagem: 'imgs/tentacruel.png', silhueta: 'imgs/tentacruel2.png', som: 'sons/tentacruel.mp3' },
  { nome: 'Meganium', imagem: 'imgs/meganium.png', silhueta: 'imgs/meganium2.png', som: 'sons/meganium.mp3' },
  { nome: 'Pinsir', imagem: 'imgs/pinsir.png', silhueta: 'imgs/pinsir2.png', som: 'sons/pinsir.mp3' }
];

const canvas = document.getElementById('roleta');
const ctx = canvas.getContext('2d');
const angle = 2 * Math.PI / pokemons.length;
let currentAngle = 0;
let animation;

function drawWheel() {
  ctx.clearRect(0, 0, 500, 500);
  for (let i = 0; i < pokemons.length; i++) {
    const start = currentAngle + i * angle;
    const end = start + angle;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.fillStyle = `hsl(${(i * 360) / pokemons.length}, 80%, 60%)`;
    ctx.arc(250, 250, 250, start, end);
    ctx.fill();

    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(start + angle / 2);
    ctx.font = '11px "Press Start 2P"';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(pokemons[i].nome, 70, 0);
    ctx.fillStyle = '#fff';
    ctx.fillText(pokemons[i].nome, 70, 0);
    ctx.restore();
  }
}

function atualizarSilhueta(anguloAtual) {
  const bruto = ((Math.PI * 1.5 - anguloAtual + 2 * Math.PI) % (2 * Math.PI)) / angle;
  let index = Math.floor(bruto);
  index = ((index % pokemons.length) + pokemons.length) % pokemons.length;

  const escolhido = pokemons[index];
  if (!escolhido) return;

  const img = document.getElementById('imagemPokemon');
  img.src = escolhido.silhueta;
  img.style.opacity = '1';  // Garante que a silhueta seja visível durante o giro
}

function girarRoleta() {
  // Esconde os botões e inicia o som de giro
  document.getElementById('girarButton').style.opacity = '0';
  document.getElementById('iconePokebola').style.opacity = '0';
  document.getElementById('nomePokemon').innerText = '';
  document.getElementById('imagemPokemon').style.opacity = '1';
  document.getElementById('somRoleta').play();

  const voltas = 5;
  const destino = Math.random() * 2 * Math.PI;
  const alvo = voltas * 2 * Math.PI + destino;

  let start = null;

  function easeOutCubic(t) {
    return (--t) * t * t + 1;
  }

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    let t = Math.min(progress / 6000, 1);
    const ease = easeOutCubic(t);
    const rotation = currentAngle + ease * (alvo - currentAngle);
    currentAngle = rotation % (2 * Math.PI); // Mantém o valor dentro de uma volta completa

    drawWheel();
    atualizarSilhueta(rotation);

    const ponteiro = document.getElementById('ponteiroImagem');

    // Aplica a animação de vibração conforme o andamento do giro
    if (progress < 1500) {
      ponteiro.style.animation = 'vibrarRapido 0.1s infinite alternate';
    } else if (progress < 3000) {
      ponteiro.style.animation = 'vibrarMedio 0.2s infinite alternate';
    } else if (progress < 4500) {
      ponteiro.style.animation = 'vibrarLento 0.3s infinite alternate';
    } else {
      ponteiro.style.animation = 'vibrarUltraLento 0.5s infinite alternate';
    }

    if (progress < 6000) {
      animation = requestAnimationFrame(animate);
    } else {
      // Encerra a animação: para a vibração e fixa o ponteiro
      ponteiro.style.animation = 'none';
      ponteiro.style.transform = 'rotate(0deg)';
      document.getElementById('somRoleta').pause();
      document.getElementById('somRoleta').currentTime = 0;
      document.getElementById('somVitoria').play();
      mostrarResultadoFinal(currentAngle);
    }
  }

  cancelAnimationFrame(animation);
  animation = requestAnimationFrame(animate);
}

function mostrarResultadoFinal(anguloFinal) {
  const bruto = ((Math.PI * 1.5 - anguloFinal + 2 * Math.PI) % (2 * Math.PI)) / angle;
  let index = Math.floor(bruto);
  index = ((index % pokemons.length) + pokemons.length) % pokemons.length;

  const escolhido = pokemons[index];
  document.getElementById('nomePokemon').innerText = escolhido.nome;
  const img = document.getElementById('imagemPokemon');

  img.src = escolhido.imagem;
  img.onload = () => {
    img.style.opacity = '1'; // Exibe a imagem após o carregamento
  };

  const som = document.getElementById('somPokemon');
  som.pause();
  som.currentTime = 0;
  som.src = escolhido.som;
  som.load();
  som.oncanplaythrough = () => {
    som.play().catch(err => console.error('Erro ao reproduzir som:', err));
  };

  // Exibe o botão "Girar" e o ícone da Pokébola após o fim da reprodução
  som.onended = () => {
    document.getElementById('girarButton').style.opacity = '1';
    document.getElementById('iconePokebola').style.opacity = '1';
  };
}

let theme = 'poke';

function mudarTema(newTheme) {
  // Remove a classe 'selected' de todas as Pokébolas
  const pokebolas = document.querySelectorAll('.theme-pokebola');
  pokebolas.forEach(pokebola => pokebola.classList.remove('selected'));

  // Adiciona a classe 'selected' à Pokébola do tema ativo
  const pokebolaAtiva = document.querySelector(`img[alt="${newTheme}"]`);
  if (pokebolaAtiva) {
    pokebolaAtiva.classList.add('selected');
  }

  // Muda o tema do corpo
  document.body.classList.remove(theme);
  document.body.classList.add(newTheme);
  theme = newTheme;

  if (theme === 'poke') {
    document.getElementById('iconePokebola').src = 'imgs/poke.png';
  } else if (theme === 'ultra') {
    document.getElementById('iconePokebola').src = 'imgs/ultra.png';
  } else if (theme === 'great') {
    document.getElementById('iconePokebola').src = 'imgs/great.png';
  } else if (theme === 'gs') {
    document.getElementById('iconePokebola').src = 'imgs/gs.png';
  } else if (theme === 'master') {
    document.getElementById('iconePokebola').src = 'imgs/master.png';
  }
}

window.onload = drawWheel;
