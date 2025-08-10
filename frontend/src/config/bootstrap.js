import { 
  BButton, 
  BAlert, 
  BRow,
  BCol,
  BFormInput,
  BListGroup,
  BListGroupItem } from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

export default function installBootstrap(app) {
  app.component('BButton', BButton);
  app.component('BAlert', BAlert);
  app.component('BRow', BRow);
  app.component('BCol', BCol);
  app.component('BFormInput', BFormInput);
  app.component('BListGroup', BListGroup);
  app.component('BListGroupItem', BListGroupItem);
}