import React from 'react';
import { teamMember } from '../mock/mockData';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, Award, Heart, Users } from 'lucide-react';

const ChiSiamo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chi Siamo</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Il tuo partner per un percorso di salute e benessere
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Centro Metis</h2>
            <p className="text-lg text-gray-600 mb-4">
              Centro Metis è uno studio nutrizionale specializzato in bioterapia nutrizionale, 
              situato a Bellizzi in provincia di Salerno. Offriamo consulenze specialistiche 
              per pazienti di tutte le età, con un approccio personalizzato e scientifico.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Il nostro metodo si basa sull'utilizzo di indagini strumentali avanzate come 
              bioimpedenziometria, calorimetria indiretta e adipometria, che ci permettono 
              di strutturare piani nutrizionali su misura per ogni paziente.
            </p>
            <p className="text-lg text-gray-600">
              Ci occupiamo di diete chetogeniche per obesità, nutrizione sportiva, alimentazione 
              in gravidanza e allattamento, nutrizione oncologica e molto altro.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
              alt="Centro Metis"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Heart, title: 'Passione', desc: 'Amore per ciò che facciamo' },
            { icon: Award, title: 'Professionalità', desc: 'Esperienza e competenza' },
            { icon: Users, title: 'Personalizzazione', desc: 'Piani su misura' },
            { icon: CheckCircle, title: 'Risultati', desc: 'Obiettivi concreti' }
          ].map((value, idx) => (
            <Card key={idx} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Member */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative h-96 lg:h-auto">
              <img
                src={teamMember.image}
                alt={teamMember.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{teamMember.name}</h2>
              <p className="text-xl text-green-600 mb-2">{teamMember.role}</p>
              <p className="text-sm text-gray-500 mb-6">{teamMember.qualification}</p>
              <p className="text-gray-600 mb-6">{teamMember.bio}</p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Specializzazioni</h3>
              <div className="grid grid-cols-1 gap-2">
                {teamMember.specializations.map((spec, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              La nostra mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              "Il cibo sia la tua medicina". Crediamo fermamente che per mantenere uno stato 
              di salute ottimale il primo passo sia nutrirsi in maniera consapevole ed equilibrata. 
              Il nostro obiettivo è accompagnarti in un percorso di benessere personalizzato, 
              supportato dalla scienza e dalla nostra esperienza.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiSiamo;