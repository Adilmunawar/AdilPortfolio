'use client';
import { LogoLoop } from './LogoLoop';

const certificates = [
  { src: '/advance webhook concepts.png', alt: 'Advanced Webhook Concepts Certificate' },
  { src: '/advanced performance measurements.png', alt: 'Advanced Performance Measurements Certificate' },
  { src: '/CCAI frontend Integrations.png', alt: 'CCAI Frontend Integrations Certificate' },
  { src: '/MLOPS.png', alt: 'MLOPS Certificate' },
  { src: '/MLOPS with vertex AI.png', alt: 'MLOPS with Vertex AI Certificate' },
  { src: '/application modern.png', alt: 'Application Modernization Certificate' },
  { src: '/Google Ads apps.png', alt: 'Google Ads Apps Certificate' },
  { src: '/aws.png', alt: 'AWS Certificate' },
];

const Achievements = () => {
  return (
    <div className="relative w-full overflow-hidden py-12">
      <LogoLoop 
        logos={certificates} 
        speed={50} 
        fadeOut={true} 
        logoHeight={224} // h-56
        gap={32} // mx-4 (1rem = 16px) -> 32px
        pauseOnHover={true}
        renderItem={(item, key) => (
          'src' in item ? (
            <div 
              key={key}
              className="group relative flex-shrink-0"
              style={{
                width: '320px', // w-80
                height: '224px', // h-56
              }}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-300">
                <img
                  src={item.src}
                  alt={item.alt || ''}
                  className="p-2 transition-transform duration-300 group-hover:scale-105 object-contain w-full h-full"
                />
                 <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
            </div>
          ) : null
        )}
      />
      <div className="text-center mt-12 relative z-10">
        <h3 className="text-3xl font-bold text-gradient-slow">
          Achievements
        </h3>
      </div>
    </div>
  );
};

export default Achievements;
