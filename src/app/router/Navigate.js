
import RouteSwitcher from '../utilities/RouteSwitcher';

export default {
  toPage: (i) => {
    const url = `/sample/${i}`;
    const hist = RouteSwitcher.getHistory();
    hist.push(url);
  },

  toHome: () => {
    const url = '/';
    const hist = RouteSwitcher.getHistory();
    hist.push(url);
  },
};
