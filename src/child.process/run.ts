import Kladr from '../class/Kladr';

switch (process.env.botName) {
  case 'Kladr': new Kladr(); break;
  default:
    process.exit();
}
