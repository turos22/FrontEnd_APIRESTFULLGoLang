import Produto from '../models/Produtos'; 

const produtos: Produto[] = [
  {
    id: 1,
    nome: "Mouse Gamer Sem Fio RGB",
    descricao: "Mouse ergonômico com sensor óptico de 16000 DPI, bateria recarregável e 6 botões programáveis.",
    preco: 289.90,
    imagem: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80"
  },
  {
    id: 2,
    nome: "Teclado Mecânico Backlight",
    descricao: "Teclado mecânico compacto (60%) com switches azuis, iluminação LED e cabo de nylon trançado removível.",
    preco: 349.00,
    imagem: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
  },
  {
    id: 3,
    nome: "Headset Gamer 7.1 Surround",
    descricao: "Headset com isolamento acústico, microfone omnidirecional com cancelamento de ruído e almofadas em couro sintético.",
    preco: 199.50,
    imagem: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80"
  },
  {
    id: 4,
    nome: "Monitor Monitor Ultrawide 29''",
    descricao: "Painel IPS com resolução Full HD+, taxa de atualização de 75Hz e tempo de resposta de 1ms com AMD FreeSync.",
    preco: 1149.90,
    imagem: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
  },
  {
    id: 5,
    nome: "Webcam Full HD 1080p",
    descricao: "Webcam para streaming com foco automático, microfone duplo embutido e tampa de privacidade inclusa.",
    preco: 245.00,
    imagem: "https://images.unsplash.com/photo-1600541519463-f245224e758a?w=500&q=80"
  },
  {
    id: 6,
    nome: "Suporte Articulado para Monitor",
    descricao: "Suporte com pistão a gás para telas de 17 a 35 polegadas, ajuste de altura e rotação de 360 graus.",
    preco: 189.00,
    imagem: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80"
  }
];

export default produtos;