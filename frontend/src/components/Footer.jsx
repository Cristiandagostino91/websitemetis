import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { contactInfo } from '../mock/mockData';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4 bg-white p-3 rounded-lg inline-block">
              <img 
                src="https://customer-assets.emergentagent.com/job_5d21aff3-00f1-40fd-a0d6-82da65fac292/artifacts/gr1gcz9c_medici-Centro-Salerno-Logo-151w.webp" 
                alt="Centro Metis Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Studio nutrizionale che offre consulenze specialistiche e percorsi personalizzati per il tuo benessere.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Link Rapidi</h3>
            <ul className="space-y-2">
              <li><Link to="/chi-siamo" className="text-sm hover:text-green-500 transition-colors">Chi Siamo</Link></li>
              <li><Link to="/servizi" className="text-sm hover:text-green-500 transition-colors">Servizi</Link></li>
              <li><Link to="/prodotti" className="text-sm hover:text-green-500 transition-colors">Prodotti</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-green-500 transition-colors">Blog</Link></li>
              <li><Link to="/prenota" className="text-sm hover:text-green-500 transition-colors">Prenota Visita</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Servizi</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-green-500 transition-colors cursor-pointer">Bioterapia Nutrizionale</li>
              <li className="hover:text-green-500 transition-colors cursor-pointer">Dieta Chetogenica</li>
              <li className="hover:text-green-500 transition-colors cursor-pointer">Nutrizione Sportiva</li>
              <li className="hover:text-green-500 transition-colors cursor-pointer">Nutrizione in Gravidanza</li>
              <li className="hover:text-green-500 transition-colors cursor-pointer">Nutrizione Oncologica</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  {contactInfo.address}<br />
                  {contactInfo.city}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="text-sm hover:text-green-500 transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-sm hover:text-green-500 transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Centro Metis. Tutti i diritti riservati. | Iscrizione Albo n. 052079
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;