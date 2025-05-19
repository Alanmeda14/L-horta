// import React from "react"

// interface GardenCardProps {
//     name: string;
//     location: string;
//     imageUrl: string;
//     isVolunteerAvailable: boolean;
//     isProductAvailable: boolean;
// }

// const GardenCard: React.FC<GardenCardProps> = ({ 
//     name, 
//     location, 
//     imageUrl,
//     isVolunteerAvailable,
//     isProductAvailable 
// }) => {
//     return (
//         <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">

//             <div className="h-48 overflow-hidden relative">
//                 <img
//                     src={imageUrl}
//                     alt={name}
//                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//                 />
//                 <div className="absolute bottom-0 right-0 p-2 flex gap-2">
//                     {isProductAvailable && (
//                         <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
//                             Productos
//                         </span>
//                     )}
//                     {isVolunteerAvailable && (
//                         <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
//                             Voluntariado
//                         </span>
//                     )}
//                 </div>
//             </div>
//             <div className="p-4 border-t border-green-100">
//                 <h3 className="text-lg font-medium text-gray-900">{name}</h3>
//                 <p className="mt-1 text-gray-600">{location}</p>
//             </div>
//         </div>
//     );
// };

// export default GardenCard;