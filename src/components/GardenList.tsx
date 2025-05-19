// import React from 'react';
// import GardenCard from './GardenCard';

// const gardens = [
//     {
//         id: '1',
//         name: "L'Hort de Gavà",
//         location: "Gavà de Mar",
//         imageUrl: "https://images.pexels.com/photos/3584283/pexels-photo-3584283.jpeg",
//         isVolunteerAvailable: true,
//         isProductAvailable: true
//     },
//     {
//         id: '2',
//         name: "L'Hort del Sol",
//         location: "Roda de Barà",
//         imageUrl: "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg",
//         isVolunteerAvailable: false,
//         isProductAvailable: true
//     },
//     {
//         id: '3',
//         name: "Planters d'horta Mas Pastoret",
//         location: "Torredembarra",
//         imageUrl: "https://images.pexels.com/photos/2480410/pexels-photo-2480410.jpeg",
//         isVolunteerAvailable: true,
//         isProductAvailable: false
//     },
//     {
//         id: '4',
//         name: "Los huertos de los Abuelos de Sitges",
//         location: "Sitges",
//         imageUrl: "https://images.pexels.com/photos/6231870/pexels-photo-6231870.jpeg",
//         isVolunteerAvailable: false,
//         isProductAvailable: true
//     },
//     {
//         id: '5',
//         name: "Los huertos del mar",
//         location: "Lloret de Mar",
//         imageUrl: "https://images.pexels.com/photos/2100002/pexels-photo-2100002.jpeg",
//         isVolunteerAvailable: true,
//         isProductAvailable: true
//     },
//     {
//         id: '6',
//         name: "L'Hort de Tarragona",
//         location: "Tarragona",
//         imageUrl: "https://images.pexels.com/photos/1169084/pexels-photo-1169084.jpeg",
//         isVolunteerAvailable: true,
//         isProductAvailable: true
//     },
//     {
//         id: '7',
//         name: "L'Hort de Salou",
//         location: "Salou",
//         imageUrl: "https://images.pexels.com/photos/3737595/pexels-photo-3737595.jpeg",
//         isVolunteerAvailable: true,
//         isProductAvailable: false
//     },
//     {
//         id: '8',
//         name: "Planters de Lleida",
//         location: "Lleida",
//         imageUrl: "https://images.pexels.com/photos/2751755/pexels-photo-2751755.jpeg",
//         isVolunteerAvailable: false,
//         isProductAvailable: true
//     }
// ];

// const GardenList: React.FC = () => {
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {gardens.map((garden) => (
//                     <GardenCard
//                         key={garden.id}
//                         name={garden.name}
//                         location={garden.location}
//                         imageUrl={garden.imageUrl}
//                         isVolunteerAvailable={garden.isVolunteerAvailable}
//                         isProductAvailable={garden.isProductAvailable}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default GardenList;