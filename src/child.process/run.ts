import Kladr from '../class/Kladr';

switch (process.env.botName) {
  // линтер протестует против простого new Kladr()
  case 'Kladr': (() => new Kladr())(); break;
  default:
    process.exit();
}
