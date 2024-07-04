import Kladr from '../class/Kladr';
import Delline from '../class/Delline';

switch (process.env.botName) {
  // линтер протестует против простого new Kladr()
  case 'Kladr': (() => new Kladr())(); break;
  case 'Delline': (() => new Delline())(); break;
  default:
    process.exit();
}
