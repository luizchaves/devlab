import 'preline';
import '@iconify/iconify';

import InvestmentForm from './components/InvestmentForm';
import Modal from './components/Modal';
import Investments from './lib/investments';
import Storage from './services/storage';
import { investments } from './data/seed';

import '../css/style.css';

Storage.load('investments', investments);

Investments.load();

InvestmentForm.create();

Modal.create();
